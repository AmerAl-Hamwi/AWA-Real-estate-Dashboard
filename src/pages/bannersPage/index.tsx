import React, { useState } from "react";
import { 
  Box, 
  Button, 
  Alert, 
  Typography, 
  Card, 
  CardHeader, 
  CardContent, 
  Avatar, 
  Grid,
  useTheme,
  Paper
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ImageIcon from '@mui/icons-material/Image';
import LoadingScreen from "@components/ui/loader/loadingScreen";
import EnhancedBannerTable from "./components/table/EnhanceTable";
import BannerDialog from "./components/modal/BannerDialog";
import { useBanners } from "@hooks/api/banner/useGetAllBanner";
import { useCreateBanner } from "@hooks/api/banner/useAddBanner";
import { useDeleteBanner } from "@hooks/api/banner/useDeleteBanner";
import { useUpdateBanner } from "@hooks/api/banner/useEditBanner";
import { FormattedBanner, BannerPayload } from "@/types/banner";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { Lightbox } from "react-modal-image";

const BannerPage: React.FC = () => {
  const theme = useTheme();
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const bannersState = useBanners();
  const {
    data: banners,
    total,
    page,
    limit,
    setPage,
    setLimit,
    loading,
    error,
    refetch,
    addOptimistic,
    updateOptimistic,
    deleteOptimistic,
    snapshot,
    setSnapshot,
  } = bannersState;

  const { createBanner, isLoading: adding } = useCreateBanner({
    addOptimistic,
    snapshot,
    setSnapshot,
    refetch,
  });

  const { updateBanner, isLoading: updating } = useUpdateBanner({
    updateOptimistic,
    snapshot,
    setSnapshot,
    refetch,
  });

  const { deleteBanner, loading: deleting } = useDeleteBanner(
    async (id: string) => {
      const snap = snapshot;
      deleteOptimistic(id);
      try {
        await refetch();
      } catch {
        setSnapshot(snap.data, snap.total);
      }
    }
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [initial, setInitial] = useState<BannerPayload | undefined>(undefined);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  const handleAddClick = () => {
    setInitial(undefined);
    setDialogOpen(true);
  };

  const handleEditClick = (id: string) => {
    const b = banners.find((x) => x.id === id);
    if (!b) return;
    setInitial({
      id: b.id,
      type: b.type === "image" ? "image" : "text",
      title: b.title,
      body: b.body,
    });
    setDialogOpen(true);
  };

  const handleViewImage = (url: string) => {
    setCurrentImage(url);
    setLightboxOpen(true);
  };

  const handleDialogSubmit = async (payload: BannerPayload) => {
    if (payload.id) {
      await updateBanner(payload.id, payload);
    } else {
      await createBanner(payload);
    }
    setDialogOpen(false);
  };

  if (loading) return <LoadingScreen />;
  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Card */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          boxShadow: theme.shadows[2],
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7f1 100%)',
          border: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <CardHeader
          title={
            <Typography variant="h5" fontWeight={700}>
              {isAr ? "إدارة البانرات" : "Banner Management"}
            </Typography>
          }
          subheader={
            <Typography variant="body2" color="text.secondary">
              {isAr ? "إدارة جميع البانرات في النظام" : "Manage all banners in the system"}
            </Typography>
          }
          avatar={
            <Avatar sx={{ 
              bgcolor: theme.palette.primary.main, 
              width: 56, 
              height: 56 
            }}>
              <ImageIcon />
            </Avatar>
          }
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddClick}
              sx={{
                color: "white",
                py: 1.4,
                px: 3,
                borderRadius: 2,
                fontWeight: 600,
                background: 'linear-gradient(90deg, #2563eb, #3b82f6)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #1d4ed8, #2563eb)',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                }
              }}
            >
              {isAr ? "إضافة بانر" : "Add Banner"}
            </Button>
          }
        />
        
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{xs:12, md:6}}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: '50%', 
                  bgcolor: theme.palette.primary.light,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.palette.primary.dark
                }}>
                  <ImageIcon />
                </Box>
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    {total} {isAr ? "بانر" : "Banners"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isAr ? "في النظام" : "in the system"}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Banner Table */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: theme.shadows[1],
          border: '1px solid rgba(0,0,0,0.05)',
          overflow: 'hidden',
        }}
      >
        <EnhancedBannerTable<FormattedBanner>
          columns={[
            {
              field: "imageUrl",
              label: isAr ? "الصورة" : "Image",
              minWidth: 150,
            },
            { field: "title", label: isAr ? "العنوان" : "Title", minWidth: 120 },
            { field: "body", label: isAr ? "المحتوى" : "Body", minWidth: 200 },
            { field: "type", label: isAr ? "النوع" : "Type", minWidth: 100 },
          ]}
          data={banners}
          count={total}
          page={page - 1}
          rowsPerPage={limit}
          onPageChange={(_, newPage) => setPage(newPage + 1)}
          onRowsPerPageChange={(e) => {
            setLimit(+e.target.value);
            setPage(1);
          }}
          rowKey="id"
          onEdit={handleEditClick}
          onDelete={deleteBanner}
          onViewImage={handleViewImage}
          deleting={deleting}
        />
      </Card>

      <BannerDialog
        open={dialogOpen}
        initial={initial}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleDialogSubmit}
        loading={adding || updating}
      />
      
      {lightboxOpen && currentImage && (
        <Lightbox
          large={currentImage}
          onClose={() => setLightboxOpen(false)}
          hideDownload={true}
          hideZoom={false}
        />
      )}
    </Box>
  );
};

export default BannerPage;