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
  // const isRtl = lang === "ar";

  // 1) Fetch all ads, paginated
  const {
    ads,
    pages: salePages,
    currentPage: saleCurrentPage,
    limit: saleLimit,
    loading: saleLoading,
    error: saleError,
    setPage: setSalePage,
    setLimit: setSaleLimit,
    refetch,
  } = useAds(1, 5);

  // 2) Fetch required estate ads, paginated
  const {
    ads: requireAdsRaw,
    pages: requirePages,
    currentPage: requireCurrentPage,
    limit: requireLimit,
    loading: requireLoading,
    error: requireError,
  } = useRequiredEstate(1, 5);

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

  // 5) Pagination callbacks
  const handlePageChange = (_: unknown, newPageZeroBased: number) => {
    setSalePage(newPageZeroBased + 1);
  };
  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaleLimit(+e.target.value);
    setSalePage(1);
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
  const pendingAds = ads.filter((ad) => ad.TypeAccepte === "wait");
  const saleAds = pendingAds.filter((ad) => ad.type === "Sale");
  const rentAds = pendingAds.filter((ad) => ad.type === "Rent");
  const requireAds = requireAdsRaw.filter((ad) => ad.TypeAccepte === "wait");

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
          count={saleAds.length}
        />

        <EnhancedPropertyTable
          columns={getSaleColumns(lang)}
          data={saleAds}
          count={saleAds.length}
          page={saleCurrentPage - 1}
          rowsPerPage={saleLimit}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onAccept={onAccept}
          onReject={onReject}
          processingIds={processingIds}
          completedIds={completedIds}
          loading={false}
          error={null}
          totalPages={salePages}
        />

        <Divider sx={{ my: 1 }} />

        {/* Rent */}
        <SectionHeader
          titleEn="Pending Rental Listings"
          titleAr="قائمة الإيجارات المعلقة"
          count={rentAds.length}
        />

        <EnhancedPropertyTable
          columns={getRentColumns(lang)}
          data={rentAds}
          count={rentAds.length}
          page={saleCurrentPage - 1}
          rowsPerPage={saleLimit}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onAccept={onAccept}
          onReject={onReject}
          processingIds={processingIds}
          completedIds={completedIds}
          loading={false}
          error={null}
          totalPages={salePages}
        />

        <Divider sx={{ my: 1 }} />

        {/* —— Require Ads Section —— */}
        <SectionHeader
          titleEn="Pending Require Listings"
          titleAr="قائمة الطلبات المعلقة"
          count={requireAds.length}
        />

        <EnhancedPropertyTable
          columns={getRequireColumns(lang)}
          data={requireAds}
          count={requireAds.length}
          page={requireCurrentPage - 1}
          rowsPerPage={requireLimit}
          order={order}
          orderBy={orderBy as keyof AdRequire}
          onRequestSort={handleRequestSort as (field: keyof AdRequire) => void}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onAccept={approveRequireAd}
          onReject={rejectRequireAd}
          processingIds={requireProcessingIds}
          completedIds={requireCompletedIds}
          loading={requireLoading}
          error={requireError?.message}
          totalPages={requirePages}
          showViewButton={false}
        />
      </>
    </Box>
  );
};

export default AdminPannel;
