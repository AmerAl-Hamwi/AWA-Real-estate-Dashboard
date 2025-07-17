import React, { useState } from "react";
import EnhancedExternalAdsTable from "./components/table/enhancedExternalAdsTable";
import { Column, Order } from "@components/ui/table/TableLayouts";
import { ExternalAd } from "@/types/externalAd";
import { dummyAds } from "./data/adsData";

const columns: Column<ExternalAd>[] = [
  { field: "entityName", label: "Name", minWidth: 150 },
  { field: "entityType", label: "Type", minWidth: 120 },
  { field: "subscriptionDate", label: "Subscribed On", minWidth: 160 },
  { field: "adStart", label: "Start Date/Time", minWidth: 160 },
  { field: "adEnd", label: "End Date/Time", minWidth: 160 },
  { field: "status", label: "Status", minWidth: 100 },
];

const ExternalAdsPage: React.FC = () => {
  const [data] = useState<ExternalAd[]>(dummyAds);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof ExternalAd>("entityName");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (field: keyof ExternalAd) => {
    const isAsc = orderBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(field);
  };

  return (
    <EnhancedExternalAdsTable
      columns={columns}
      data={data}
      count={data.length}
      page={page}
      rowsPerPage={rowsPerPage}
      order={order}
      orderBy={orderBy}
      onRequestSort={handleRequestSort}
      onPageChange={(_, p) => setPage(p)}
      onRowsPerPageChange={(e) => {
        setRowsPerPage(+e.target.value);
        setPage(0);
      }}
    />
  );
};

export default ExternalAdsPage;
