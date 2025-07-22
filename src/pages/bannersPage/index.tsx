import React, { useState } from "react";
import { Box, Button, Alert, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LoadingScreen from "@components/ui/loader/loadingScreen";
import EnhancedBannerTable from "./components/table/EnhanceTable";
import BannerDialog from "./components/modal/BannerDialog";
import { useBanners } from "@hooks/api/banner/useGetAllBanner";
import { useCreateBanner } from "@hooks/api/banner/useAddBanner";
import { useDeleteBanner } from "@hooks/api/banner/useDeleteBanner";
import { useUpdateBanner } from "@hooks/api/banner/useEditBanner";
import { FormattedBanner, BannerPayload } from "@/types/banner";
import { useLanguage } from "@/contexts/language/LanguageContext";

const BannerPage: React.FC = () => {
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

  const handleDialogSubmit = async (payload: BannerPayload) => {
    if (payload.id) {
      await updateBanner(payload.id, payload);
    } else {
      await createBanner(payload);
    }
    setDialogOpen(false);
  };

  if (loading) return <LoadingScreen />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 4 }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4">
          {isAr ? "إدارة البانرات" : "Banner Management"}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          sx={{ color: "white" }}
        >
          {isAr ? "إضافة بانر" : "Add Banner"}
        </Button>
      </Box>

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
        deleting={deleting}
      />

      <BannerDialog
        open={dialogOpen}
        initial={initial}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleDialogSubmit}
        loading={adding || updating}
      />
    </Box>
  );
};

export default BannerPage;
