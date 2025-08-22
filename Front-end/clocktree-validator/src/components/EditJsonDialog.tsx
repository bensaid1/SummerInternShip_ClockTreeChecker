import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Typography,
  Slide,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { TransitionProps } from "@mui/material/transitions";

type Props = {
  open: boolean;
  keyword: string;
  matches: string[];
  selectedLines: number[];
  editValues: { [line: number]: string };
  editMode: { [line: number]: boolean };
  onClose: () => void;
  onKeywordChange: (v: string) => void;
  onSearch: () => void;
  onSelectLine: (lineNumber: number) => void;
  onEditLine: (lineNumber: number) => void;
  onEditValueChange: (lineNumber: number, value: string) => void;
  onSaveEditLine: (lineNumber: number) => void;
  onDeleteSelectedLines: () => void;
  onDeleteKeyword: () => void;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditJsonDialog: React.FC<Props> = ({
  open,
  keyword,
  matches,
  selectedLines,
  editValues,
  editMode,
  onClose,
  onKeywordChange,
  onSearch,
  onSelectLine,
  onEditLine,
  onEditValueChange,
  onSaveEditLine,
  onDeleteSelectedLines,
  onDeleteKeyword,
}) => {
  // Popup de confirmation
  const [confirm, setConfirm] = useState<{
    open: boolean;
    type: "selection" | "keyword" | null;
  }>({ open: false, type: null });

  // Handler pour confirmer la suppression
  const handleConfirmDelete = () => {
    if (confirm.type === "selection") {
      onDeleteSelectedLines();
    } else if (confirm.type === "keyword") {
      onDeleteKeyword();
    }
    setConfirm({ open: false, type: null });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit/Delete in JSON</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" gap={2} alignItems="center" mb={2}>
            <TextField
              label="Keyword (e.g. name)"
              value={keyword}
              onChange={e => onKeywordChange(e.target.value)}
              size="small"
              fullWidth
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#4586e0ff",
                color: "#fff",
                fontWeight: 700,
                borderRadius: 2,
                px: 3,
                boxShadow: "0 2px 8px rgba(41,82,204,0.10)",
                "&:hover": {
                  backgroundColor: "#1272f8ff",
                },
              }}
              onClick={onSearch}
            >
              Search
            </Button>
          </Box>
          {matches.length > 0 && (
            <List dense>
              {matches.map((line, idx) => {
                const lineNumber = parseInt(line.split(":")[0], 10);
                return (
                  <ListItem key={idx} dense>
                    <Checkbox
                      checked={selectedLines.includes(lineNumber)}
                      onChange={() => onSelectLine(lineNumber)}
                    />
                    {editMode[lineNumber] ? (
                      <>
                        <TextField
                          value={editValues[lineNumber] || ""}
                          onChange={e => onEditValueChange(lineNumber, e.target.value)}
                          size="small"
                          fullWidth
                        />
                        <IconButton
                          sx={{
                            color: "#03a546ff",
                            backgroundColor: "#e3eaff",
                            borderRadius: 2,
                            ml: 1,
                            "&:hover": {
                              backgroundColor: "#c7d7ff",
                            },
                          }}
                          onClick={() => onSaveEditLine(lineNumber)}
                        >
                          <SaveIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <ListItemText primary={line} />
                        <IconButton
                          sx={{
                            color: "#060af7ff",
                            backgroundColor: "#e3eaff",
                            borderRadius: 2,
                            ml: 1,
                            "&:hover": {
                              backgroundColor: "#c7d7ff",
                            },
                          }}
                          onClick={() => onEditLine(lineNumber)}
                        >
                          <EditIcon />
                        </IconButton>
                      </>
                    )}
                  </ListItem>
                );
              })}
            </List>
          )}
          {matches.length === 0 && keyword && (
            <Typography color="text.secondary"></Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, pt: 2 }}>
          <Button
            onClick={onClose}
            sx={{
              color: "#6B7280",
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              backgroundColor: "#f3f4f6",
              "&:hover": {
                backgroundColor: "#e5e7eb",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#0c08fdff",
              color: "#fff",
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              boxShadow: "0 2px 8px rgba(41,82,204,0.10)",
              "&:hover": {
                backgroundColor: "#5f54faff",
              },
            }}
            onClick={() => setConfirm({ open: true, type: "selection" })}
            disabled={selectedLines.length === 0}
            startIcon={<DeleteIcon />}
          >
            Delete selection
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#c23effff",
              color: "#22223B",
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              boxShadow: "0 2px 8px rgba(255,193,7,0.10)",
              "&:hover": {
                backgroundColor: "#540099ff",
              },
            }}
            onClick={() => setConfirm({ open: true, type: "keyword" })}
            disabled={!keyword}
            startIcon={<DeleteIcon />}
          >
            Delete all occurrences
          </Button>
        </DialogActions>
      </Dialog>

      {/* Popup de confirmation animée */}
      <Dialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, type: null })}
        TransitionComponent={Transition}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 8px 32px 0 rgba(255, 193, 7, 0.18)",
            background: "linear-gradient(135deg, #fffbe7 80%, #fffde7 100%)",
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <span className="shake-icon">
              <WarningAmberRoundedIcon color="warning" sx={{ fontSize: 32 }} />
            </span>
            <Typography fontWeight={700} fontSize={20}>
              Confirm Deletion
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Typography fontSize={17} sx={{ mb: 1 }}>
            {confirm.type === "selection"
              ? "Are you sure you want to permanently delete the selected lines?"
              : "Are you sure you want to permanently delete all occurrences of this keyword?"}
          </Typography>
          {confirm.type === "keyword" && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Keyword: <b>{keyword}</b>
            </Typography>
          )}
          {confirm.type === "selection" && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {selectedLines.length} line(s) will be deleted.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirm({ open: false, type: null })}
            variant="outlined"
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              px: 3,
              color: "#1976d2",
              borderColor: "#1976d2",
              "&:hover": { background: "#e3f2fd", borderColor: "#1976d2" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              px: 3,
              boxShadow: "0 2px 8px 0 #f4433633",
              background: "#f44336",
              "&:hover": { background: "#c62828" },
            }}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
        {/* Animation CSS */}
        <style>
          {`
            .shake-icon {
              display: inline-block;
              animation: shake 0.5s;
            }
            @keyframes shake {
              0% { transform: rotate(-8deg); }
              20% { transform: rotate(8deg); }
              40% { transform: rotate(-6deg); }
              60% { transform: rotate(6deg); }
              80% { transform: rotate(-2deg); }
              100% { transform: rotate(0deg); }
            }
          `}
        </style>
      </Dialog>
    </>
  );
};

export default EditJsonDialog;