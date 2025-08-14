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
  Avatar,
  CircularProgress,
  Paper,
  useTheme,
  useMediaQuery,
  Stack,
  Divider
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CategoryIcon from '@mui/icons-material/Category';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const { categories, loading, error, refetch } = useCategory();
  const [localCategories, setLocalCategories] = useState(categories);
  const [openForm, setOpenForm] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteCat, setDeleteCat] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  const { triggerDeleteCategory } = useDeleteCategory(() => {
    refetch();
    setOpenDelete(false);
    setDeletingId(null);
  });
  
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await triggerDeleteCategory(id);
  };

  const { handleAddCategory, handleEditCategory } = useAddEditCategory(() => {
    setOpenForm(false);
    refetch();
  });

  if (loading) return <LoadingScreen />;
  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error.message}</Alert>;

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7f1 100%)',
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: theme.shadows[2],
        }}
      >
        <Stack 
          direction={isMobile ? "column" : "row"} 
          alignItems={isMobile ? "flex-start" : "center"} 
          justifyContent="space-between"
          spacing={2}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ 
              bgcolor: theme.palette.primary.main, 
              width: 56, 
              height: 56 
            }}>
              <CategoryIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {isAr ? "إدارة الفئات" : "Category Management"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {isAr ? "إدارة جميع فئات المنتجات في النظام" : "Manage all product categories in the system"}
              </Typography>
            </Box>
          </Stack>
          
          <Button 
            variant="contained" 
            size="large" 
            startIcon={<AddIcon />}
            onClick={() => { setEditCategory(null); setOpenForm(true); }}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 2,
              fontWeight: 600,
              background: 'linear-gradient(90deg, #2563eb, #3b82f6)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(90deg, #1d4ed8, #2563eb)',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }
            }}
          >
            {isAr ? "إضافة فئة جديدة" : "Add New Category"}
          </Button>
        </Stack>
        
        <Box mt={3} display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="body1" color="text.secondary">
            {isAr ? "إجمالي الفئات:" : "Total categories:"}{" "}
            <Box component="span" fontWeight={700} color="primary.main">
              {localCategories.length}
            </Box>
          </Typography>
        </Box>
      </Paper>

      {/* Categories Grid */}
      {localCategories.length === 0 ? (
        <Box textAlign="center" py={10}>
          <CategoryIcon sx={{ fontSize: 64, color: theme.palette.grey[400], mb: 2 }} />
          <Typography variant="h6" color="text.secondary" mb={2}>
            {isAr ? "لا توجد فئات متاحة" : "No categories available"}
          </Typography>
          <Typography variant="body1" color="text.secondary" maxWidth={500} mx="auto">
            {isAr 
              ? "عندما تقوم بإضافة فئات جديدة، ستظهر هنا للعرض والإدارة." 
              : "When you add new categories, they will appear here for viewing and management."}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {localCategories.map((cat) => (
            <Grid size={{xs:12, sm:6, md: 4, lg:3}} key={cat.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                  <Box sx={{ 
                    height: 140, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mb: 2,
                    borderRadius: 2,
                    bgcolor: theme.palette.grey[100],
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    {cat.thumbnailUrl ? (
                      <Box
                        component="img"
                        src={cat.thumbnailUrl}
                        alt={isAr ? cat["name[ar]"] : cat["name[en]"]}
                        sx={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }}
                      />
                    ) : (
                      <CategoryIcon sx={{ fontSize: 64, color: theme.palette.grey[400] }} />
                    )}
                  </Box>
                  
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {isAr ? "الاسم (إنجليزي)" : "English Name"}
                    </Typography>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {cat["name[en]"]}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {isAr ? "الاسم (عربي)" : "Arabic Name"}
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {cat["name[ar]"]}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: 'flex-end' }}>
                  <IconButton 
                    aria-label="edit" 
                    onClick={() => { setEditCategory(cat); setOpenForm(true); }}
                    sx={{
                      bgcolor: `${theme.palette.primary.light}20`,
                      color: theme.palette.primary.main,
                      '&:hover': {
                        bgcolor: `${theme.palette.primary.light}30`,
                      }
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    aria-label="delete" 
                    color="error" 
                    onClick={() => { setDeleteCat(cat); setOpenDelete(true); }}
                    disabled={deletingId === cat.id}
                    sx={{
                      bgcolor: `${theme.palette.error.light}20`,
                      color: theme.palette.error.main,
                      '&:hover': {
                        bgcolor: `${theme.palette.error.light}30`,
                      },
                      '&:disabled': {
                        opacity: 0.6
                      }
                    }}
                  >
                    {deletingId === cat.id ? (
                      <CircularProgress size={20} color="error" />
                    ) : (
                      <DeleteIcon />
                    )}
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialogs */}
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
        onDelete={() => deleteCat && handleDelete(deleteCat.id)}
      />
    </Box>
  );
};

export default CategoryPage;