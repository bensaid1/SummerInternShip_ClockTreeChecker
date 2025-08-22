import React, { useState } from "react";
import { Box, Button, Typography, Paper, Stack, CircularProgress } from "@mui/material";
import ValidationStats from "../components/ValidationStats";

type ValidationResult = {
  fileName: string;
  valid: boolean;
  errors: string[];
  fileContent: string;
};

const BatchValidator: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Sélection de plusieurs fichiers (dossier)
  const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  // Validation batch
  const handleBatchValidate = async () => {
    setLoading(true);
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
    setResults(allResults);
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #e3f2fd 0%, #f5fafd 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 5,
          maxWidth: 850,
          width: "100%",
          mx: "auto",
          background: "linear-gradient(135deg, #fff 80%, #e3f2fd 100%)",
          boxShadow: "0 8px 32px 0 rgba(25,118,210,0.13)",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={800}
          mb={2}
          color="primary"
          textAlign="center"
          letterSpacing={1}
        >
          Batch Validation Statistics
        </Typography>
        <Stack direction="row" spacing={2} mb={2} justifyContent="center">
          <Button
            variant="contained"
            component="label"
            sx={{
              fontWeight: 700,
              borderRadius: 3,
              background: "linear-gradient(90deg, #1976d2 60%, #80bcf5ff 100%)",
              color: "#fff",
              px: 3,
              py: 1.2,
              fontSize: "1.1rem",
              boxShadow: "0 2px 8px rgba(41,128,185,0.10)",
              "&:hover": {
                background: "linear-gradient(90deg, #1251a3 60%, #78b4f8ff 100%)",
              },
            }}
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
          <Button
            variant="contained"
            color="success"
            onClick={handleBatchValidate}
            disabled={files.length === 0 || loading}
            sx={{
              fontWeight: 700,
              borderRadius: 3,
              px: 3,
              py: 1.2,
              fontSize: "1.1rem",
              background: "linear-gradient(90deg, #93c0faff 60%, #1976d2 100%)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(90deg, #66c5fcff 60%, #1251a3 100%)",
              },
            }}
          >
            Validate All
          </Button>
        </Stack>
        <Typography variant="body2" color="text.secondary" mb={2} textAlign="center">
          {files.length === 0
            ? "No files selected"
            : `${files.length} files selected`}
        </Typography>
        {loading && (
          <Box textAlign="center" my={3}>
            <CircularProgress color="primary" />
            <Typography mt={1}>Validating files...</Typography>
          </Box>
        )}
        {results.length > 0 && <ValidationStats results={results} />}
      </Paper>
    </Box>
  );
};

export default BatchValidator;