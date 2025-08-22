import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Pagination,
  Dialog
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import { jsPDF } from "jspdf";
import { useLocation, useNavigate } from "react-router-dom";
import ResultCard from "../components/ResultCard";
import ErrorListDialog from "../components/ErrorListDialog";
import { ValidationResult } from "../types/ValidationResult";
import EditJsonDialog from "../components/EditJsonDialog";
import { generateSuccessPdf, addFooter } from "../utils/pdfUtils";
import HistoryDialog from "../components/HistoryDialog";
import { useSnackbar } from "notistack";
import VisualizerDialog from "../components/VisualizerDialog";
import JsonLiveEditor from "../components/JsonLiveEditor";


const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [results, setResults] = useState<ValidationResult[]>(location.state?.results || []);
  const [openDialog, setOpenDialog] = useState<null | number>(null);
  const [page, setPage] = useState(0);

  // Historique
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [historyFileName, setHistoryFileName] = useState<string>("");

  // Visualizer
  const [visualizerOpen, setVisualizerOpen] = useState(false);
  const [visualizerContent, setVisualizerContent] = useState<string>("");

  // Edition/Suppression
  const [editDialogOpen, setEditDialogOpen] = useState<null | number>(null);
  const [keyword, setKeyword] = useState("");
  const [matches, setMatches] = useState<string[]>([]);
  const [selectedLines, setSelectedLines] = useState<number[]>([]);
  const [editValues, setEditValues] = useState<{ [line: number]: string }>({});
  const [editMode, setEditMode] = useState<{ [line: number]: boolean }>({});

  // Auto-fix (Live Editor)
  const [liveEditorOpen, setLiveEditorOpen] = useState(false);
  const [liveEditorJson, setLiveEditorJson] = useState<string>("");
  const [liveEditorIndex, setLiveEditorIndex] = useState<number | null>(null);

  // Fonction utilitaire pour revalider et mettre à jour le state
  const revalidateAndUpdate = async (index: number, newJson: string) => {
    try {
      const response = await fetch("http://localhost:3001/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: newJson,
      });
      const validation = await response.json();
      const newResults = [...results];
      newResults[index] = {
        ...newResults[index],
        fileContent: newJson,
        valid: validation.valid,
        errors: validation.errors,
      };
      setResults(newResults);
      if (validation.valid) {
        enqueueSnackbar("File is now valid!", { variant: "success" });
      } else {
        enqueueSnackbar("File is still invalid.", { variant: "warning" });
      }
    } catch {
      enqueueSnackbar("Failed to revalidate file.", { variant: "error" });
    }
  };

  // PDF invalidés 
  const handleDownloadPdf = (result: ValidationResult) => {
    const doc = new jsPDF();
    const now = new Date();
    const formattedDate = now.toLocaleString();

    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, 210, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("ClockTree Validation Report", 15, 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(`File: ${result.fileName}`, 15, 28);
    doc.text(`Generated: ${formattedDate}`, 15, 34);

    let y = 44;

    doc.setDrawColor(244, 67, 54);
    doc.setFillColor(255, 235, 238);
    doc.roundedRect(15, y, 60, 12, 3, 3, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(244, 67, 54);
    doc.text("INVALID FILE", 45, y + 9, { align: "center" });
    y += 22;

    doc.setTextColor(33, 33, 33);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Error list:", 15, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(244, 67, 54);

    result.errors.forEach((err: string, idx: number) => {
      const line = `${idx + 1}. ${err}`;
      const lines = doc.splitTextToSize(line, 180);
      for (let l of lines) {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(l, 20, y);
        y += 6;
      }
    });
    y += 4;

    addFooter(doc);

    doc.save(`${result.fileName.replace('.json', '')}_report.pdf`);
  };

  // Historique
  const handleShowHistory = (fileName: string) => {
    setHistoryFileName(fileName);
    setHistoryDialogOpen(true);
  };

  // Recherche des lignes contenant le mot-clé
  const handleSearchKeyword = () => {
    if (editDialogOpen === null || !keyword.trim()) {
      setMatches([]);
      setSelectedLines([]);
      setEditValues({});
      setEditMode({});
      return;
    }
    try {
      const json = JSON.parse(results[editDialogOpen].fileContent);
      const lines = JSON.stringify(json, null, 2).split("\n");
      const found: string[] = [];
      lines.forEach((line: string, idx: number) => {
        if (line.includes(keyword)) found.push(`${idx + 1}: ${line}`);
      });
      setMatches(found);
      setSelectedLines([]);
      setEditValues({});
      setEditMode({});
    } catch {
      setMatches([]);
      setSelectedLines([]);
      setEditValues({});
      setEditMode({});
    }
  };

  // Supprime toutes les occurrences du mot-clé dans le JSON (récursif)
  const handleDeleteKeyword = async () => {
    if (editDialogOpen === null || !keyword.trim()) return;
    try {
      let json = JSON.parse(results[editDialogOpen].fileContent);

      const removeKey = (obj: any, key: string) => {
        if (Array.isArray(obj)) {
          obj.forEach(item => removeKey(item, key));
        } else if (typeof obj === "object" && obj !== null) {
          Object.keys(obj).forEach(k => {
            if (k === key) {
              delete obj[k];
            } else {
              removeKey(obj[k], key);
            }
          });
        }
      };
      removeKey(json, keyword);

      const newJsonStr = JSON.stringify(json, null, 2);

      // Mise à jour côté backend
      await fetch("http://localhost:3001/api/update-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: results[editDialogOpen].fileName,
          newContent: newJsonStr,
        }),
      });

      // Mise à jour côté front + revalidation
      await revalidateAndUpdate(editDialogOpen, newJsonStr);

      setMatches([]);
      setKeyword("");
      setEditDialogOpen(null);

      enqueueSnackbar("All occurrences deleted successfully!", { variant: "success" });
    } catch {
      enqueueSnackbar("Error while deleting occurrences.", { variant: "error" });
    }
  };

 
  const handleDeleteSelectedLines = async () => {
    if (editDialogOpen === null || selectedLines.length === 0) return;
    try {
      const json = JSON.parse(results[editDialogOpen].fileContent);
      const lines = JSON.stringify(json, null, 2).split("\n");
      const newLines = lines.filter((_: string, idx: number) => !selectedLines.includes(idx + 1));
      const newJsonStr = newLines.join("\n");

      await fetch("http://localhost:3001/api/update-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: results[editDialogOpen].fileName,
          newContent: newJsonStr,
        }),
      });

      await revalidateAndUpdate(editDialogOpen, newJsonStr);

      setMatches([]);
      setKeyword("");
      setSelectedLines([]);
      setEditDialogOpen(null);

      enqueueSnackbar("Selected lines deleted (text only).", { variant: "warning" });
    } catch {
      enqueueSnackbar("Error while deleting lines.", { variant: "error" });
    }
  };

  const handleEditLine = (lineNumber: number) => {
    setEditMode((prev) => ({ ...prev, [lineNumber]: true }));
    setEditValues((prev) => ({
      ...prev,
      [lineNumber]: matches.find((line) => parseInt(line.split(":")[0], 10) === lineNumber)?.split(":").slice(1).join(":").trim() || "",
    }));
  };

  const handleSaveEditLine = async (lineNumber: number) => {
    if (editDialogOpen === null) return;
    try {
      const json = JSON.parse(results[editDialogOpen].fileContent);
      const lines = JSON.stringify(json, null, 2).split("\n");
      lines[lineNumber - 1] = editValues[lineNumber] || lines[lineNumber - 1];
      const newJsonStr = lines.join("\n");

      await fetch("http://localhost:3001/api/update-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: results[editDialogOpen].fileName,
          newContent: newJsonStr,
        }),
      });

      await revalidateAndUpdate(editDialogOpen, newJsonStr);

      setEditMode((prev) => ({ ...prev, [lineNumber]: false }));

      enqueueSnackbar("Line updated successfully!", { variant: "success" });
    } catch {
      enqueueSnackbar("Error while updating line.", { variant: "error" });
    }
  };

  // Auto-fix
  const handleSaveFixedJson = async (fixedJson: string) => {
    if (liveEditorIndex !== null) {
      const fileName = results[liveEditorIndex].fileName;

      // Mise à jour côté backend
      await fetch("http://localhost:3001/api/update-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName,
          newContent: fixedJson,
        }),
      });

      // Mise à jour côté front + revalidation
      await revalidateAndUpdate(liveEditorIndex, fixedJson);
    }
    setLiveEditorOpen(false);
    setLiveEditorIndex(null);
  };

  if (!results.length) {
    navigate("/");
    return null;
  }

  const result = results[page];

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom align="center">
        Result {page + 1} / {results.length}
      </Typography>
      <ResultCard
        result={result}
        onDownloadPdf={() =>
          result.valid
            ? generateSuccessPdf(result)
            : handleDownloadPdf(result)
        }
        onEdit={() => setEditDialogOpen(page)}
        onShowErrors={() => setOpenDialog(page)}
        onShowHistory={handleShowHistory}
        onVisualize={() => {
          setVisualizerContent(result.fileContent);
          setVisualizerOpen(true);
        }}
      />

      {/* Auto-fix button for invalid files */}
      {!result.valid && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              setLiveEditorJson(result.fileContent);
              setLiveEditorOpen(true);
              setLiveEditorIndex(page);
            }}
          >
            fix errors
          </Button>
        </Box>
      )}

      {/* Pagination */}
      <Box display="flex" justifyContent="center" alignItems="center" mt={3}>
        <Pagination
          count={results.length}
          page={page + 1}
          onChange={(_, value) => setPage(value - 1)}
          color="primary"
          size="small"
          shape="rounded"
          siblingCount={0}
          boundaryCount={1}
          sx={{
            "& .MuiPaginationItem-root": {
              fontWeight: 600,
              borderRadius: 2,
              minWidth: 32,
              height: 32,
            },
            "& .Mui-selected": {
              background: "#1976d2",
              color: "#fff",
              boxShadow: "0 2px 8px 0 #1976d233",
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<ReplayIcon />}
          onClick={() => navigate("/validator")}
          sx={{ ml: 3, height: 32, minWidth: 32, fontWeight: 600, borderRadius: 2 }}
        >
          Back
        </Button>
      </Box>

      {/* Dialog pour voir toutes les erreurs */}
      <ErrorListDialog
        open={openDialog !== null}
        errors={openDialog !== null ? results[openDialog].errors : []}
        onClose={() => setOpenDialog(null)}
      />

      {/* Dialog pour modifier/supprimer */}
      <EditJsonDialog
        open={editDialogOpen !== null}
        keyword={keyword}
        matches={matches}
        selectedLines={selectedLines}
        editValues={editValues}
        editMode={editMode}
        onClose={() => setEditDialogOpen(null)}
        onKeywordChange={setKeyword}
        onSearch={handleSearchKeyword}
        onSelectLine={(lineNumber) =>
          setSelectedLines((prev) =>
            prev.includes(lineNumber)
              ? prev.filter((n) => n !== lineNumber)
              : [...prev, lineNumber]
          )
        }
        onEditLine={handleEditLine}
        onEditValueChange={(lineNumber, value) =>
          setEditValues((prev) => ({
            ...prev,
            [lineNumber]: value,
          }))
        }
        onSaveEditLine={handleSaveEditLine}
        onDeleteSelectedLines={handleDeleteSelectedLines}
        onDeleteKeyword={handleDeleteKeyword}
      />

      {/* Dialog pour l'historique */}
      <HistoryDialog
        open={historyDialogOpen}
        fileName={historyFileName}
        currentContent={
          results.find(r => r.fileName === historyFileName)?.fileContent || ""
        }
        onClose={() => setHistoryDialogOpen(false)}
      />

      {/* Dialog pour la visualisation */}
      <VisualizerDialog
        open={visualizerOpen}
        onClose={() => setVisualizerOpen(false)}
        jsonContent={visualizerContent}
      />

      {/* Dialog pour l'auto-fix (Live Editor) */}
      <Dialog open={liveEditorOpen} onClose={() => setLiveEditorOpen(false)} maxWidth="md" fullWidth>
        <Box sx={{ p: 2 }}>
         <JsonLiveEditor
            initialJson={liveEditorJson}
            fileName={liveEditorIndex !== null ? results[liveEditorIndex].fileName : undefined}
            onSave={handleSaveFixedJson}
          />
        </Box>
      </Dialog>
    </Container>
  );
};

export default ResultsPage;