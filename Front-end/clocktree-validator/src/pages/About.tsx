import React from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CodeIcon from "@mui/icons-material/Code";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import DescriptionIcon from "@mui/icons-material/Description";

const About: React.FC = () => (
  <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
    <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
      <Stack spacing={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <InfoOutlinedIcon color="primary" fontSize="large" />
          <Typography variant="h4" fontWeight={700} color="primary">
            About ClockTree Validator
          </Typography>
        </Box>
        <Divider />
        <Typography variant="body1" color="text.secondary">
          <b>ClockTree Validator</b> is a modern web application designed to help you validate, review, and document your clock tree JSON configuration files with ease and confidence.
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleOutlineIcon color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Validate your JSON files against the ClockTree schema"
              secondary="Instantly detect errors and inconsistencies in your configuration files."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CodeIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Built with NodeJs, React, TypeScript, and Material UI"
              secondary="Enjoy a fast, secure, and user-friendly experience."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <VerifiedUserIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary="Edit and fix errors directly in the interface"
              secondary="No need for external tools—make corrections and revalidate instantly."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <DescriptionIcon color="action" />
            </ListItemIcon>
            <ListItemText
              primary="Export professional validation reports"
              secondary="Generate PDF reports for documentation or sharing with your team."
            />
          </ListItem>
        </List>
        <Divider />
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
  <circle cx="20" cy="20" r="20" fill="#1976d2"/>
  <path d="M12 21L18 27L28 13" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          Developed by Farah Kouki &mdash; 2025
         
        </Typography>
        
      </Stack>
    </Paper>
  </Container>
);

export default About;