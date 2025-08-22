import React from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";

// Animation du logo (fade-in + zoom)
const logoFadeIn = keyframes`
  0% { opacity: 0; transform: scale(0.7);}
  60% { opacity: 1; transform: scale(1.1);}
  100% { opacity: 1; transform: scale(1);}
`;

// Animation du SVG (flottement)
const float = keyframes`
  0% { transform: translateY(0);}
  50% { transform: translateY(-16px);}
  100% { transform: translateY(0);}
`;

// Animation des cards (fade-in décalé)
const cardFadeIn = (delay: number) => keyframes`
  0% { opacity: 0; transform: translateY(40px) scale(0.95);}
  ${delay * 20}% { opacity: 0;}
  100% { opacity: 1; transform: translateY(0) scale(1);}
`;

// Modern SVG illustration
const ClockTreeSVG = () => (
  <svg width="200" height="140" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="30" width="160" height="80" rx="16" fill="#e3f2fd" />
    <rect x="40" y="50" width="120" height="40" rx="8" fill="#90caf9" />
    <circle cx="70" cy="70" r="12" fill="#1976d2" />
    <rect x="90" y="65" width="50" height="10" rx="3" fill="#1976d2" />
    <rect x="90" y="80" width="30" height="6" rx="2" fill="#1976d2" opacity="0.6" />
    <rect x="150" y="40" width="24" height="24" rx="6" fill="#fff" stroke="#1976d2" strokeWidth="2"/>
    <path d="M162 52 l6 6 l12 -12" stroke="#43a047" strokeWidth="2.5" fill="none" />
    <text x="100" y="125" textAnchor="middle" fontSize="18" fill="#1976d2" fontWeight="bold">ClockTree</text>
  </svg>
);

const features = [
  {
    title: "Validate Instantly",
    description: "Upload your clock tree JSON files and get instant feedback on their validity and structure.",
  },
  {
    title: "Edit & Fix Errors",
    description: "Easily identify, edit, or remove problematic entries directly from the interface.",
  },
  {
    title: "Professional Reports",
    description: "Export detailed PDF validation reports for documentation or sharing with your team.",
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, #f5fafd 100%)`,
        py: 8,
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={4} sx={{ p: { xs: 3, md: 6 }, borderRadius: 5, mb: 6 }}>
          {/* Logo animé */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={3}
            sx={{
              animation: `${logoFadeIn} 1.2s cubic-bezier(.36,.07,.19,.97) both`,
            }}
          >
            <img
              src="/logostjpg.jpg"
              alt="Company Logo"
              style={{
                height: 60,
                marginRight: 16,
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                background: "#fff"
              }}
            />
            <Typography variant="h4" color="primary" fontWeight={700}>
            
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
  <path d="M8 17L14 23L24 9" stroke="#43a047" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/> 
</svg>   ClockTree-Checker
            </Typography>
          </Box>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={5}
            alignItems="center"
            justifyContent="center"
          >
            {/* SVG animé */}
            <Box
              flex={1}
              display="flex"
              justifyContent="center"
              sx={{
                animation: `${float} 3.5s ease-in-out infinite`,
              }}
            >
              <ClockTreeSVG />
            </Box>
            <Box flex={2}>
              <Typography variant="h5" gutterBottom color="text.secondary">
                The smart way to validate, edit, and export your clock tree JSON files.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                ClockTree Validator helps you ensure the integrity of your clock tree configuration files.
                Instantly detect errors, make corrections, and generate professional validation reports—all in one place.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate("/validator")}
                  sx={{
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    borderRadius: 3,
                    boxShadow: "0 2px 8px rgba(41,128,185,0.12)",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.07)",
                      background: theme.palette.primary.dark,
                    },
                  }}
                >
                  Start Validating
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={() => navigate("/about")}
                  sx={{
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    borderRadius: 3,
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.07)",
                      borderColor: theme.palette.primary.dark,
                      color: theme.palette.primary.dark,
                    },
                  }}
                >
                  Learn More
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Paper>

        {/* Feature Highlights animées */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
            Why Choose ClockTree Validator?
          </Typography>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            alignItems="stretch"
            justifyContent="center"
          >
            {features.map((feature, idx) => (
              <Card
                key={idx}
                elevation={2}
                sx={{
                  borderRadius: 3,
                  flex: 1,
                  minWidth: 220,
                  maxWidth: 340,
                  mx: "auto",
                  mb: { xs: 2, md: 0 },
                  opacity: 0,
                  animation: `${cardFadeIn(idx)} 1s ${0.3 + idx * 0.2}s both`,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "scale(1.04)",
                    boxShadow: "0 8px 32px rgba(41,128,185,0.15)",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom fontWeight={700}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>

        {/* Call to Action */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            background: theme.palette.primary.main,
            color: "#fff",
            textAlign: "center",
            animation: `${logoFadeIn} 1.2s 1.2s both`,
          }}
        >
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Ready to streamline your clock tree validation?
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate("/validator")}
            sx={{
              mt: 2,
              fontWeight: 700,
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              borderRadius: 3,
              boxShadow: "0 2px 8px rgba(185, 41, 185, 0.12)",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.07)",
                background: theme.palette.secondary.dark,
              },
            }}
          >
            Get Started Now
          </Button>
        </Paper>

        {/* Footer */}
        <Box mt={6} textAlign="center" color="text.secondary">
          <Typography variant="caption">
            © 2025 ClockTree Validator — Developed by Farah Kouki
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;