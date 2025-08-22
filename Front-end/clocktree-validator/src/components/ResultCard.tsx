import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
  Fade,
  Zoom,
  Grow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloseIcon from "@mui/icons-material/Close";
import CelebrationIcon from "@mui/icons-material/Celebration";
import { ValidationResult } from "../types/ValidationResult";
import { TransitionProps } from "@mui/material/transitions";

type Props = {
  result: ValidationResult;
  onDownloadPdf: () => void;
  onEdit: () => void;
  onShowErrors: () => void;
  onShowHistory: (fileName: string) => void;
  onVisualize?: () => void;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ResultCard: React.FC<Props> = ({
  result,
  onDownloadPdf,
  onEdit,
  onShowErrors,
  onShowHistory,
  onVisualize,
}) => {
  const [showAllErrors, setShowAllErrors] = useState(false);

  // Helper pour calculer la taille du fichier
  const getFileSize = (content: string) =>
    content ? `${(new Blob([content]).size / 1024).toFixed(1)} KB` : "N/A";

  return (
    <Grow in timeout={500}>
      <Card
        elevation={10}
        sx={{
          maxWidth: 650,
          minHeight: 620,
          mx: "auto",
          borderRadius: 4,
          boxShadow: "0 8px 32px 0 rgba(25,118,210,0.13)",
          p: 0,
          overflow: "visible",
          background: "linear-gradient(135deg, #fff 80%, #f5fafd 100%)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: 4,
            pt: 3,
            pb: 1.5,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            background: "transparent",
          }}
        >
          <Zoom in>
            <Box mr={2} display="flex" alignItems="center">
              {result.valid ? (
                <CheckCircleIcon color="success" fontSize="large" sx={{ animation: "pop 0.5s" }} />
              ) : (
                <ReportProblemIcon sx={{ color: "#f44336", fontSize: 36, animation: "shake 0.5s" }} />
              )}
            </Box>
          </Zoom>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              flexGrow: 1,
              letterSpacing: 0.5,
              fontSize: { xs: 18, md: 22 },
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {result.fileName}
          </Typography>
          <Fade in>
            <Chip
              label={result.valid ? "Valid" : "Invalid"}
              color={result.valid ? "success" : "error"}
              icon={result.valid ? <CheckCircleIcon /> : <ErrorIcon />}
              sx={{
                fontWeight: "bold",
                fontSize: 15,
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                ml: 2,
                boxShadow: result.valid
                  ? "0 0 8px 0 #43a04733"
                  : "0 0 8px 0 #f4433633",
                animation: result.valid
                  ? "badgePop 0.7s"
                  : "badgeShake 0.7s",
              }}
            />
          </Fade>
        </Box>

        <Divider />

        {/* Content */}
        <CardContent sx={{ flexGrow: 1, px: 4, py: 2 }}>
          {result.valid ? (
            <Fade in timeout={600}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100%"
                sx={{
                  minHeight: 320,
                  color: "success.main",
                }}
              >
                <CelebrationIcon sx={{ fontSize: 54, mb: 1, color: "#43a047" }} />
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color="success.main"
                  sx={{ mb: 1 }}
                >
                  Congratulations!
                </Typography>
                <Typography color="success.main" fontWeight={500} fontSize={16} sx={{ mb: 2 }}>
                  Your file is valid. No errors detected.
                </Typography>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  sx={{
                    background: "#e8f5e9",
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    mb: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    <b>File name:</b> {result.fileName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <b>Size:</b> {getFileSize(result.fileContent)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    background: "#f5fafd",
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    color: "#1976d2",
                    fontWeight: 500,
                    fontSize: 15,
                    textAlign: "center",
                    border: "1px solid #e3f2fd",
                    maxWidth: 420,
                  }}
                >
                  <InfoOutlinedIcon color="primary" sx={{ verticalAlign: "middle", mr: 1 }} />
                  You can now download the PDF report, edit, or visualize your file.
                </Box>
              </Box>
            </Fade>
          ) : (
            <List dense sx={{ pl: 1 }}>
              {result.errors.slice(0, 7).map((err: string, i: number) => (
                <Grow in timeout={400 + i * 100} key={i}>
                  <ListItem disableGutters sx={{ alignItems: "flex-start", mb: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                      <ErrorIcon color="error" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" color="error.main" fontSize={15}>
                          <b>{i + 1}.</b> {err}
                        </Typography>
                      }
                    />
                  </ListItem>
                </Grow>
              ))}
              {result.errors.length > 7 && (
                <Tooltip title="Show all errors for this file">
                  <Button
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => setShowAllErrors(true)}
                    sx={{
                      ml: 1,
                      mt: 1,
                      fontWeight: 600,
                      color: "#1976d2",
                      textTransform: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Show more
                  </Button>
                </Tooltip>
              )}
            </List>
          )}
        </CardContent>

        {/* Actions */}
        <Divider />
        <CardActions
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            gap: 1.5,
            px: 3,
            py: 2,
            background: "#f8fafd",
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
          }}
        >
          <Tooltip title="Download the validation report as PDF">
            <Button
              startIcon={<DownloadIcon />}
              onClick={onDownloadPdf}
              sx={{
                fontWeight: 600,
                color: "#1976d2",
                textTransform: "none",
                "&:hover": { background: "#e3f2fd" },
              }}
            >
              Download PDF
            </Button>
          </Tooltip>
          <Tooltip title="Edit or delete lines in this file">
            <Button
              startIcon={<EditIcon />}
              sx={{
                backgroundColor: "#1976d2",
                color: "#fff",
                fontWeight: 700,
                borderRadius: 2,
                px: 2,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#1251a3",
                },
              }}
              onClick={onEdit}
            >
              Edit/Delete
            </Button>
          </Tooltip>
          <Tooltip title="Show file version history">
            <Button
              variant="outlined"
              startIcon={<HistoryIcon />}
              sx={{
                fontWeight: 700,
                borderRadius: 2,
                textTransform: "none",
                color: "#1976d2",
                borderColor: "#1976d2",
                "&:hover": {
                  background: "#e3f2fd",
                  borderColor: "#1976d2",
                },
              }}
              onClick={() => onShowHistory(result.fileName)}
            >
              History
            </Button>
          </Tooltip>
          {onVisualize && result.valid && (
            <Tooltip title="Visualize this file as a graph">
              <Button
                variant="contained"
                color="secondary"
                startIcon={<VisibilityIcon />}
                sx={{
                  fontWeight: 700,
                  borderRadius: 2,
                  backgroundColor: "#8e24aa",
                  color: "#fff",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#6d1b7b",
                  },
                }}
                onClick={onVisualize}
              >
                Visualiser
              </Button>
            </Tooltip>
          )}
        </CardActions>

        {/* Animations CSS */}
        <style>
          {`
            @keyframes pop {
              0% { transform: scale(0.7); opacity: 0.5; }
              80% { transform: scale(1.15); opacity: 1; }
              100% { transform: scale(1); }
            }
            @keyframes shake {
              0% { transform: rotate(-8deg); }
              20% { transform: rotate(8deg); }
              40% { transform: rotate(-6deg); }
              60% { transform: rotate(6deg); }
              80% { transform: rotate(-2deg); }
              100% { transform: rotate(0deg); }
            }
            @keyframes badgePop {
              0% { transform: scale(0.7); opacity: 0.5; }
              80% { transform: scale(1.1); opacity: 1; }
              100% { transform: scale(1); }
            }
            @keyframes badgeShake {
              0% { transform: rotate(-6deg); }
              20% { transform: rotate(6deg); }
              40% { transform: rotate(-4deg); }
              60% { transform: rotate(4deg); }
              80% { transform: rotate(-2deg); }
              100% { transform: rotate(0deg); }
            }
          `}
        </style>

        {/* Popup animée pour toutes les erreurs */}
        <Dialog
          open={showAllErrors}
          onClose={() => setShowAllErrors(false)}
          TransitionComponent={Transition}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              boxShadow: "0 8px 32px 0 rgba(244,67,54,0.18)",
              background: "linear-gradient(135deg, #fff 80%, #fff5f5 100%)",
            },
          }}
        >
          
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={1}>
              <ErrorOutlineIcon color="error" sx={{ fontSize: 32, animation: "shake 0.5s" }} />
              <Typography fontWeight={700} fontSize={20}>
                All Errors for {result.fileName}
              </Typography>
              <Box flexGrow={1} />
              <IconButton onClick={() => setShowAllErrors(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <List dense>
              {result.errors.map((err, i) => (
                <ListItem key={i} disableGutters>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <ErrorIcon color="error" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" color="error.main" fontSize={15}>
                        <b>{i + 1}.</b> {err}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowAllErrors(false)}
              variant="contained"
              color="error"
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                px: 3,
                boxShadow: "0 2px 8px 0 #f4433633",
                background: "#f44336",
                "&:hover": { background: "#c62828" },
              }}
              startIcon={<CloseIcon />}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Grow>
  );
};

export default ResultCard;