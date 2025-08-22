import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Tooltip } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import BarChartIcon from "@mui/icons-material/BarChart";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects"; // <-- Ajout

const lilac = "#a7dcfcff";
const blue = "#1976d2";
const white = "#fff";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Validator", to: "/validator" },
  { label: "About", to: "/about" },
  { label: "Statistics", to: "/batch-validator", icon: <BarChartIcon /> },
  { label: "Smart Guide", to: "/assistant", icon: <EmojiObjectsIcon /> }, // <-- Ajout ici
];

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      elevation={6}
      sx={{
        background: `linear-gradient(90deg, ${blue} 60%, ${lilac} 100%)`,
        transition: "background 0.6s cubic-bezier(.4,0,.2,1)",
        boxShadow: "0 4px 20px 0 rgba(25, 118, 210, 0.2)",
      }}
    >
      <Toolbar>
        {/* Logo and Title */}
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Avatar
            src="/logostjpg.jpg"
            alt="Company Logo"
            sx={{
              width: 40,
              height: 40,
              mr: 2,
              bgcolor: "white",
              boxShadow: "0 2px 8px 0 rgba(25,118,210,0.10)",
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              letterSpacing: 1.5,
              color: white,
              fontFamily: "'Poppins', 'Nunito', 'Roboto', sans-serif",
              userSelect: "none",
              transition: "color 0.4s",
              fontSize: { xs: "1.1rem", sm: "1.5rem" },
            }}
          >
            ClockTree Checker
          </Typography>
        </Box>
        {/* Navigation Links */}
        <Box>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Button
                key={link.to}
                component={Link}
                to={link.to}
                startIcon={link.icon}
                sx={{
                  color: white,
                  fontWeight: 600,
                  fontSize: "1.05rem",
                  mx: 1,
                  px: 2,
                  borderRadius: 2,
                  position: "relative",
                  overflow: "hidden",
                  background: isActive
                    ? `linear-gradient(90deg, ${lilac} 60%, ${blue} 100%)`
                    : "transparent",
                  boxShadow: isActive
                    ? "0 2px 8px 0 rgba(179,157,219,0.15)"
                    : "none",
                  transition:
                    "background 0.4s, box-shadow 0.4s, color 0.3s, transform 0.2s",
                  "&:hover": {
                    background: `linear-gradient(90deg, ${lilac} 40%, ${blue} 100%)`,
                    color: blue,
                    transform: "translateY(-2px) scale(1.05)",
                    boxShadow: "0 4px 16px 0 rgba(25,118,210,0.15)",
                  },
                  "&::after": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    left: 16,
                    right: 16,
                    bottom: 6,
                    height: 3,
                    borderRadius: 2,
                    background: isActive
                      ? white
                      : "transparent",
                    transition: "background 0.4s",
                  },
                }}
              >
                {link.label}
              </Button>
            );
          })}
          {/* Bouton Help à droite */}
          <Tooltip title="Get help, FAQ and documentation">
            <Button
              color="inherit"
              startIcon={<HelpOutlineIcon />}
              sx={{
                ml: 2,
                fontWeight: 700,
                fontSize: "1.05rem",
                borderRadius: 2,
                px: 2,
                background: location.pathname === "/help"
                  ? `linear-gradient(90deg, ${lilac} 60%, ${blue} 100%)`
                  : "transparent",
                color: white,
                boxShadow: location.pathname === "/help"
                  ? "0 2px 8px 0 rgba(179,157,219,0.15)"
                  : "none",
                transition:
                  "background 0.4s, box-shadow 0.4s, color 0.3s, transform 0.2s",
                "&:hover": {
                  background: `linear-gradient(90deg, ${lilac} 40%, ${blue} 100%)`,
                  color: blue,
                  transform: "translateY(-2px) scale(1.05)",
                  boxShadow: "0 4px 16px 0 rgba(25,118,210,0.15)",
                },
                "&::after": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  left: 16,
                  right: 16,
                  bottom: 6,
                  height: 3,
                  borderRadius: 2,
                  background: location.pathname === "/help"
                    ? white
                    : "transparent",
                  transition: "background 0.4s",
                },
              }}
              onClick={() => navigate("/help")}
            >
              Help
            </Button>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;