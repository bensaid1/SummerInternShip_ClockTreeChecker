import React from "react";
import { Container, Box } from "@mui/material";
import JsonLiveEditor from "../components/JsonLiveEditor";

const LiveEditor: React.FC = () => (
  <Container maxWidth="md" sx={{ mt: 6 }}>
    <Box>
      <JsonLiveEditor />
    </Box>
  </Container>
);

export default LiveEditor;