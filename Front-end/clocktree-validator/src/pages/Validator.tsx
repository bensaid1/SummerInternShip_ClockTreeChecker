import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  Stack,
  useTheme,
} from "@mui/material";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";


// Icône cloud upload personnalisée (SVG)
const CloudUploadSVG = ({ animated = false }: { animated?: boolean }) => {
  const float = keyframes`
    0% { transform: translateY(0);}
    50% { transform: translateY(-10px);}
    100% { transform: translateY(0);}
  `;
  return (
    <Box
      sx={{
        width: 64,
        height: 64,
        mx: "auto",
        mb: 1,
        animation: animated ? `${float} 2.5s ease-in-out infinite` : undefined,
      }}
    >
      <svg viewBox="0 0 64 64" width="64" height="64" fill="none">
        <ellipse cx="32" cy="44" rx="20" ry="10" fill="#e3f2fd" />
        <ellipse cx="44" cy="40" rx="12" ry="7" fill="#bbdefb" />
        <ellipse cx="24" cy="42" rx="10" ry="6" fill="#90caf9" />
        <path
          d="M32 18v18"
          stroke="#1976d2"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M26 28l6-6 6 6"
          stroke="#1976d2"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <ellipse cx="32" cy="44" rx="20" ry="10" fill="#1976d2" fillOpacity="0.08" />
      </svg>
    </Box>
  );
};

// Icône dossier personnalisée (SVG)
const FolderSVG = () => (
  <Box sx={{ width: 28, height: 28, display: "flex", alignItems: "center" }}>
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="2" y="8" width="24" height="14" rx="3" fill="#90caf9" />
      <rect x="6" y="12" width="16" height="6" rx="2" fill="#1976d2" />
      <rect x="10" y="16" width="8" height="2" rx="1" fill="#fff" />
      <rect x="2" y="8" width="24" height="14" rx="3" stroke="#1976d2" strokeWidth="1.5" />
    </svg>
  </Box>
);

// Tick animé pour la validation
const AnimatedTick = () => {
  const tickDraw = keyframes`
    0% { stroke-dashoffset: 40; }
    100% { stroke-dashoffset: 0; }
  `;
  return (
    <Box sx={{ width: 60, height: 60, mx: "auto", mb: 1 }}>
      <svg width="60" height="60" viewBox="0 0 60 60">
        <circle
          cx="30"
          cy="30"
          r="28"
          fill="#e8f5e9"
          stroke="#43a047"
          strokeWidth="4"
          style={{
            filter: "drop-shadow(0 2px 8px rgba(67,160,71,0.15))",
          } as React.CSSProperties}
        />
        <path
          d="M18 32L27 41L43 21"
          stroke="#43a047"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 40,
            strokeDashoffset: 40,
            animation: `${tickDraw} 0.7s 0.2s ease-out forwards`,
          } as React.CSSProperties}
        />
      </svg>
    </Box>
  );
};

type ValidationResult = {
  fileName: string;
  valid: boolean;
  errors: string[];
  fileContent: string;
};

