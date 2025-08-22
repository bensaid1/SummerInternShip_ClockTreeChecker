import React, { useState, useRef, useEffect } from "react";
import { faq } from "../utils/faqData";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Paper,
  Fade,
  Avatar,
  useTheme,
  Zoom,
  CircularProgress,
  Tooltip,
  Divider,
  Drawer,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteIcon from "@mui/icons-material/Delete";
import { keyframes } from "@emotion/react";

// Animations
const bounce = keyframes`
  0% { transform: scale(1);}
  50% { transform: scale(1.12);}
  100% { transform: scale(1);}
`;
const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(25,118,210,0.25);}
  70% { box-shadow: 0 0 0 12px rgba(25,118,210,0);}
  100% { box-shadow: 0 0 0 0 rgba(25,118,210,0);}
`;
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px);}
  to { opacity: 1; transform: translateY(0);}
`;

const ChatbotHybride: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([
    {
      from: "bot",
      text: "👋 Hello! I'm your ClockTree Assistant. How can I help you today? 🤖",
    },
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [lastUnanswered, setLastUnanswered] = useState<string | null>(null);
  const [botTyping, setBotTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const theme = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  // --- Speech-to-text ---
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.onresult = (event: any) => {
      setInput(event.results[0][0].transcript);
      setListening(false);
    };
    recognitionRef.current.onend = () => setListening(false);
    recognitionRef.current.start();
    setListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  const findAnswer = (question: string) => {
    const lower = question.toLowerCase();
    for (const item of faq) {
      if (item.keywords.some((k) => lower.includes(k))) {
        return item.answer;
      }
    }
    return null;
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { from: "user", text: input }]);
    setHistory((hist) => [...hist, input]);
    setBotTyping(true);
    const answer = findAnswer(input);
    setInput("");
    setTimeout(() => {
      setBotTyping(false);
      if (answer) {
        setMessages((msgs) => [...msgs, { from: "bot", text: answer }]);
        setLastUnanswered(null);
      } else {
        setMessages((msgs) => [
          ...msgs,
          {
            from: "bot",
            text:
              "❓ Sorry, I didn't understand your question. You can contact support or, if available, ask the other AI.",
          },
        ]);
        setLastUnanswered(input);
      }
    }, 900);
  };

  const handleContactSupport = () => {
    window.open(
      "mailto:support@your-company.com?subject=ClockTree%20Assistant%20Question",
      "_blank"
    );
  };

  const handleAskAI = async () => {
    setMessages((msgs) => [
      ...msgs,
      { from: "bot", text: "🤖 AI function is not available on this network." },
    ]);
  };

  const handleDeleteHistoryItem = (idx: number) => {
    setHistory((hist) => hist.filter((_, i) => i !== idx));
  };

  // Colors
  const accent = theme.palette.primary.main;
  const accentLight = theme.palette.primary.light;
  const userBubble = "linear-gradient(135deg, #f5fafd 60%, #a7dcfc 100%)";
  const botBubble = "linear-gradient(135deg, #1976d2 60%, #90caf9 100%)";

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <Zoom in={!open}>
          <Box
            sx={{
              position: "fixed",
              bottom: 32,
              right: 32,
              zIndex: 1300,
              animation: `${bounce} 1.5s infinite`,
            }}
          >
            <IconButton
              onClick={() => setOpen(true)}
              sx={{
                background: `linear-gradient(135deg, ${accent} 60%, #90caf9 100%)`,
                color: "#fff",
                width: 68,
                height: 68,
                boxShadow: "0 4px 24px 0 rgba(25,118,210,0.18)",
                "&:hover": {
                  background: `linear-gradient(135deg, #90caf9 0%, ${accent} 100%)`,
                  transform: "scale(1.10)",
                },
                transition: "all 0.3s",
              }}
            >
              <ChatIcon sx={{ fontSize: 38 }} />
            </IconButton>
          </Box>
        </Zoom>
      )}

      {/* Historique Drawer */}
      <Drawer
        anchor="left"
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        PaperProps={{
          sx: {
            width: 300,
            background: "#e3f2fd",
            p: 2,
            pt: 0,
            boxShadow: "0 2px 16px 0 rgba(25,118,210,0.10)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", p: 2, pb: 1 }}>
          <IconButton onClick={() => setHistoryOpen(false)} color="primary">
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h6" color="primary" fontWeight={700} ml={1}>
            Question history
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ mt: 2 }}>
          {history.length === 0 ? (
            <Typography color="text.secondary" sx={{ px: 2 }}>
              No questions yet.
            </Typography>
          ) : (
            history.map((q, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                  pl: 2,
                  pr: 1,
                  py: 0.5,
                  borderRadius: 2,
                  background: "#fff",
                  boxShadow: "0 1px 4px 0 rgba(25,118,210,0.04)",
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ flex: 1, pr: 1 }}>
                  {q}
                </Typography>
                <Tooltip title="Delete this question">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteHistoryItem(idx)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            ))
          )}
        </Box>
      </Drawer>

      {/* Chatbot Window */}
      <Fade in={open}>
        <Paper
          elevation={16}
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            width: 390,
            maxWidth: "95vw",
            height: 520,
            borderRadius: 5,
            zIndex: 1400,
            display: open ? "flex" : "none",
            flexDirection: "column",
            background: "linear-gradient(135deg, #f5fafd 60%, #e3f2fd 100%)",
            boxShadow: "0 8px 32px 0 rgba(25,118,210,0.18)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              background: `linear-gradient(90deg, ${accent} 60%, #90caf9 100%)`,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              boxShadow: "0 2px 8px 0 rgba(25,118,210,0.10)",
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar
                sx={{
                  bgcolor: "#fff",
                  color: accent,
                  width: 38,
                  height: 38,
                  animation: `${pulse} 2.5s infinite`,
                  border: `2.5px solid ${accent}`,
                  fontWeight: 700,
                  fontSize: 22,
                  boxShadow: "0 2px 8px 0 rgba(25,118,210,0.10)",
                }}
              >
                <SupportAgentIcon sx={{ fontSize: 28 }} />
              </Avatar>
              <Typography fontWeight={700} fontSize={18}>
                ClockTree Assistant
              </Typography>
            </Box>
            <Box>
              <Tooltip title="Show question history">
                <IconButton
                  onClick={() => setHistoryOpen(true)}
                  sx={{
                    color: "#fff",
                    mr: 1,
                    "&:hover": { color: "#1976d2", background: "#fff" },
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Tooltip>
              <IconButton
                onClick={() => setOpen(false)}
                sx={{
                  color: "#fff",
                  "&:hover": { color: "#1976d2", background: "#fff" },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              px: 2,
              py: 2,
              overflowY: "auto",
              background: "transparent",
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            {messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  alignSelf: msg.from === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  animation: `${fadeInUp} 0.5s`,
                }}
              >
                <Box
                  sx={{
                    background: msg.from === "user" ? userBubble : botBubble,
                    color: msg.from === "user" ? accent : "#fff",
                    px: 2,
                    py: 1.2,
                    borderRadius: 3,
                    borderBottomRightRadius: msg.from === "user" ? 0 : 12,
                    borderBottomLeftRadius: msg.from === "user" ? 12 : 0,
                    fontSize: 15,
                    boxShadow:
                      msg.from === "user"
                        ? "0 2px 8px 0 rgba(25,118,210,0.08)"
                        : "0 2px 12px 0 rgba(25,118,210,0.13)",
                    transition: "all 0.3s",
                  }}
                >
                  {msg.text}
                </Box>
              </Box>
            ))}
            {botTyping && (
              <Box
                sx={{
                  alignSelf: "flex-start",
                  maxWidth: "85%",
                  animation: `${fadeInUp} 0.5s`,
                }}
              >
                <Box
                  sx={{
                    background: botBubble,
                    color: "#fff",
                    px: 2,
                    py: 1.2,
                    borderRadius: 3,
                    borderBottomLeftRadius: 0,
                    fontSize: 15,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
                  Typing...
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid #e3e3e3",
              background: "#f5fafd",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <TextField
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              size="small"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              sx={{
                background: "#fff",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { border: "none" },
                },
              }}
              disabled={botTyping}
            />
            <IconButton
              onClick={listening ? stopListening : startListening}
              color={listening ? "error" : "primary"}
              sx={{ ml: 0.5 }}
              disabled={botTyping}
            >
              {listening ? <StopIcon /> : <MicIcon />}
            </IconButton>
            <Button
              onClick={sendMessage}
              variant="contained"
              color="primary"
              sx={{
                minWidth: 0,
                px: 2,
                py: 1,
                borderRadius: 2,
                boxShadow: "0 2px 8px 0 rgba(25,118,210,0.10)",
              }}
              disabled={!input.trim() || botTyping}
            >
              <SendIcon />
            </Button>
          </Box>

          {/* Escalation options */}
          {lastUnanswered && !botTyping && (
            <Box
              sx={{
                p: 2,
                borderTop: "1px solid #e3e3e3",
                background: "#e3f2fd",
                display: "flex",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handleContactSupport}
                sx={{ fontWeight: 600 }}
              >
                Contact support
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleAskAI}
                disabled
                sx={{ fontWeight: 600 }}
              >
                Ask AI
              </Button>
            </Box>
          )}
        </Paper>
      </Fade>
    </>
  );
};

export default ChatbotHybride;