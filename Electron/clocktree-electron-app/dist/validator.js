"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJsonFile = validateJsonFile;
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const json_source_map_1 = require("json-source-map");
// --- Chargement du schéma ---
const ajv = new ajv_1.default({ allErrors: true, strict: false, verbose: true });
(0, ajv_formats_1.default)(ajv);
const schemaPath = path.resolve(__dirname, "schema.json");
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
const validate = ajv.compile(schema);
// --- Utilitaires ---
function formatSimpleError(error, pointerMap) {
    const instancePath = error.instancePath || "root";
    let positionInfo = "";
    if (pointerMap && pointerMap.pointers) {
        const pos = pointerMap.pointers[instancePath];
        if (pos && pos.key) {
            positionInfo = ` (ligne ${pos.key.line + 1}, colonne ${pos.key.column + 1})`;
        }
        else if (pos && pos.value) {
            positionInfo = ` (ligne ${pos.value.line + 1}, colonne ${pos.value.column + 1})`;
        }
    }
    switch (error.keyword) {
        case "enum":
            if (instancePath.endsWith("/unit/text")) {
                return `❌ Erreur: '${instancePath}' a une valeur invalide '${error.data}'. Utilisez 'MHz' ou 'KHz'.${positionInfo}`;
            }
            return `❌ Erreur: '${instancePath}' doit être une des valeurs autorisées.${positionInfo}`;
        case "required":
            return `❌ Erreur: propriété obligatoire '${error.params.missingProperty}' manquante à '${instancePath}'.${positionInfo}`;
        case "type":
            return `❌ Erreur: type invalide pour '${instancePath}'. ${error.message}${positionInfo}`;
        case "const":
            return `❌ Erreur: '${instancePath}' doit être exactement '${error.params.allowedValue}'.${positionInfo}`;
        case "additionalProperties":
            return `❌ Erreur: propriété non autorisée '${error.params.additionalProperty}' à '${instancePath}'.${positionInfo}`;
        default:
            return `❌ Erreur: ${instancePath} ${error.message}${positionInfo}`;
    }
}
// --- Validation personnalisée ---
function validateCustomRules(data, pointers) {
    const errors = [];
    if (!data.tree || !Array.isArray(data.tree.elements)) {
        errors.push("Structure invalide : 'tree.elements' doit être un tableau.");
        return { valid: false, errors };
    }
    const elements = data.tree.elements;
    const ids = elements.map((e) => e.id);
    // --- Détection des ids dupliqués dans elements ---
    const duplicateElementIds = ids.filter((id, idx) => ids.indexOf(id) !== idx);
    if (duplicateElementIds.length > 0) {
        [...new Set(duplicateElementIds)].forEach(d => errors.push(`❌ Erreur: id d'élément dupliqué trouvé: '${d}'.`));
    }
    // --- Validation de la section transitions ---
    if (!("transitions" in data.tree)) {
        errors.push("❌ Erreur: la section 'transitions' est absente du JSON.");
        return { valid: false, errors };
    }
    // Si transitions est undefined ou null, erreur
    if (!Array.isArray(data.tree.transitions)) {
        errors.push("❌ Erreur: 'tree.transitions' doit être un tableau.");
        return { valid: false, errors };
    }
    // Si transitions est vide, ne pas faire de validation multiplexor
    if (data.tree.transitions.length === 0) {
        return { valid: errors.length === 0, errors };
    }
    // --- Détection des ids dupliqués dans transitions ---
    const transitionIds = data.tree.transitions.map(t => t.id);
    const duplicateTransitionIds = transitionIds.filter((id, idx) => transitionIds.indexOf(id) !== idx);
    if (duplicateTransitionIds.length > 0) {
        [...new Set(duplicateTransitionIds)].forEach(d => errors.push(`❌ Erreur: id de transition dupliqué trouvé: '${d}'.`));
    }
    // --- Validation des transitions sortantes du multiplexor ---
    const multiplexors = elements.filter(el => el.type === "multiplexor");
    data.tree.transitions.forEach((tr, trIndex) => {
        multiplexors.forEach(mux => {
            if (tr.sourceTaskId === mux.id) {
                const targets = Array.isArray(tr.targetTaskId) ? tr.targetTaskId : [tr.targetTaskId];
                targets.forEach((target, idx) => {
                    var _a;
                    if (typeof target === "string") {
                        // Format attendu : <input_Id>__<from>_input
                        const match = target.match(/^(.+?)__(.+?)_input$/);
                        if (!match) {
                            errors.push(`❌ Erreur: transition '${tr.id}' targetTaskId index ${idx} n'a pas le format '<input_Id>__<from>_input'.`);
                            return;
                        }
                        const inputId = match[1];
                        const from = match[2];
                        // Vérifie que inputId et from existent dans possible_Input
                        const found = (_a = mux.possible_Input) === null || _a === void 0 ? void 0 : _a.some(pi => pi.input_Id === inputId && pi.from === from);
                        if (!found) {
                            errors.push(`❌ Erreur: transition '${tr.id}' targetTaskId index ${idx} ne correspond à aucun couple input_Id/from du multiplexor '${mux.id}'.`);
                        }
                    }
                });
            }
        });
    });
    // Vérifie qu'il y a bien une transition sortante pour chaque possible_Input du multiplexor
    multiplexors.forEach(mux => {
        if (!Array.isArray(mux.possible_Input))
            return;
        const expectedTargetTaskIds = mux.possible_Input.map(input => `${input.input_Id}__${input.from}_input`);
        // Cherche les transitions sortantes du multiplexor
        const actualTargetTaskIds = [];
        if (Array.isArray(data.tree.transitions)) {
            data.tree.transitions.forEach(tr => {
                if (tr.sourceTaskId === mux.id) {
                    const targets = Array.isArray(tr.targetTaskId) ? tr.targetTaskId : [tr.targetTaskId];
                    targets.forEach(target => {
                        if (typeof target === "string") {
                            actualTargetTaskIds.push(target);
                        }
                    });
                }
            });
        }
        // Vérifie les manquants
        expectedTargetTaskIds.forEach(expectedId => {
            if (!actualTargetTaskIds.includes(expectedId)) {
                errors.push(`❌ Erreur: multiplexor '${mux.id}' attend une transition sortante vers '${expectedId}', mais elle est absente.`);
            }
        });
        // Vérifie les en trop
        actualTargetTaskIds.forEach(actualId => {
            if (!expectedTargetTaskIds.includes(actualId)) {
                errors.push(`❌ Erreur: transition sortante du multiplexor '${mux.id}' vers '${actualId}' non attendue.`);
            }
        });
    });
    return { valid: errors.length === 0, errors };
}
// --- Fonction principale ---
function validateJsonFile(filePath) {
    let jsonText;
    let data;
    let pointers;
    try {
        jsonText = fs.readFileSync(filePath, "utf-8");
        const parsed = (0, json_source_map_1.parse)(jsonText);
        data = parsed.data;
        pointers = parsed.pointers;
    }
    catch (e) {
        return { valid: false, errors: ["Erreur de lecture ou de parsing du fichier JSON : " + e.message] };
    }
    const typedData = data;
    const validSchema = validate(typedData);
    const errors = [];
    if (!validSchema && validate.errors && validate.errors.length > 0) {
        validate.errors.forEach(err => {
            errors.push(formatSimpleError(err, pointers));
        });
    }
    const { valid, errors: customErrors } = validateCustomRules(typedData, pointers);
    if (!valid) {
        errors.push(...customErrors);
    }
    return { valid: errors.length === 0, errors };
}
