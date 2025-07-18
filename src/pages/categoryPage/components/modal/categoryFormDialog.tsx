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
  IconButton,
  useTheme,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { useLanguage } from "@/contexts/language/LanguageContext";

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
  const { lang } = useLanguage();
  const isAr = lang === "ar";

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
        {initialData
          ? isAr
            ? "تعديل الفئة"
            : "Edit Category"
          : isAr
            ? "إضافة فئة جديدة"
            : "Add New Category"}
      </DialogTitle>
      <DialogContent dividers>
        <Box mb={2}>
          <TextField
            label={isAr ? "اسم الفئة (إنجليزي)" : "Category Name (English)"}
            fullWidth
            margin="dense"
            value={formEn}
            onChange={(e) => setFormEn(e.target.value)}
          />
          <TextField
            label={isAr ? "اسم الفئة (عربي)" : "Category Name (Arabic)"}
            fullWidth
            margin="dense"
            value={formAr}
            onChange={(e) => setFormAr(e.target.value)}
            inputProps={{ dir: "rtl" }}
          />
        </Box>

        {!initialData && (
          <Box mb={2}>
            <InputLabel sx={{ mb: 1, fontWeight: 600 }}>
              {isAr ? "صورة الفئة" : "Category Image"}
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
                bgcolor: dragOver ? theme.palette.action.hover : "transparent",
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
                    ? isAr
                      ? "أسقط الصورة هنا"
                      : "Drop image here"
                    : isAr
                      ? "انقر أو اسحب صورة للتحميل"
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
        <Button onClick={onClose}>{isAr ? "إلغاء" : "Cancel"}</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={
            !formEn.trim() || !formAr.trim() || (!initialData && !image)
          }
        >
          {initialData ? (isAr ? "تحديث" : "Update") : isAr ? "إضافة" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryFormDialog;
