import React, { useEffect, useState, DragEvent } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  InputLabel,
  Box,
  Paper,
  Typography,
  useTheme,
  IconButton,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";

interface CategoryFormDialogProps {
  open: boolean;
  initialData?: { "name[en]": string; "name[ar]": string } | null;
  onClose: () => void;
  onSave: (data: FormData) => void;
}

const CategoryFormDialog: React.FC<CategoryFormDialogProps> = ({
  open,
  initialData,
  onClose,
  onSave,
}) => {
  const theme = useTheme();
  const [formEn, setFormEn] = useState("");
  const [formAr, setFormAr] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormEn(initialData["name[en]"]);
      setFormAr(initialData["name[ar]"]);
    } else {
      setFormEn("");
      setFormAr("");
      setImage(null);
    }
  }, [initialData, open]);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    }
  };
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    }
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("name[en]", formEn);
    formData.append("name[ar]", formAr);
    if (!initialData && image) {
      formData.append("image", image);
    }
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initialData ? "Edit Category" : "Add New Category"}
      </DialogTitle>
      <DialogContent dividers>
        <Box mb={2}>
          <TextField
            label="Category Name (English)"
            fullWidth
            variant="outlined"
            margin="dense"
            value={formEn}
            onChange={(e) => setFormEn(e.target.value)}
          />
          <TextField
            label="Category Name (Arabic)"
            fullWidth
            variant="outlined"
            margin="dense"
            value={formAr}
            onChange={(e) => setFormAr(e.target.value)}
            inputProps={{ dir: "rtl" }}
          />
        </Box>

        {!initialData && (
          <Box mb={2}>
            <InputLabel sx={{ mb: 1, fontWeight: 600 }}>
              Category Image
            </InputLabel>
            <Paper
              variant="outlined"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              sx={{
                p: 2,
                textAlign: "center",
                borderStyle: "dashed",
                borderColor: dragOver
                  ? theme.palette.primary.main
                  : theme.palette.divider,
                bgcolor: dragOver
                  ? theme.palette.action.hover
                  : "transparent",
                cursor: "pointer",
              }}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <IconButton>
                <UploadIcon fontSize="large" />
              </IconButton>
              <Typography variant="body2" color="textSecondary">
                {image
                  ? image.name
                  : dragOver
                  ? "Drop image here"
                  : "Click or drag image to upload"}
              </Typography>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileSelect}
              />
            </Paper>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={
            !formEn.trim() ||
            !formAr.trim() ||
            (!initialData && !image)
          }
        >
          {initialData ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryFormDialog;