const Validator: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTick, setShowTick] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const theme = useTheme();

  // Sélection d'un seul fichier
  const handleSingleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles([e.target.files[0]]);
      setError(null);
    }
  };

  // Sélection de plusieurs fichiers (dossier)
  const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
      setError(null);
    }
  };

  const handleValidate = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setShowTick(false);
    setError(null);

    try {
      const allResults: ValidationResult[] = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("http://localhost:3001/api/validate", {
          method: "POST",
          body: formData,
        });

        let data = { valid: false, errors: [] as string[] };
        if (response.ok) {
          data = await response.json();
        }

        const fileContent = await file.text();

        allResults.push({
          fileName: file.name,
          valid: data.valid,
          errors: data.errors,
          fileContent,
        });
      }

      // Petite pause pour montrer l'animation du tick
      setTimeout(() => {
        setShowTick(true);
        setTimeout(() => {
          navigate("/results", { state: { results: allResults } });
        }, 1000);
      }, 600);
    } catch (err: any) {
      setError(err.message || "Unknown error.");
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, #f5fafd 0%, ${theme.palette.primary.light} 100%)`,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 5,
            boxShadow: "0 8px 32px rgba(41,128,185,0.10)",
            background: "rgba(255,255,255,0.98)",
            minWidth: 340,
            mt: 6,
          }}
        >
          <Stack spacing={3}>
            <Box textAlign="center">
              <CloudUploadSVG animated />
              <Typography
                variant="h4"
                fontWeight={800}
                gutterBottom
                color="primary"
                sx={{ letterSpacing: 1 }}
              >
                JSON File Validation
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: "1.1rem" }}>
                Import one or more JSON files to validate them against the ClockTree schema.
              </Typography>
            </Box>
            <Divider />
            <Box textAlign="center" display="flex" flexDirection="column" gap={2}>
              <Button
                variant="contained"
                component="label"
                sx={{
                  mb: 1,
                  fontWeight: 700,
                  px: 3,
                  py: 1.2,
                  fontSize: "1.1rem",
                  borderRadius: 3,
                  background: theme.palette.primary.main,
                  boxShadow: "0 2px 8px rgba(41,128,185,0.10)",
                  transition: "transform 0.2s, background 0.2s",
                  "&:hover": {
                    transform: "scale(1.04)",
                    background: theme.palette.primary.dark,
                  },
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
                startIcon={<CloudUploadSVG />}
              >
                Select a file
                <input
                  type="file"
                  accept=".json,application/json"
                  hidden
                  onChange={handleSingleFileChange}
                />
              </Button>
              <Button
                variant="outlined"
                component="label"
                sx={{
                  fontWeight: 700,
                  px: 3,
                  py: 1.2,
                  fontSize: "1.1rem",
                  borderRadius: 3,
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  transition: "transform 0.2s, border 0.2s, color 0.2s",
                  "&:hover": {
                    transform: "scale(1.04)",
                    borderColor: theme.palette.primary.dark,
                    color: theme.palette.primary.dark,
                  },
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
                startIcon={<FolderSVG />}
              >
                Select a folder
                <input
                  type="file"
                  accept=".json,application/json"
                  hidden
                  multiple
                  // @ts-ignore
                  webkitdirectory="true"
                  directory="true"
                  onChange={handleMultipleFilesChange}
                />
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                <b>Note:</b> Your browser may ask for confirmation before uploading all files in a folder.<br />
                This is a security feature and cannot be customized.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {files.length === 0
                  ? "No file selected"
                  : files.length === 1
                  ? `Selected file: ${files[0].name}`
                  : `${files.length} files selected`}
              </Typography>
            </Box>
            <Box textAlign="center">
              <Button
                variant="contained"
                color="success"
                onClick={handleValidate}
                disabled={files.length === 0 || loading || showTick}
                size="large"
                sx={{
                  minWidth: 180,
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  borderRadius: 3,
                  background: theme.palette.success.main,
                  boxShadow: "0 2px 8px rgba(67,160,71,0.10)",
                  transition: "transform 0.2s, background 0.2s",
                  "&:hover": {
                    transform: "scale(1.04)",
                    background: theme.palette.success.dark,
                  },
                }}
              >
                Validate
              </Button>
            </Box>
            {/* Animation de chargement ou tick */}
            {loading && !showTick && (
              <Box textAlign="center" sx={{ mt: 2 }}>
                <CircularProgress color="primary" size={48} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Validating files...
                </Typography>
              </Box>
            )}
            {showTick && (
              <Box textAlign="center" sx={{ mt: 2 }}>
                <AnimatedTick />
                <Typography variant="body2" color="success.main" sx={{ mt: 1, fontWeight: 700 }}>
                  Validation successful!
                </Typography>
              </Box>
            )}
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default Validator;