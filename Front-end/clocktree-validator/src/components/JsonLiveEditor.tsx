import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Box, Button, Typography, Stack, Tooltip, IconButton } from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import SaveIcon from "@mui/icons-material/Save";
import { validateJsonFile } from "../utils/validator";

type JsonLiveEditorProps = {
  initialJson?: string;
  fileName?: string;
  onSave?: (fixedJson: string) => void;
};

const defaultJson = `{
  "tree": {
    "id": "clock1",
    "schema_version": "1.0.0",
    "elements": [],
    "transitions": []
  }
}`;

const JsonLiveEditor: React.FC<JsonLiveEditorProps> = ({ initialJson, fileName, onSave }) => {
  const [json, setJson] = useState(initialJson || defaultJson);
  const [canAutoFix, setCanAutoFix] = useState(false);
  const [saving, setSaving] = useState(false);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (initialJson) setJson(initialJson);
  }, [initialJson]);

  // On ne valide plus en live, mais on détecte si auto-fix est possible
  const handleChange = (value: string | undefined) => {
    setJson(value || "");
    try {
      const parsed = JSON.parse(value || "");
      const result = validateJsonFile(parsed);
      setCanAutoFix(
        result.errors?.some(
          e =>
            /propriété obligatoire|manquante|missing|absente|doit être un tableau|structure invalide/i.test(e)
        )
      );
    } catch {
      setCanAutoFix(false);
    }
  };

  const handleAutoFix = () => {
    try {
      let parsed = JSON.parse(json);
      if (!parsed.tree) parsed.tree = {};
      if (!parsed.tree.id) parsed.tree.id = "default_id";
      if (!parsed.tree.schema_version) parsed.tree.schema_version = "1.0.0";
      if (!Array.isArray(parsed.tree.elements)) parsed.tree.elements = [];
      if (!("transitions" in parsed.tree) || !Array.isArray(parsed.tree.transitions)) parsed.tree.transitions = [];
      if (Array.isArray(parsed.tree.elements)) {
        parsed.tree.elements = parsed.tree.elements.map((el: any) => ({
          ...el,
          id: el.id || "element_id",
          name: el.name || "element_name",
          position: el.position || { x: 0, y: 0 },
          type: el.type || "custom",
          label: el.label || { align: "center", text: el.name || "label" },
          default: el.default || "",
          outputTargets: el.outputTargets || [],
          size: el.size || { width: 50, height: 50 },
        }));
      }
      setJson(JSON.stringify(parsed, null, 2));
      setCanAutoFix(false);
    } catch {
      // ignore
    }
  };

  // Sauvegarde côté backend et déclenche la revalidation dans ResultsPage
  const handleSaveToBackend = async () => {
    if (onSave) onSave(json);
  };

  return (
    <Box>
      <Typography variant="h6" mb={1}>Live JSON Editor</Typography>
      <Editor
        height="350px"
        defaultLanguage="json"
        value={json}
        onChange={handleChange}
        theme="vs-light"
        options={{
          fontSize: 15,
          minimap: { enabled: false },
          formatOnPaste: true,
          formatOnType: true,
        }}
        onMount={(editor) => (editorRef.current = editor)}
      />
      <Stack direction="row" spacing={2} mt={2} justifyContent="flex-end">
        <Tooltip title="Auto-fix structure">
          <span>
            <IconButton
              color="success"
              onClick={handleAutoFix}
              disabled={!canAutoFix}
              size="large"
              sx={{
                background: canAutoFix ? "#e8f5e9" : "#f5f5f5",
                "&:hover": { background: "#c8e6c9" }
              }}
            >
              <AutoFixHighIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSaveToBackend}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </Stack>
    </Box>
  );
};

export default JsonLiveEditor;