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

const BannerPage: React.FC = () => {
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
  } = useBanners();
  const { createBanner, error: createError } = useCreateBanner();
  const { updateBanner, isLoading: updating } = useUpdateBanner();
  const { deleteBanner, loading: deleting } = useDeleteBanner(() => refetch());

  const [dialogOpen, setDialogOpen] = useState(false);
  const [initial, setInitial] = useState<BannerPayload | undefined>(undefined);

  // open empty dialog for "Add"
  const handleAddClick = () => {
    setInitial(undefined);
    setDialogOpen(true);
  };

  // open with existing banner for "Edit"
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

  // both create & update funnel through here
  const handleDialogSubmit = async (payload: BannerPayload) => {
    try {
      if (payload.id) {
        // EDIT
        await updateBanner(payload.id, {
          type: payload.type,
          title: payload.title,
          body: payload.body,
          imageFile: payload.imageFile,
        });
      } else {
        // CREATE
        await createBanner({
          type: payload.type,
          title: payload.title,
          body: payload.body,
          imageFile: payload.imageFile,
        });
      }
      await refetch();
      setDialogOpen(false);
    } catch {
      // errors are shown via toaster
    }
  };

  if (loading) return <LoadingScreen />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 4, position: "relative" }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Banner Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          sx={{ color: "white"}}
        >
          Add Banner
        </Button>
      </Box>

      {createError && <Alert severity="error">{createError}</Alert>}

      <EnhancedBannerTable<FormattedBanner>
        columns={[
          { field: "imageUrl", label: "Image", minWidth: 150 },
          { field: "title", label: "Title", minWidth: 120 },
          { field: "body", label: "Body", minWidth: 200 },
          { field: "type", label: "Type", minWidth: 100 },
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
        loading={updating}
      />
    </Box>
  );
};

export default BannerPage;
