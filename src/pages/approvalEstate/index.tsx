/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import {
  Box,
  Divider,
  Alert,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
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

type AdTypeFilter = "All" | "Regular" | "Premium";

// small helpers
const slice = <T,>(arr: T[], page: number, rows: number) =>
  arr.slice(page * rows, page * rows + rows);

function sortStable<T, K extends keyof T>(
  arr: T[],
  key: K,
  dir: Order
): T[] {
  const cmp = (a: T, b: T) => {
    const va = a[key] as any;
    const vb = b[key] as any;
    const base =
      typeof va === "number" && typeof vb === "number"
        ? va - vb
        : String(va ?? "").localeCompare(String(vb ?? ""));
    return dir === "asc" ? base : -base;
  };
  // stable copy sort
  return [...arr].sort(cmp);
}

const ApprovalEstate: React.FC = () => {
  const { lang } = useLanguage();
  const saleColumns = useLocalizedColumns(saleDefs);
  const rentColumns = useLocalizedColumns(rentDefs);
  const requireCols = useLocalizedColumns(requireDefs);

  // Ask the server for a *large* page one time to allow local pagination.
  // (No changes to hooks/interfaces.)
  const {
    ads,
    refetch,
    loading,
    error,
  } = useAds(1, 1000);

  const {
    ads: requireAdsRaw,
    loading: requireLoading,
    error: requireError,
  } = useRequiredEstate(1, 1000);

  // Sorting state (client-side for shown data)
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Ad>("type");

  // Local (virtual) pagination per section
  const [salePage, setSalePage] = useState(0);
  const [saleRows, setSaleRows] = useState(5);

  const [rentPage, setRentPage] = useState(0);
  const [rentRows, setRentRows] = useState(5);

  const [reqPage, setReqPage] = useState(0);
  const [reqRows, setReqRows] = useState(5);

  // Optional adType filter
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [adTypeFilter, setAdTypeFilter] = useState<AdTypeFilter>("All");
  const openFilter = Boolean(filterAnchorEl);

  const handleFilterClick = (e: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(e.currentTarget);
  };
  const handleFilterClose = () => setFilterAnchorEl(null);
  const handleFilterChange = (type: AdTypeFilter) => {
    setAdTypeFilter(type);
    setFilterAnchorEl(null);
    // reset local pagers so users see page 1 after changing filter
    setSalePage(0);
    setRentPage(0);
  };

  const handleRequestSort = (field: keyof Ad) => {
    const isAsc = orderBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(field);
    // No mutation here; sorting is done in useMemo below.
  };

  // ---------- Build approved datasets ----------
  const saleApproved = useMemo(() => {
    const approved = ads.filter(a => a.TypeAccepte === "approved");
    const onlySale = approved.filter(a => a.type === "Sale");
    const filtered =
      adTypeFilter === "All"
        ? onlySale
        : onlySale.filter(a => a.adType === adTypeFilter);
    return sortStable(filtered, orderBy, order);
  }, [ads, adTypeFilter, orderBy, order]);

  const rentApproved = useMemo(() => {
    const approved = ads.filter(a => a.TypeAccepte === "approved");
    const onlyRent = approved.filter(a => a.type === "Rent");
    const filtered =
      adTypeFilter === "All"
        ? onlyRent
        : onlyRent.filter(a => a.adType === adTypeFilter);
    return sortStable(filtered, orderBy, order);
  }, [ads, adTypeFilter, orderBy, order]);

  const requireApproved = useMemo(() => {
    const approved = requireAdsRaw.filter(a => a.TypeAccepte === "approved");
    // Sort by the same field if it exists on AdRequire; fallback to "type"
    const key = (orderBy as keyof AdRequire) ?? ("type" as keyof AdRequire);
    return sortStable(approved as unknown as AdRequire[], key, order);
  }, [requireAdsRaw, orderBy, order]);

  // ---------- Slice for current local pages ----------
  const salePageData = useMemo(
    () => slice(saleApproved, salePage, saleRows),
    [saleApproved, salePage, saleRows]
  );

  const rentPageData = useMemo(
    () => slice(rentApproved, rentPage, rentRows),
    [rentApproved, rentPage, rentRows]
  );

  const reqPageData = useMemo(
    () => slice(requireApproved, reqPage, reqRows),
    [requireApproved, reqPage, reqRows]
  );

  if (loading || requireLoading) return <LoadingScreen />;
  if (error) return <Alert severity="error">{error.message}</Alert>;
  if (requireError)
    return <Alert severity="error">{requireError.message}</Alert>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, pb: 4 }}>
      {/* —— Sale (Approved) —— */}
      <LocalizedSectionHeader
        titleEn="Approved Sale Listings"
        titleAr="قائمة المبيعات الموافق عليها"
        countTextEn="properties after publication"
        countTextAr="عقار بعد النشر"
        count={saleApproved.length}
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
            <Menu anchorEl={filterAnchorEl} open={openFilter} onClose={handleFilterClose}>
              <MenuItem onClick={() => handleFilterChange("All")}>All</MenuItem>
              <MenuItem onClick={() => handleFilterChange("Regular")}>Regular</MenuItem>
              <MenuItem onClick={() => handleFilterChange("Premium")}>Premium</MenuItem>
            </Menu>
          </>
        }
      />

      <EnhancedPropertyTable<Ad>
        columns={saleColumns}
        data={salePageData}
        count={saleApproved.length}     // ✅ only approved total
        page={salePage}                 // ✅ local page (zero-based)
        rowsPerPage={saleRows}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        onPageChange={(_, p) => setSalePage(p)}
        onRowsPerPageChange={(e) => {
          setSaleRows(+e.target.value);
          setSalePage(0);
        }}
        refetch={refetch}
        loading={false}
        error={null}
        // totalPages not needed for local pagination
      />

      <Divider sx={{ my: 1 }} />

      {/* —— Rent (Approved) —— */}
      <LocalizedSectionHeader
        titleEn="Approved Rent Listings"
        titleAr="قائمة الإيجارات الموافق عليها"
        countTextEn="properties after publication"
        countTextAr="عقار بعد النشر"
        count={rentApproved.length}
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
            <Menu anchorEl={filterAnchorEl} open={openFilter} onClose={handleFilterClose}>
              <MenuItem onClick={() => handleFilterChange("All")}>All</MenuItem>
              <MenuItem onClick={() => handleFilterChange("Regular")}>Regular</MenuItem>
              <MenuItem onClick={() => handleFilterChange("Premium")}>Premium</MenuItem>
            </Menu>
          </>
        }
      />

      <EnhancedPropertyTable<Ad>
        columns={rentColumns}
        data={rentPageData}
        count={rentApproved.length}     // ✅ only approved total
        page={rentPage}
        rowsPerPage={rentRows}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        onPageChange={(_, p) => setRentPage(p)}
        onRowsPerPageChange={(e) => {
          setRentRows(+e.target.value);
          setRentPage(0);
        }}
        refetch={refetch}
        loading={false}
        error={null}
      />

      <Divider sx={{ my: 1 }} />

      {/* —— Require (Approved) —— */}
      <LocalizedSectionHeader
        titleEn="Approved Require Listings"
        titleAr="قائمة الطلبات الموافق عليها"
        countTextEn="requirements after publication"
        countTextAr="طلبات بعد النشر"
        count={requireApproved.length}
      />

      <EnhancedPropertyTable<AdRequire>
        columns={requireCols}
        data={reqPageData}
        count={requireApproved.length}  // ✅ only approved total
        page={reqPage}
        rowsPerPage={reqRows}
        order={order}
        orderBy={(orderBy as keyof AdRequire) || ("type" as keyof AdRequire)}
        onRequestSort={(f: keyof AdRequire) => {
          // align with the same sort control
          setOrderBy(f as keyof Ad);
          setOrder(prev => (prev === "asc" ? "desc" : "asc"));
        }}
        onPageChange={(_, p) => setReqPage(p)}
        onRowsPerPageChange={(e) => {
          setReqRows(+e.target.value);
          setReqPage(0);
        }}
        refetch={refetch}
        loading={requireLoading}
        error={requireError?.message}
        showViewButton={false}
      />
    </Box>
  );
};

export default ApprovalEstate;
