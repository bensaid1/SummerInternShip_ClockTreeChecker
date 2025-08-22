import Ajv, { ErrorObject } from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";
import * as path from "path";
import { parse as parseJsonWithMap } from "json-source-map";

// --- Chargement du schéma ---
const ajv = new Ajv({ allErrors: true, strict: false, verbose: true });
addFormats(ajv);

const schemaPath = path.resolve(__dirname, "schema.json");
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
const validate = ajv.compile(schema);

// --- Utilitaires ---
function formatSimpleError(error: ErrorObject, pointerMap?: any): string {
  const instancePath = error.instancePath || "root";
  let positionInfo = "";
  if (pointerMap && pointerMap.pointers) {
    const pos = pointerMap.pointers[instancePath];
    if (pos && pos.key) {
      positionInfo = ` (ligne ${pos.key.line + 1}, colonne ${pos.key.column + 1})`;
    } else if (pos && pos.value) {
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
      return `❌ Erreur: propriété obligatoire '${(error.params as any).missingProperty}' manquante à '${instancePath}'.${positionInfo}`;
    case "type":
      return `❌ Erreur: type invalide pour '${instancePath}'. ${error.message}${positionInfo}`;
    case "const":
      return `❌ Erreur: '${instancePath}' doit être exactement '${(error.params as any).allowedValue}'.${positionInfo}`;
    case "additionalProperties":
      return `❌ Erreur: propriété non autorisée '${(error.params as any).additionalProperty}' à '${instancePath}'.${positionInfo}`;
    default:
      return `❌ Erreur: ${instancePath} ${error.message}${positionInfo}`;
  }
}

// --- Interfaces ---
interface PossibleInput {
  available: boolean;
  description: string;
  input_Id: string;
  label: string;
  from: string;
}

interface ClockElement {
  id: string;
  name: string;
  position: { x: number; y: number };
  type: string;
  label: { align: string; text: string };
  default: number | string;
  role?: string | null;
  block?: string | null;
  outputTargets: string[];
  unit?: { text: string; factor: string };
  description?: string | null;
  size: { width: number; height: number };
  isTrustZone?: boolean;
  oneOf?: any[];
  min?: number;
  max?: number;
  outOfRange?: boolean;
  fracDivisor?: { base: number; power: number };
  multiplicatorFactor?: any[];
  possible_Input?: PossibleInput[];
}

interface TransitionRoutingPoint {
  kind: string;
  x: number;
  y: number;
  pointIndex: number;
}

interface Transition {
  id: string;
  sourceTaskId: string;
  targetTaskId: string | string[];
  isVirtual: boolean;
  transitionRoutingPoint?: TransitionRoutingPoint[];
}

interface ClockTree {
  tree: {
    id: string;
    schema_version: string;
    elements: ClockElement[];
    transitions?: Transition[];
  };
}

// --- Validation personnalisée ---
function validateCustomRules(data: ClockTree, pointers?: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!data.tree || !Array.isArray(data.tree.elements)) {
    errors.push("Structure invalide : 'tree.elements' doit être un tableau.");
    return { valid: false, errors };
  }

  const elements = data.tree.elements;
  const ids: string[] = elements.map((e: ClockElement) => e.id);
  

  // --- Détection des ids dupliqués dans elements ---
  const duplicateElementIds = ids.filter((id, idx) => ids.indexOf(id) !== idx);
  if (duplicateElementIds.length > 0) {
    [...new Set(duplicateElementIds)].forEach(d =>
      errors.push(`❌ Erreur: id d'élément dupliqué trouvé: '${d}'.`)
    );
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
    [...new Set(duplicateTransitionIds)].forEach(d =>
      errors.push(`❌ Erreur: id de transition dupliqué trouvé: '${d}'.`)
    );
  }

  // --- Validation des transitions sortantes du multiplexor ---
  const multiplexors = elements.filter(el => el.type === "multiplexor");
  data.tree.transitions.forEach((tr, trIndex) => {
    multiplexors.forEach(mux => {
      if (tr.sourceTaskId === mux.id) {
        const targets = Array.isArray(tr.targetTaskId) ? tr.targetTaskId : [tr.targetTaskId];
        targets.forEach((target, idx) => {
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
            const found = mux.possible_Input?.some(
              pi => pi.input_Id === inputId && pi.from === from
            );
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
    if (!Array.isArray(mux.possible_Input)) return;
    const expectedTargetTaskIds = mux.possible_Input.map(
      input => `${input.input_Id}__${input.from}_input`
    );
    // Cherche les transitions sortantes du multiplexor
    const actualTargetTaskIds: string[] = [];
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
    })
    ;
  });

  

  return { valid: errors.length === 0, errors };
}

// --- Fonction principale ---
export function validateJsonFile(filePath: string): { valid: boolean; errors: string[] } {
  let jsonText: string;
  let data: unknown;
  let pointers: any;

  try {
    jsonText = fs.readFileSync(filePath, "utf-8");
    const parsed = parseJsonWithMap(jsonText);
    data = parsed.data;
    pointers = parsed.pointers;
  } catch (e: any) {
    return { valid: false, errors: ["Erreur de lecture ou de parsing du fichier JSON : " + e.message] };
  }

  const typedData = data as ClockTree;

  const validSchema = validate(typedData);
  const errors: string[] = [];

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