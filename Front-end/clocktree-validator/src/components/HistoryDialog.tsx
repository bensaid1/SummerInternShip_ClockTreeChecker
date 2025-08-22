import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  CircularProgress,
  Box,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import ReactDiffViewer from "react-diff-viewer";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useSnackbar } from "notistack";

type HistoryFile = {
  file: string;
  date: string;
  archived?: boolean;
};

type Props = {
  open: boolean;
  fileName: string;
  onClose: () => void;
  currentContent?: string;
};

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

const HistoryDialog: React.FC<Props> = ({ open, fileName, onClose, currentContent }) => {
  const [history, setHistory] = useState<HistoryFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [viewing, setViewing] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; file: string | null }>({ open: false, file: null });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (open && fileName) {
      setLoading(true);
      fetch(`/api/history/${fileName}`)
        .then(res => res.json())
        .then(data => {
          setHistory(data);
        })
        .finally(() => setLoading(false));
    }
  }, [open, fileName]);

  // Voir le contenu d'une version
  const handleView = async (historyFile: string) => {
    setViewing(historyFile);
    setSelectedContent(null);
    const safeFileName = fileName.replace(/\.json$/i, "");
    const res = await fetch(`/history/${safeFileName}/${historyFile}`);
    const text = await res.text();
    setSelectedContent(text);
  };

  // Supprimer une version historique
  const handleDelete = async (historyFile: string) => {
    const safeFileName = fileName.replace(/\.json$/i, "");
    const res = await fetch(`/api/history/${safeFileName}/${historyFile}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setHistory(h => h.filter(f => f.file !== historyFile));
      enqueueSnackbar("History version deleted.", { variant: "success" });
      if (viewing === historyFile) setSelectedContent(null);
    } else {
      enqueueSnackbar("Failed to delete history version.", { variant: "error" });
    }
  };

  // Archiver
  const handleArchive = async (historyFile: string) => {
    const safeFileName = fileName.replace(/\.json$/i, "");
    await fetch(`/api/history/${safeFileName}/${historyFile}/archive`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: true }),
    });
    setHistory(h =>
      h.map(f => f.file === historyFile ? { ...f, archived: true } : f)
    );
    enqueueSnackbar("Version archivée.", { variant: "info" });
  };

  // Désarchiver
  const handleUnarchive = async (historyFile: string) => {
    const safeFileName = fileName.replace(/\.json$/i, "");
    await fetch(`/api/history/${safeFileName}/${historyFile}/archive`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: false }),
    });
    setHistory(h =>
      h.map(f => f.file === historyFile ? { ...f, archived: false } : f)
    );
    enqueueSnackbar("Version désarchivée.", { variant: "success" });
  };

  return (
    <>
      {/* Dialog principal */}
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          History for {fileName}
          <Button
            variant="outlined"
            color="success"
            sx={{ ml: 2, fontWeight: 600, borderRadius: 2 }}
            onClick={() => setShowArchived(true)}
          >
            Voir les archivés
          </Button>
        </DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <Box textAlign="center" py={4}>
              <CircularProgress />
            </Box>
          ) : history.filter(h => !h.archived).length === 0 ? (
            <Typography color="text.secondary">No history found for this file.</Typography>
          ) : (
            <List>
              {history.filter(h => !h.archived).map((h, i) => (
                <ListItem
                  key={i}
                  divider
                  sx={{
                    borderRadius: 2,
                    transition: "background 0.2s",
                    "&:hover": { background: "#f5fafd" },
                    alignItems: "center",
                    py: 1.5,
                  }}
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View this version">
                        <IconButton
                          color="primary"
                          sx={{
                            borderRadius: 2,
                            background: "#e3f2fd",
                            "&:hover": { background: "#bbdefb" },
                          }}
                          onClick={() => handleView(h.file)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Archiver">
                        <IconButton
                          color="success"
                          sx={{
                            borderRadius: 2,
                            background: "#e8f5e9",
                            "&:hover": { background: "#c8e6c9" },
                          }}
                          onClick={() => handleArchive(h.file)}
                        >
                          <ArchiveIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete this version">
                        <IconButton
                          color="error"
                          sx={{
                            borderRadius: 2,
                            background: "#ffebee",
                            "&:hover": { background: "#ffcdd2" },
                          }}
                          onClick={() => setConfirmDelete({ open: true, file: h.file })}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography fontWeight={600} fontSize={16}>
                        {formatDate(h.date)}
                      </Typography>
                    }
                    secondary={
                      <Typography fontSize={13} color="text.secondary">
                        {h.file}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
          {/* Dialog pour afficher le diff d'une version */}
          <Dialog open={!!selectedContent} onClose={() => setSelectedContent(null)} maxWidth="md" fullWidth>
            <DialogTitle>Diff with current version: {viewing}</DialogTitle>
            <DialogContent dividers>
              {selectedContent && currentContent ? (
                <ReactDiffViewer
                  oldValue={selectedContent}
                  newValue={currentContent}
                  splitView={true}
                  showDiffOnly={false}
                  leftTitle="This version"
                  rightTitle="Current"
                  styles={{
                    variables: {
                      light: {
                        diffViewerBackground: "#faf7fcff",
                        addedBackground: "#b4d1fdff",
                        removedBackground: "#f2e6f8ff",
                        wordAddedBackground: "#3549faff",
                        wordRemovedBackground: "#ed9bfdff",
                        addedGutterBackground: "#8caafcff",
                        removedGutterBackground: "#e3b2ffff",
                      }
                    }
                  }}
                />
              ) : (
                <pre style={{ fontSize: 13, background: "#f5f5f5", padding: 12, borderRadius: 6, overflowX: "auto" }}>
                  {selectedContent}
                </pre>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedContent(null)}>Close</Button>
            </DialogActions>
          </Dialog>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog pour les archivés */}
      <Dialog
        open={showArchived}
        onClose={() => setShowArchived(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Fichiers archivés</DialogTitle>
        <DialogContent dividers>
          {history.filter(h => h.archived).length === 0 ? (
            <Typography color="text.secondary">Aucun fichier archivé.</Typography>
          ) : (
            <List>
              {history.filter(h => h.archived).map((h, i) => (
                <ListItem key={i} divider>
                  <ListItemText
                    primary={
                      <Typography fontWeight={600} fontSize={16}>
                        {formatDate(h.date)}
                      </Typography>
                    }
                    secondary={
                      <Typography fontSize={13} color="text.secondary">
                        {h.file}
                      </Typography>
                    }
                  />
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="View this version">
                      <IconButton
                        color="primary"
                        sx={{
                          borderRadius: 2,
                          background: "#e3f2fd",
                          "&:hover": { background: "#bbdefb" },
                        }}
                        onClick={() => handleView(h.file)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Désarchiver">
                      <IconButton
                        color="success"
                        sx={{
                          borderRadius: 2,
                          background: "#e8f5e9",
                          "&:hover": { background: "#c8e6c9" },
                        }}
                        onClick={() => handleUnarchive(h.file)}
                      >
                        <UnarchiveIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete this version">
                      <IconButton
                        color="error"
                        sx={{
                          borderRadius: 2,
                          background: "#ffebee",
                          "&:hover": { background: "#ffcdd2" },
                        }}
                        onClick={() => setConfirmDelete({ open: true, file: h.file })}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowArchived(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Popup de confirmation de suppression */}
      <Dialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, file: null })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <WarningAmberRoundedIcon color="warning" />
            Confirm Deletion
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Typography>
            Are you sure you want to <b>permanently delete</b> this version&nbsp;?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {confirmDelete.file}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDelete({ open: false, file: null })}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (confirmDelete.file) {
                await handleDelete(confirmDelete.file);
              }
              setConfirmDelete({ open: false, file: null });
            }}
            color="error"
            variant="contained"
          >
             Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HistoryDialog;