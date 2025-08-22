import React, { useState } from "react";
import {
  Box, Button, TextField, Typography, Stepper, Step, StepLabel, Paper, Fade, Stack, Card, CardContent, Grow, Avatar
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LinkIcon from "@mui/icons-material/Link";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import { keyframes } from "@emotion/react";

const steps = [
  { label: "Tree Info", icon: <InfoIcon color="primary" /> },
  { label: "Elements", icon: <ListAltIcon color="primary" /> },
  { label: "Transitions", icon: <LinkIcon color="primary" /> },
  { label: "Summary", icon: <CheckCircleIcon color="success" /> }
];

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(25,118,210,0.18);}
  70% { box-shadow: 0 0 0 18px rgba(25,118,210,0);}
  100% { box-shadow: 0 0 0 0 rgba(25,118,210,0);}
`;

type ElementInput = {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
};

type TransitionInput = {
  id: string;
  sourceTaskId: string;
  targetTaskId: string;
};

const SmartGuide: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  // Step 1: Tree Info
  const [treeId, setTreeId] = useState("clock1");
  const [schemaVersion, setSchemaVersion] = useState("1.0.0");

  // Step 2: Elements
  const [elements, setElements] = useState<ElementInput[]>([]);
  const [elementCount, setElementCount] = useState(1);

  // Step 3: Transitions
  const [transitions, setTransitions] = useState<TransitionInput[]>([]);
  const [transitionCount, setTransitionCount] = useState(1);

  // Génération du JSON final
  const generatedJson = {
    tree: {
      id: treeId,
      schema_version: schemaVersion,
      elements: elements.map(el => ({
        id: el.id,
        name: el.name,
        type: el.type,
        position: { x: el.x, y: el.y },
        label: { align: "center", text: el.name },
        default: "",
        outputTargets: [],
        size: { width: 50, height: 50 }
      })),
      transitions: transitions.map(tr => ({
        id: tr.id,
        sourceTaskId: tr.sourceTaskId,
        targetTaskId: tr.targetTaskId,
        isVirtual: false
      }))
    }
  };

  // Navigation
  const handleNext = () => setActiveStep((s) => s + 1);
  const handleBack = () => setActiveStep((s) => s - 1);

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5fafd 60%, #e3f2fd 100%)"
      }}
    >
      <Grow in>
        <Paper
          elevation={16}
          sx={{
            p: 0,
            borderRadius: 6,
            minWidth: 520,
            maxWidth: 700,
            width: "100%",
            boxShadow: "0 12px 48px 0 rgba(25,118,210,0.13)",
            background: "rgba(255,255,255,0.98)",
            overflow: "hidden"
          }}
        >
          {/* Header assistant */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 3,
              background: "linear-gradient(90deg, #1976d2 60%, #a7dcfcff 100%)"
            }}
          >
            <Avatar
              sx={{
                bgcolor: "#fff",
                color: "#1976d2",
                width: 60,
                height: 60,
                mr: 2,
                animation: `${pulse} 2.5s infinite`
              }}
            >
              <EmojiObjectsIcon sx={{ fontSize: 38 }} />
            </Avatar>
            <Typography
              variant="h4"
              fontWeight={800}
              color="#fff"
              letterSpacing={1.5}
              sx={{ textShadow: "0 2px 8px #1976d255" }}
            >
              Smart Guide
            </Typography>
          </Box>
          <Box sx={{ px: 5, pt: 4, pb: 2 }}>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((step, idx) => (
                <Step key={step.label}>
                  <StepLabel icon={step.icon}>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box>
              {activeStep === 0 && (
                <Card sx={{ mb: 3, p: 2, background: "#e3f2fd" }}>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>Tree Information</Typography>
                    <Stack spacing={2}>
                      <TextField label="Tree ID" value={treeId} onChange={e => setTreeId(e.target.value)} fullWidth />
                      <TextField label="Schema Version" value={schemaVersion} onChange={e => setSchemaVersion(e.target.value)} fullWidth />
                    </Stack>
                  </CardContent>
                </Card>
              )}
              {activeStep === 1 && (
                <Card sx={{ mb: 3, p: 2, background: "#e3f2fd" }}>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>Elements</Typography>
                    <TextField
                      label="Number of elements"
                      type="number"
                      value={elementCount}
                      onChange={e => {
                        const count = Math.max(1, Number(e.target.value));
                        setElementCount(count);
                        setElements((els) => {
                          const newEls = [...els];
                          while (newEls.length < count) newEls.push({ id: "", name: "", type: "", x: 0, y: 0 });
                          return newEls.slice(0, count);
                        });
                      }}
                      sx={{ mb: 2 }}
                      fullWidth
                    />
                    {Array.from({ length: elementCount }).map((_, idx) => (
                      <Box key={idx} sx={{ mb: 2, p: 2, background: "#fff", borderRadius: 2, boxShadow: "0 1px 4px #1976d211" }}>
                        <Typography fontWeight={700} color="primary">Element {idx + 1}</Typography>
                        <Stack direction="row" spacing={2} mt={1}>
                          <TextField label="ID" value={elements[idx]?.id || ""} onChange={e => {
                            const newEls = [...elements];
                            newEls[idx] = { ...newEls[idx], id: e.target.value };
                            setElements(newEls);
                          }} />
                          <TextField label="Name" value={elements[idx]?.name || ""} onChange={e => {
                            const newEls = [...elements];
                            newEls[idx] = { ...newEls[idx], name: e.target.value };
                            setElements(newEls);
                          }} />
                          <TextField label="Type" value={elements[idx]?.type || ""} onChange={e => {
                            const newEls = [...elements];
                            newEls[idx] = { ...newEls[idx], type: e.target.value };
                            setElements(newEls);
                          }} />
                        </Stack>
                        <Stack direction="row" spacing={2} mt={1}>
                          <TextField label="X" type="number" value={elements[idx]?.x || 0} onChange={e => {
                            const newEls = [...elements];
                            newEls[idx] = { ...newEls[idx], x: Number(e.target.value) };
                            setElements(newEls);
                          }} />
                          <TextField label="Y" type="number" value={elements[idx]?.y || 0} onChange={e => {
                            const newEls = [...elements];
                            newEls[idx] = { ...newEls[idx], y: Number(e.target.value) };
                            setElements(newEls);
                          }} />
                        </Stack>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              )}
              {activeStep === 2 && (
                <Card sx={{ mb: 3, p: 2, background: "#e3f2fd" }}>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>Transitions</Typography>
                    <TextField
                      label="Number of transitions"
                      type="number"
                      value={transitionCount}
                      onChange={e => {
                        const count = Math.max(1, Number(e.target.value));
                        setTransitionCount(count);
                        setTransitions((trs) => {
                          const newTrs = [...trs];
                          while (newTrs.length < count) newTrs.push({ id: "", sourceTaskId: "", targetTaskId: "" });
                          return newTrs.slice(0, count);
                        });
                      }}
                      sx={{ mb: 2 }}
                      fullWidth
                    />
                    {Array.from({ length: transitionCount }).map((_, idx) => (
                      <Box key={idx} sx={{ mb: 2, p: 2, background: "#fff", borderRadius: 2, boxShadow: "0 1px 4px #1976d211" }}>
                        <Typography fontWeight={700} color="primary">Transition {idx + 1}</Typography>
                        <Stack direction="row" spacing={2} mt={1}>
                          <TextField label="ID" value={transitions[idx]?.id || ""} onChange={e => {
                            const newTrs = [...transitions];
                            newTrs[idx] = { ...newTrs[idx], id: e.target.value };
                            setTransitions(newTrs);
                          }} />
                          <TextField label="Source Task ID" value={transitions[idx]?.sourceTaskId || ""} onChange={e => {
                            const newTrs = [...transitions];
                            newTrs[idx] = { ...newTrs[idx], sourceTaskId: e.target.value };
                            setTransitions(newTrs);
                          }} />
                          <TextField label="Target Task ID" value={transitions[idx]?.targetTaskId || ""} onChange={e => {
                            const newTrs = [...transitions];
                            newTrs[idx] = { ...newTrs[idx], targetTaskId: e.target.value };
                            setTransitions(newTrs);
                          }} />
                        </Stack>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              )}
              {activeStep === 3 && (
                <Card sx={{ mb: 3, p: 2, background: "#e8f5e9" }}>
                  <CardContent>
                    <Typography variant="h6" color="success.main" mb={2}>Summary</Typography>
                    <pre style={{ background: "#f5fafd", padding: 16, borderRadius: 8, fontSize: 13 }}>
                      {JSON.stringify(generatedJson, null, 2)}
                    </pre>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(generatedJson, null, 2)], { type: "application/json" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "clocktree.json";
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      Download JSON
                    </Button>
                  </CardContent>
                </Card>
              )}
            </Box>
            <Box mt={4} display="flex" justifyContent="space-between">
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
                color="primary"
                sx={{ borderRadius: 3, px: 4, fontWeight: 700 }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color={activeStep === steps.length - 1 ? "success" : "primary"}
                onClick={handleNext}
                disabled={activeStep === steps.length - 1}
                sx={{ borderRadius: 3, px: 4, fontWeight: 700 }}
              >
                {activeStep === steps.length - 2 ? "Finish" : "Next"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Grow>
    </Box>
  );
};

export default SmartGuide;