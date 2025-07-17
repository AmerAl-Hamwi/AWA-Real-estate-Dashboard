import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

interface DeleteConfirmDialogProps {
  open: boolean;
  categoryName?: string;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteConfirmDialog({
  open,
  categoryName,
  onClose,
  onDelete,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Category</DialogTitle>
      <DialogContent>
        Are you sure you want to delete “{categoryName}”?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={onDelete}>
          Yes, Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
