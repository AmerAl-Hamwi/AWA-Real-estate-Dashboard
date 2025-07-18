import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import {
  Box,
  Divider,
  Alert,
  Button,
  Menu,
  MenuItem,
  // Fab,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
// import AddIcon from "@mui/icons-material/Add";
import LoadingScreen from "@components/ui/loader/loadingScreen";
import { Order } from "@components/ui/table/TableLayouts";
import EnhancedPropertyTable from "./components/table/EnhanceTable";
import { useRequiredEstate } from "@hooks/api/ads/useRequiredEstate";
import { useAds } from "@hooks/api/ads/useAds";
import { Ad, AdRequire } from "@/types/property";
import {
  saleColumns as saleDefs,
  rentColumns as rentDefs,
  requireColumns as requireDefs,
} from "./components/data/column";
import LocalizedSectionHeader from "./components/common/LocalizedSectionHeader";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { useLocalizedColumns } from "@/utils/localizeColumns";

const ApprovalEstate: React.FC = () => {
  const { lang } = useLanguage();
  const saleColumns = useLocalizedColumns(saleDefs);
  const rentColumns = useLocalizedColumns(rentDefs);
  const requireCols = useLocalizedColumns(requireDefs);
  // const navigate = useNavigate();
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [adTypeFilter, setAdTypeFilter] = useState<
    "All" | "Regular" | "Premium"
  >("All");
  const {
    ads,
    refetch,
    pages,
    currentPage,
    limit,
    loading,
    error,
    setPage,
    setLimit,
  } = useAds(1, 5);

  const {
    ads: requireAdsRaw,
    pages: requirePages,
    currentPage: requireCurrentPage,
    limit: requireLimit,
    loading: requireLoading,
    error: requireError,
  } = useRequiredEstate(1, 5);

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Ad>("type");

  const handleRequestSort = (field: keyof Ad) => {
    const isAsc = orderBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(field);
    ads.sort((a, b) => {
      const va = a[field];
      const vb = b[field];
      if (typeof va === "number" && typeof vb === "number") {
        return (va - vb) * (isAsc ? 1 : -1);
      }
      return (String(va) < String(vb) ? -1 : 1) * (isAsc ? 1 : -1);
    });
  };

  const handlePageChange = (_: unknown, newPageZeroBased: number) => {
    setPage(newPageZeroBased + 1);
  };
  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(+e.target.value);
    setPage(1);
  };

  const pendingAds = ads.filter((ad) => ad.TypeAccepte === "approved");
  const saleAds = pendingAds.filter((ad) => ad.type === "Sale");
  const rentAds = pendingAds.filter((ad) => ad.type === "Rent");
  const requireAds = requireAdsRaw.filter(
    (ad) => ad.TypeAccepte === "approved"
  );

  const filteredSaleAds = saleAds.filter(
    (ad) => adTypeFilter === "All" || ad.adType === adTypeFilter
  );
  const filteredRentAds = rentAds.filter(
    (ad) => adTypeFilter === "All" || ad.adType === adTypeFilter
  );

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  const handleFilterChange = (type: "All" | "Regular" | "Premium") => {
    setAdTypeFilter(type);
    handleFilterClose();
  };

  if (loading || requireLoading) return <LoadingScreen />;
  if (error) return <Alert severity="error">{error.message}</Alert>;
  if (requireError)
    return <Alert severity="error">{requireError.message}</Alert>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, pb: 4 }}>
      {/* —— Sale Ads Section —— */}
      <LocalizedSectionHeader
        titleEn="Approved Sale Listings"
        titleAr="قائمة المبيعات الموافق عليها"
        countTextEn="properties after publication"
        countTextAr="عقار بعد النشر"
        count={saleAds.length}
        showFilterButton={
          <>
            <Button
              variant="outlined"
              startIcon={<FilterAltIcon />}
              onClick={handleFilterClick}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                fontWeight: 500,
                borderColor: "primary.main",
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "white",
                },
              }}
            >
              {lang === "ar" ? "الفلترة" : "Filter"}
            </Button>
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
            >
              <MenuItem onClick={() => handleFilterChange("All")}>All</MenuItem>
              <MenuItem onClick={() => handleFilterChange("Regular")}>
                Regular
              </MenuItem>
              <MenuItem onClick={() => handleFilterChange("Premium")}>
                Premium
              </MenuItem>
            </Menu>
          </>
        }
      />
      <EnhancedPropertyTable
        columns={saleColumns}
        data={filteredSaleAds}
        count={saleAds.length}
        page={currentPage - 1}
        rowsPerPage={limit}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        refetch={refetch}
        totalPages={pages}
        loading={false}
        error={null}
      />

      <Divider sx={{ my: 1 }} />

      {/* —— Rent Ads Section —— */}
      <LocalizedSectionHeader
        titleEn="Approved Rent Listings"
        titleAr="قائمة الإيجارات الموافق عليها"
        countTextEn="properties after publication"
        countTextAr="عقار بعد النشر"
        count={rentAds.length}
        showFilterButton={
          <>
            <Button
              variant="outlined"
              startIcon={<FilterAltIcon />}
              onClick={handleFilterClick}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                fontWeight: 500,
                borderColor: "primary.main",
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "white",
                },
              }}
            >
              {lang === "ar" ? "الفلترة" : "Filter"}
            </Button>
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
            >
              <MenuItem onClick={() => handleFilterChange("All")}>All</MenuItem>
              <MenuItem onClick={() => handleFilterChange("Regular")}>
                Regular
              </MenuItem>
              <MenuItem onClick={() => handleFilterChange("Premium")}>
                Premium
              </MenuItem>
            </Menu>
          </>
        }
      />

      <EnhancedPropertyTable
        columns={rentColumns}
        data={filteredRentAds}
        count={rentAds.length}
        page={currentPage - 1}
        rowsPerPage={limit}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        refetch={refetch}
        totalPages={pages}
        loading={false}
        error={null}
      />

      <Divider sx={{ my: 1 }} />

      {/* —— Require Ads Section —— */}
      <LocalizedSectionHeader
        titleEn="Approved Require Listings"
        titleAr="قائمة الطلبات الموافق عليها"
        countTextEn="requirements after publication"
        countTextAr="طلبات بعد النشر"
        count={requireAds.length}
      />
      <EnhancedPropertyTable
        columns={requireCols}
        data={requireAds}
        count={requireAds.length}
        page={requireCurrentPage - 1}
        rowsPerPage={requireLimit}
        order={order}
        orderBy={orderBy as keyof AdRequire}
        onRequestSort={handleRequestSort as (field: keyof AdRequire) => void}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        refetch={refetch}
        loading={requireLoading}
        error={requireError?.message}
        totalPages={requirePages}
        showViewButton={false}
      />

      {/* <Fab
        color="primary"
        aria-label="add new estate"
        onClick={() => navigate("/admin-panel/add-new-estate")}
        sx={{
          position: "fixed",
          bottom: (theme) => theme.spacing(4),
          right: (theme) => theme.spacing(4),
          zIndex: 2000,
        }}
      >
        <AddIcon style={{color: "white"}}/>
      </Fab> */}
    </Box>
  );
};

export default ApprovalEstate;
