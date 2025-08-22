import React from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link,
  Paper,
  Box,
  Divider,
  ListItemIcon,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const Help: React.FC = () => (
  <Box
    sx={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5fafd 0%, #e3e3e3 100%)",
      py: 8,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
    }}
  >
    <Container maxWidth="sm">
      <Paper
        elevation={8}
        sx={{
          p: 4,
          borderRadius: 5,
          mt: 8,
          boxShadow: "0 8px 32px 0 rgba(25,118,210,0.13)",
          background: "linear-gradient(135deg, #fff 80%, #f5fafd 100%)",
        }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <HelpOutlineIcon color="primary" sx={{ fontSize: 38, mr: 1 }} />
          <Typography variant="h4" fontWeight={700} color="primary">
            Help & Documentation
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
          Find answers to the most common questions and access the ClockTree schema documentation.
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <List>
          <ListItem
            sx={{
              borderRadius: 3,
              mb: 2,
              transition: "background 0.2s",
              "&:hover": { background: "#f5fafd" },
            }}
          >
            <ListItemIcon>
              <CheckCircleOutlineIcon color="success" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography fontWeight={600} fontSize={18}>
                  How to validate a file?
                </Typography>
              }
              secondary={
                <Typography color="text.secondary">
                  Go to the <b>Validation</b> page, upload your JSON file, and click <b>'Validate'</b>.
                </Typography>
              }
            />
          </ListItem>
          <ListItem
            sx={{
              borderRadius: 3,
              mb: 2,
              transition: "background 0.2s",
              "&:hover": { background: "#f5fafd" },
            }}
          >
            <ListItemIcon>
              <EditNoteIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography fontWeight={600} fontSize={18}>
                  How to edit or delete lines?
                </Typography>
              }
              secondary={
                <Typography color="text.secondary">
                  Click <b>'Edit/Delete'</b> on a result, search for a keyword, and use the edit or delete buttons.
                </Typography>
              }
            />
          </ListItem>
          <ListItem
            sx={{
              borderRadius: 3,
              mb: 1,
              transition: "background 0.2s",
              "&:hover": { background: "#f5fafd" },
            }}
          >
            <ListItemIcon>
              <DescriptionIcon color="secondary" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography fontWeight={600} fontSize={18}>
                  Where can I find the schema documentation?
                </Typography>
                
              }
              secondary={
                <Link
                  href="/Documentation Projet.docx"
                  target="_blank"
                  rel="noopener"
                  underline="hover"
                  sx={{
                    fontWeight: 600,
                    color: "secondary.main",
                    fontSize: 16,
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  📄 ClockTree Checker Documentation (docx)
                </Link>
              }
            />
          </ListItem>
        </List>
      </Paper>
    </Container>
  </Box>
);

export default Help;