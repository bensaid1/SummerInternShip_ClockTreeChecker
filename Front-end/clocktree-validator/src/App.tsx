import React from "react";
import { SnackbarProvider } from "notistack";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Validator from "./pages/Validator";
import ResultsPage from "./pages/ResultsPage";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Help from "./pages/Help";

import BatchValidator from "./pages/BatchValidator";
import ChatbotHybride from "./components/ChatbotHybride"; 

import LiveEditor from "./pages/LiveEditor";
import AssistantStepByStep from "./components/AssistantStepByStep";

const App: React.FC = () => (
  <SnackbarProvider
    maxSnack={3}
    anchorOrigin={{ vertical: "top", horizontal: "right" }}
    autoHideDuration={3500}
    preventDuplicate
  >
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/validator" element={<Validator />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
         <Route path="/batch-validator" element={<BatchValidator />} />
         <Route path="/live-editor" element={<LiveEditor />} />
         <Route path="/assistant" element={<AssistantStepByStep />} />
         <Route path="*" element={<NotFound />} />
      </Routes>
      <ChatbotHybride />
    </BrowserRouter>
  </SnackbarProvider>
);

export default App;