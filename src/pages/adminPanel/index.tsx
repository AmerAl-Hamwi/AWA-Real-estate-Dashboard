import React, { useState } from "react";
import { Box, Divider, Alert } from "@mui/material";
import LoadingScreen from "@components/ui/loader/loadingScreen";
import { Order } from "@components/ui/table/TableLayouts";
import EnhancedPropertyTable from "./components/table/EnhanceTable";
import { useAds } from "@hooks/api/ads/useAds";
import { useRequiredEstate } from "@hooks/api/ads/useRequiredEstate";
import { useAdActions } from "@/hooks/api/ads/useAdActions";
import { Ad, AdRequire } from "@/types/property";
import {
  getSaleColumns,
  getRentColumns,
  getRequireColumns,
} from "./components/data/column";
import SectionHeader from "./components/common/SectionHeader";
import { useLanguage } from "@/contexts/language/LanguageContext";

const AdminPannel: React.FC = () => {
  const { lang } = useLanguage();
  const [salePageLocal, setSalePageLocal] = useState(0);
  const [saleRowsLocal, setSaleRowsLocal] = useState(5);

  const [rentPageLocal, setRentPageLocal] = useState(0);
  const [rentRowsLocal, setRentRowsLocal] = useState(5);

  const [reqPageLocal, setReqPageLocal] = useState(0);
  const [reqRowsLocal, setReqRowsLocal] = useState(5);

  const {
    ads,
    loading: saleLoading,
    error: saleError,
    refetch,
  } = useAds(1, 1000); // was (1, 5)

  const {
    ads: requireAdsRaw,
    loading: requireLoading,
    error: requireError,
  } = useRequiredEstate(1, 1000); // was (1, 5)

  // 3) Local sorting state (client-side)
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Ad>("type");

  // 4) Hook that handles approve/reject calls + tracks in-flight/completed IDs
  const { approveAd, rejectAd, processingIds, completedIds } = useAdActions();
  const {
    approveAd: approveRequireAd,
    rejectAd: rejectRequireAd,
    processingIds: requireProcessingIds,
    completedIds: requireCompletedIds,
  } = useAdActions({ isRequire: true });

  const handleRequestSort = (field: keyof Ad) => {
    const isAsc = orderBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(field);
    // Client-side sort of current page
    ads.sort((a, b) => {
      const va = a[field];
      const vb = b[field];
      if (typeof va === "number" && typeof vb === "number") {
        return (va - vb) * (isAsc ? 1 : -1);
      }
      return (String(va) < String(vb) ? -1 : 1) * (isAsc ? 1 : -1);
    });
  };

  // 6) Approve / Reject wrappers that call our hook, then refetch on success
  const onAccept = async (id: string) => {
    try {
      await approveAd(id);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };
  const onReject = async (id: string) => {
    try {
      await rejectAd(id);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  // 7) Filter only those with TypeAccepte === "wait", then split by type
  const pendingAds = ads.filter((a) => a.TypeAccepte === "wait");
  const salePending = pendingAds.filter((a) => a.type === "Sale");
  const rentPending = pendingAds.filter((a) => a.type === "Rent");

  const requirePending = requireAdsRaw.filter((a) => a.TypeAccepte === "wait");

  // helper
  const paginate = <T,>(arr: T[], page: number, rows: number) =>
    arr.slice(page * rows, page * rows + rows);

  // slices
  const saleSlice = paginate(salePending, salePageLocal, saleRowsLocal);
  const rentSlice = paginate(rentPending, rentPageLocal, rentRowsLocal);
  const reqSlice = paginate(requirePending, reqPageLocal, reqRowsLocal);

  if (saleLoading || requireLoading) return <LoadingScreen />;
  if (saleError) return <Alert severity="error">{saleError.message}</Alert>;
  if (requireError)
    return <Alert severity="error">{requireError.message}</Alert>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, pb: 4 }}>
      <>
        {/* —— Sale Ads Section —— */}
        <SectionHeader
          titleEn="Pending Sale Listings"
          titleAr="قائمة المبيعات المعلقة"
          count={salePending.length}
        />

        <EnhancedPropertyTable
          columns={getSaleColumns(lang)}
          data={saleSlice} // sliced pending
          count={salePending.length} // total pending (not total from API)
          page={salePageLocal} // local page (zero-based)
          rowsPerPage={saleRowsLocal}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          onPageChange={(_, p) => setSalePageLocal(p)}
          onRowsPerPageChange={(e) => {
            setSaleRowsLocal(+e.target.value);
            setSalePageLocal(0);
          }}
          onAccept={onAccept}
          onReject={onReject}
          processingIds={processingIds}
          completedIds={completedIds}
          loading={false}
          error={null}
        />

        <Divider sx={{ my: 1 }} />

        {/* Rent */}
        <SectionHeader
          titleEn="Pending Rental Listings"
          titleAr="قائمة الإيجارات المعلقة"
          count={rentPending.length}
        />

        <EnhancedPropertyTable
          columns={getRentColumns(lang)}
          data={rentSlice}
          count={rentPending.length}
          page={rentPageLocal}
          rowsPerPage={rentRowsLocal}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          onPageChange={(_, p) => setRentPageLocal(p)}
          onRowsPerPageChange={(e) => {
            setRentRowsLocal(+e.target.value);
            setRentPageLocal(0);
          }}
          onAccept={onAccept}
          onReject={onReject}
          processingIds={processingIds}
          completedIds={completedIds}
          loading={false}
          error={null}
        />

        <Divider sx={{ my: 1 }} />

        {/* —— Require Ads Section —— */}
        <SectionHeader
          titleEn="Pending Require Listings"
          titleAr="قائمة الطلبات المعلقة"
          count={requirePending.length}
        />

        <EnhancedPropertyTable
          columns={getRequireColumns(lang)}
          data={reqSlice}
          count={requirePending.length}
          page={reqPageLocal}
          rowsPerPage={reqRowsLocal}
          order={order}
          orderBy={orderBy as keyof AdRequire}
          onRequestSort={handleRequestSort as (f: keyof AdRequire) => void}
          onPageChange={(_, p) => setReqPageLocal(p)}
          onRowsPerPageChange={(e) => {
            setReqRowsLocal(+e.target.value);
            setReqPageLocal(0);
          }}
          onAccept={approveRequireAd}
          onReject={rejectRequireAd}
          processingIds={requireProcessingIds}
          completedIds={requireCompletedIds}
          loading={requireLoading}
          error={requireError?.message}
          showViewButton={false}
        />
      </>
    </Box>
  );
};

export default AdminPannel;
