import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { validateJsonFile } from "./validator";




const upload = multer({ storage: multer.memoryStorage() });

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));


app.post("/api/validate", upload.single("file"), (req, res, next) => {
  if (req.file) {
    const tempPath = path.join(__dirname, `temp_upload_${Date.now()}_${Math.random()}.json`);
    fs.writeFileSync(tempPath, req.file.buffer);

    const result = validateJsonFile(tempPath);

    fs.unlink(tempPath, (err) => {
      if (err) console.error("Erreur suppression temp_upload.json :", err.message);
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
    const tempPath = path.join(__dirname, `temp_upload_${Date.now()}_${Math.random()}.json`);
    fs.writeFileSync(tempPath, JSON.stringify(req.body, null, 2), "utf-8");

    const result = validateJsonFile(tempPath);

    fs.unlink(tempPath, (err) => {
      if (err) console.error("Erreur suppression temp_upload.json :", err.message);
    });

    res.json(result);
  } catch (e: any) {
    res.status(400).json({ valid: false, errors: ["Erreur de parsing ou de validation.", e.message] });
  }
});

// Nouvelle route pour mettre à jour un fichier JSON sur le disque + versioning
app.post("/api/update-file", (req, res) => {
  const { fileName, newContent } = req.body;
  if (!fileName || !newContent) {
    return res.status(400).json({ success: false, error: "fileName and newContent are required." });
  }

  const safeFileName = path.basename(fileName);
  const dataPath = path.join(__dirname, "..", "data", safeFileName);
  const historyDir = path.join(__dirname, "..", "history", safeFileName.replace(/\.json$/i, ""));
  if (!fs.existsSync(historyDir)) fs.mkdirSync(historyDir, { recursive: true });

  if (fs.existsSync(dataPath)) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const historyFile = path.join(historyDir, `${timestamp}.json`);
    fs.copyFileSync(dataPath, historyFile);
    console.log("Historique sauvegardé dans :", historyFile); 
  }

  const now = new Date().toLocaleString();

  console.log("Reçu update-file pour", safeFileName);
  console.log("Écriture dans :", dataPath);
  console.log("Contenu reçu :", newContent);

  try {
    fs.writeFileSync(dataPath, newContent, "utf-8");
    console.log(`[${now}] Fichier ${safeFileName} mis à jour dans /data.`);
    res.json({ success: true });
  } catch (e: any) {
    console.error(`[${now}] Erreur écriture fichier :`, e.message);
    res.status(500).json({ success: false, error: e.message });
  }
});

// Route pour lister l'historique d'un fichier
app.get("/api/history/:fileName", (req, res) => {
  const safeFileName = path.basename(req.params.fileName).replace(/\.json$/i, "");
  const historyDir = path.join(__dirname, "..", "history", safeFileName);
  if (!fs.existsSync(historyDir)) return res.json([]);
  const files = fs.readdirSync(historyDir)
    .filter(f => f.endsWith(".json"))
    .map(f => ({
      file: f,
      date: f.replace(".json", "").replace(/-/g, ":")
    }))
    .sort((a, b) => b.file.localeCompare(a.file));
  res.json(files);
});

app.delete("/api/history/:fileName/:historyFile", (req, res) => {
  const safeFileName = path.basename(req.params.fileName).replace(/\.json$/i, "");
  const safeHistoryFile = path.basename(req.params.historyFile);
  const historyPath = path.join(__dirname, "..", "history", safeFileName, safeHistoryFile);
  try {
    if (fs.existsSync(historyPath)) {
      fs.unlinkSync(historyPath);
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, error: "File not found" });
    }
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});


// ===============================

app.use("/history", express.static(path.join(__dirname, "..", "history")));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Serveur API démarré sur http://localhost:${PORT}`);
});