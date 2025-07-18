import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import LoadingScreen from "@components/ui/loader/loadingScreen";
import CategoryFormDialog from "./components/modal/categoryFormDialog";
import DeleteConfirmDialog from "./components/modal/deleteConfirmDialog";

import { useCategory } from "@hooks/api/category/useGetAllCategory";
import { useDeleteCategory } from "@hooks/api/category/useDeleteCategory";
import { useAddEditCategory } from "@hooks/api/category/useAddEditCategory";

import { useLanguage } from "@/contexts/language/LanguageContext";

interface Category {
  id: string;
  "name[en]": string;
  "name[ar]": string;
  thumbnailUrl?: string;
}

const CategoryPage: React.FC = () => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const { categories, loading, error, refetch } = useCategory();
  const [localCategories, setLocalCategories] = useState(categories);
  const [openForm, setOpenForm] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteCat, setDeleteCat] = useState<Category | null>(null);

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  const { triggerDeleteCategory } = useDeleteCategory(() => {
    refetch();
    setOpenDelete(false);
  });
  const { handleAddCategory, handleEditCategory } = useAddEditCategory(() => {
    setOpenForm(false);
    refetch();
  });

  if (loading) return <LoadingScreen />;
  if (error) return <Alert severity="error">{error.message}</Alert>;

  return (
    <Box p={1}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" fontWeight={600}>
          {isAr ? "الفئات" : "Categories"}
        </Typography>
        <Button variant="contained" size="large" onClick={() => { setEditCategory(null); setOpenForm(true); }}>
          {isAr ? "إضافة فئة جديدة" : "Add New Category"}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {localCategories.map((cat) => (
          <Grid size={{xs:12, sm: 6, md:3}} key={cat.id}>
            <Card sx={{ p: 0.5, borderRadius: 3, boxShadow: 3, "&:hover": { boxShadow: 6, transform: "translateY(-2px)" } }}>
              <CardContent sx={{ pb: 0 }}>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {isAr ? "الاسم (إنجليزي)" : "English Name"}
                </Typography>
                <Typography variant="h6" fontWeight={500} gutterBottom>
                  {cat["name[en]"]}
                </Typography>

                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {isAr ? "الاسم (عربي)" : "Arabic Name"}
                </Typography>
                <Typography variant="h6" fontWeight={500}>
                  {cat["name[ar]"]}
                </Typography>
              </CardContent>

              <CardActions sx={{ mt: 2, display: "flex", justifyContent: "flex-end", pt: 0 }}>
                <IconButton aria-label="edit" onClick={() => { setEditCategory(cat); setOpenForm(true); }}>
                  <EditIcon />
                </IconButton>
                <IconButton aria-label="delete" color="error" onClick={() => { setDeleteCat(cat); setOpenDelete(true); }}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <CategoryFormDialog
        open={openForm}
        initialData={editCategory}
        onClose={() => setOpenForm(false)}
        onSave={(formData) => {
          if (editCategory) handleEditCategory(editCategory.id, formData);
          else handleAddCategory(formData);
        }}
      />

      <DeleteConfirmDialog
        open={openDelete}
        categoryName={deleteCat?.[isAr ? "name[ar]" : "name[en]"]}
        onClose={() => setOpenDelete(false)}
        onDelete={() => deleteCat && triggerDeleteCategory(deleteCat.id)}
      />
    </Box>
  );
};

export default CategoryPage;
