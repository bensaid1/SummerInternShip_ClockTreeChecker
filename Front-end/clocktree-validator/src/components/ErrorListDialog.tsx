import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

type Props = {
  open: boolean;
  errors: string[];
  onClose: () => void;
};

const ErrorListDialog: React.FC<Props> = ({ open, errors, onClose }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>All Errors</DialogTitle>
    <DialogContent dividers>
      <List dense>
        {errors.map((err, i) => (
          <ListItem key={i}>
            <ListItemText
              primary={
                <span>
                  <b>{i + 1}.</b> {err}
                </span>
              }
            />
          </ListItem>
        ))}
      </List>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);

export default ErrorListDialog;