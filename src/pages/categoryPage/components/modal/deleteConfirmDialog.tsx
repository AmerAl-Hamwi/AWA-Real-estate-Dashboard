import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { useLanguage } from "@/contexts/language/LanguageContext";

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
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {isAr ? "حذف الفئة" : "Delete Category"}
      </DialogTitle>
      <DialogContent>
        {isAr
          ? `هل أنت متأكد من حذف “${categoryName}”؟`
          : `Are you sure you want to delete “${categoryName}”?`}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {isAr ? "إلغاء" : "Cancel"}
        </Button>
        <Button color="error" variant="contained" onClick={onDelete}>
          {isAr ? "نعم، احذف" : "Yes, Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
