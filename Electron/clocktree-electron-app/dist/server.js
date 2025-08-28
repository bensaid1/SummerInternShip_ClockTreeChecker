"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const validator_1 = require("./validator");
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
app.post("/api/validate", upload.single("file"), (req, res, next) => {
    if (req.file) {
        const tempPath = path_1.default.join(__dirname, `temp_upload_${Date.now()}_${Math.random()}.json`);
        fs_1.default.writeFileSync(tempPath, req.file.buffer);
        const result = (0, validator_1.validateJsonFile)(tempPath);
        fs_1.default.unlink(tempPath, (err) => {
            if (err)
                console.error("Erreur suppression temp_upload.json :", err.message);
        });
        return res.json(result);
    }
    next();
});
// Route POST /api/validate pour JSON brut (modification/revalidation)
app.post("/api/validate", (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ valid: false, errors: ["Aucun contenu JSON reçu."] });
        }
        const tempPath = path_1.default.join(__dirname, `temp_upload_${Date.now()}_${Math.random()}.json`);
        fs_1.default.writeFileSync(tempPath, JSON.stringify(req.body, null, 2), "utf-8");
        const result = (0, validator_1.validateJsonFile)(tempPath);
        fs_1.default.unlink(tempPath, (err) => {
            if (err)
                console.error("Erreur suppression temp_upload.json :", err.message);
        });
        res.json(result);
    }
    catch (e) {
        res.status(400).json({ valid: false, errors: ["Erreur de parsing ou de validation.", e.message] });
    }
});
// Nouvelle route pour mettre à jour un fichier JSON sur le disque + versioning
app.post("/api/update-file", (req, res) => {
    const { fileName, newContent } = req.body;
    if (!fileName || !newContent) {
        return res.status(400).json({ success: false, error: "fileName and newContent are required." });
    }
    const safeFileName = path_1.default.basename(fileName);
    const dataPath = path_1.default.join(__dirname, "..", "data", safeFileName);
    const historyDir = path_1.default.join(__dirname, "..", "history", safeFileName.replace(/\.json$/i, ""));
    if (!fs_1.default.existsSync(historyDir))
        fs_1.default.mkdirSync(historyDir, { recursive: true });
    if (fs_1.default.existsSync(dataPath)) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const historyFile = path_1.default.join(historyDir, `${timestamp}.json`);
        fs_1.default.copyFileSync(dataPath, historyFile);
        console.log("Historique sauvegardé dans :", historyFile);
    }
    const now = new Date().toLocaleString();
    console.log("Reçu update-file pour", safeFileName);
    console.log("Écriture dans :", dataPath);
    console.log("Contenu reçu :", newContent);
    try {
        fs_1.default.writeFileSync(dataPath, newContent, "utf-8");
        console.log(`[${now}] Fichier ${safeFileName} mis à jour dans /data.`);
        res.json({ success: true });
    }
    catch (e) {
        console.error(`[${now}] Erreur écriture fichier :`, e.message);
        res.status(500).json({ success: false, error: e.message });
    }
});
// Route pour lister l'historique d'un fichier
app.get("/api/history/:fileName", (req, res) => {
    const safeFileName = path_1.default.basename(req.params.fileName).replace(/\.json$/i, "");
    const historyDir = path_1.default.join(__dirname, "..", "history", safeFileName);
    if (!fs_1.default.existsSync(historyDir))
        return res.json([]);
    const files = fs_1.default.readdirSync(historyDir)
        .filter(f => f.endsWith(".json"))
        .map(f => ({
        file: f,
        date: f.replace(".json", "").replace(/-/g, ":")
    }))
        .sort((a, b) => b.file.localeCompare(a.file));
    res.json(files);
});
app.delete("/api/history/:fileName/:historyFile", (req, res) => {
    const safeFileName = path_1.default.basename(req.params.fileName).replace(/\.json$/i, "");
    const safeHistoryFile = path_1.default.basename(req.params.historyFile);
    const historyPath = path_1.default.join(__dirname, "..", "history", safeFileName, safeHistoryFile);
    try {
        if (fs_1.default.existsSync(historyPath)) {
            fs_1.default.unlinkSync(historyPath);
            res.json({ success: true });
        }
        else {
            res.status(404).json({ success: false, error: "File not found" });
        }
    }
    catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});
// ===============================
app.use("/history", express_1.default.static(path_1.default.join(__dirname, "..", "history")));
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 Serveur API démarré sur http://localhost:${PORT}`);
});
