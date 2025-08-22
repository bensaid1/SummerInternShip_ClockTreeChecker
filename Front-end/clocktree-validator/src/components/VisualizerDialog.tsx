// src/components/VisualizerDialog.tsx
import React from "react";
import { Dialog, DialogTitle, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visualizer from "./Visualizer";

type VisualizerDialogProps = {
  open: boolean;
  onClose: () => void;
  jsonContent: string;
};

const VisualizerDialog: React.FC<VisualizerDialogProps> = ({
  open,
  onClose,
  jsonContent,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
    <DialogTitle>
      ClockTree Visualization
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <Box sx={{ m: 2 }}>
      <Visualizer jsonContent={jsonContent} />
    </Box>
  </Dialog>
);

export default VisualizerDialog;