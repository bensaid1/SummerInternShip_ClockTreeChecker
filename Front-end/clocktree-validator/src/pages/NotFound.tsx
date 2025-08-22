import React from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";

// Animation de tremblement pour l'icône
const shake = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  20% { transform: rotate(-10deg) scale(1.1);}
  40% { transform: rotate(10deg) scale(1.1);}
  60% { transform: rotate(-10deg) scale(1.1);}
  80% { transform: rotate(10deg) scale(1.1);}
  100% { transform: rotate(0deg) scale(1);}
`;

// Animation de fond (bulles qui montent)
const bubble = keyframes`
  0% { opacity: 0.7; transform: translateY(0) scale(1);}
  100% { opacity: 0; transform: translateY(-300px) scale(1.3);}
`;

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Génère des bulles animées en fond
  const bubbles = Array.from({ length: 12 }).map((_, i) => {
    const left = Math.random() * 100;
    const size = 30 + Math.random() * 60;
    const duration = 6 + Math.random() * 4;
    const delay = Math.random() * 4;
    return (
      <Box
        key={i}
        sx={{
          position: "absolute",
          left: `${left}%`,
          bottom: -100,
          width: size,
          height: size,
          borderRadius: "50%",
          background: theme.palette.primary.light,
          opacity: 0.15,
          filter: "blur(1.5px)",
          animation: `${bubble} ${duration}s linear ${delay}s infinite`,
        }}
      />
    );
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, #f5fafd 100%)`,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Bulles animées */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        {bubbles}
      </Box>

      <Container maxWidth="sm" sx={{ zIndex: 1 }}>
        <Paper
          elevation={6}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 5,
            textAlign: "center",
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}
        >
          <Box mb={2}>
            <ErrorOutlineIcon
              color="error"
              sx={{
                fontSize: 120,
                animation: `${shake} 1.2s cubic-bezier(.36,.07,.19,.97) both infinite`,
                mb: 1,
                filter: "drop-shadow(0 4px 16px rgba(244,67,54,0.25))",
              }}
            />
          </Box>
          <Typography
            variant="h1"
            color="error"
            fontWeight={900}
            sx={{
              fontSize: { xs: "3rem", md: "4.5rem" },
              letterSpacing: 2,
              mb: 1,
              textShadow: "0 2px 8px rgba(244,67,54,0.10)",
            }}
          >
            404
          </Typography>
          <Typography
            variant="h4"
            color="primary"
            fontWeight={700}
            sx={{ mb: 2 }}
          >
            Oops! Something went wrong...
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, fontSize: "1.2rem" }}
          >
            The page you are looking for doesn’t exist or has been moved.<br />
            Don’t worry, let’s get you back on track!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              px: 5,
              py: 1.5,
              fontWeight: 700,
              fontSize: "1.1rem",
              borderRadius: 3,
              boxShadow: "0 2px 8px rgba(41,128,185,0.12)",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.07)",
                background: theme.palette.primary.dark,
              },
            }}
            onClick={() => navigate("/")}
          >
            Go Home
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default NotFound;