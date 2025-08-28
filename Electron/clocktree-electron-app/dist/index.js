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
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("./validator");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const args = process.argv.slice(2);
const inputPath = args[0] || path.resolve(__dirname, "../data");
function validateAndReport(filePath) {
    const { valid, errors } = (0, validator_1.validateJsonFile)(filePath);
    if (valid) {
        console.log(`🚀 [${path.basename(filePath)}] JSON valide et conforme à toutes les règles.`);
    }
    else {
        console.error(`❌ [${path.basename(filePath)}] Erreurs détectées :`);
        errors.forEach(err => console.error(err));
        // dossier errors
        const errorsDir = path.resolve(__dirname, "../errors");
        if (!fs.existsSync(errorsDir)) {
            fs.mkdirSync(errorsDir);
        }
        // nom du fichier d'erreurs
        const baseName = path.basename(filePath, path.extname(filePath));
        const errorFilePath = path.join(errorsDir, `${baseName}_errors.txt`);
        // contenu personnalisé
        const now = new Date();
        const formattedDate = now.toISOString().replace("T", " ").substring(0, 19);
        let errorContent = `===========================================\n`;
        errorContent += `📅 Date : ${formattedDate}\n`;
        errorContent += `📂 Fichier JSON analysé : ${path.basename(filePath)}\n`;
        errorContent += `===========================================\n\n`;
        errorContent += `⚠️ Erreurs détectées lors de la validation JSON :\n\n`;
        errors.forEach((err, index) => {
            errorContent += `${index + 1}. ${err}\n\n`;
        });
        errorContent += `-------------------------------------------\n`;
        errorContent += `Merci de corriger ces erreurs avant de réessayer.\n`;
        errorContent += `Pour toute question, contactez farah.kouki@st.com\n`;
        errorContent += `===========================================\n`;
        // Écrire les erreurs dans le fichier
        fs.writeFileSync(errorFilePath, errorContent, "utf-8");
        console.log(`\n📄 Fichier d'erreurs généré : ${errorFilePath}`);
        console.log(`📥 Vous pouvez télécharger ce fichier pour plus de détails .`);
    }
}
// Si c'est un dossier, on valide tous les fichiers .json dedans
if (fs.existsSync(inputPath) && fs.lstatSync(inputPath).isDirectory()) {
    const files = fs.readdirSync(inputPath)
        .filter(f => f.endsWith(".json"))
        .map(f => path.join(inputPath, f));
    if (files.length === 0) {
        console.log("Aucun fichier JSON trouvé dans le dossier.");
    }
    else {
        files.forEach(validateAndReport);
    }
}
else if (fs.existsSync(inputPath) && fs.lstatSync(inputPath).isFile()) {
    validateAndReport(inputPath);
}
else {
    console.error("Chemin invalide ou fichier/dossier introuvable :", inputPath);
    process.exit(1);
}
