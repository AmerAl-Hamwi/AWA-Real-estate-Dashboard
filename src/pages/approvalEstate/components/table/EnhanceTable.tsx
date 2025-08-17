import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Box,
  CircularProgress,
  Typography,
  Tooltip,
  Avatar,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDeleteAd } from "@hooks/api/ads/useDeleteAd";
import TableLayout, { Column, Order } from "@components/ui/table/TableLayouts";
import { RentalPeriod } from "@/types/property";
import PropertyImageDialog from "../modal/PropertyImageDialog";

type WithId = { id: string };

export interface EnhancedPropertyTableProps<T extends WithId> {
  columns: Column<T>[];
  data: T[];
  count: number;
  page: number;
  rowsPerPage: number;
  order: Order;
  orderBy?: keyof T;
  onRequestSort: (field: keyof T) => void;
  onPageChange: (_: unknown, page: number) => void;
  onRowsPerPageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  refetch: () => void;
  loading?: boolean;
  error?: string | null;
  totalPages?: number;
  showViewButton?: boolean;
  showActions?: boolean;
}

const EnhancedPropertyTable = <T extends WithId>({
  columns,
  data,
  count,
  page,
  rowsPerPage,
  order,
  orderBy,
  onRequestSort,
  onPageChange,
  onRowsPerPageChange,
  refetch,
  loading = false,
  error = null,
  showViewButton = true,
  showActions = true,
}: EnhancedPropertyTableProps<T>) => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const { deleteAd } = useDeleteAd(refetch);

  const handleViewClick = (p) => {
    if (Array.isArray(p.images)) {
      const urls = p.images.map((img) =>
        typeof img === "string" ? img : img.url
      );
      setSelectedImages(urls);
      setActiveIndex(0);
      setDialogOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAd(id);
    } catch (err) {
      alert("Failed to delete ad." + err);
    }
  };

  const formatNumber = (value: unknown) => {
    const n = typeof value === "string" ? Number(value) : (value as number);
    if (Number.isNaN(n) || n == null) return "—";
    // en-US gives you 1,234,567 style commas
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(
      n
    );
  };

  // Show spinner / error if necessary
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="200px"
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="200px"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <TableLayout<T>
        columns={columns}
        count={count}
        order={order}
        orderBy={orderBy}
        page={page}
        rowsPerPage={rowsPerPage}
        onRequestSort={onRequestSort}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        showActions={showActions}
      >
        <TableBody>
          {data.map((row) => {
            console.log(row);
            return (
              <TableRow
                hover
                key={row.id}
                sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
              >
                {columns.map((col) => {
                  const val = row[col.field];

                  // 1) If “description[en]” or “description[ar]”, truncate with Tooltip
                  if (
                    (col.field === "description[en]" ||
                      col.field === "description[ar]") &&
                    typeof val === "string"
                  ) {
                    const text = val as string;
                    const truncated =
                      text.length > 30 ? text.slice(0, 30) + "…" : text;
                    return (
                      <TableCell
                        key={String(col.field)}
                        align="left"
                        sx={{ p: 1 }}
                      >
                        <Tooltip title={text}>
                          <Typography noWrap sx={{ maxWidth: 200 }}>
                            {truncated}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                    );
                  }

                  if (
                    col.field === "province" &&
                    val != null &&
                    typeof val === "object" &&
                    "name" in val &&
                    typeof val.name === "object"
                  ) {
                    // only assert to the small shape we care about:
                    const { name } = val as unknown as {
                      name: { en: string; ar: string };
                    };
                    const label = `${name.en} / ${name.ar}`;

                    return (
                      <TableCell key="province" align="left" sx={{ p: 1 }}>
                        <Tooltip title={label}>
                          <Typography noWrap sx={{ maxWidth: 200 }}>
                            {label}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                    );
                  }

                  // 2) If “menities”, render chips
                  if (col.field === "Amenities" && Array.isArray(val)) {
                    return (
                      <TableCell key="amenities" sx={{ p: 1 }}>
                        <Box display="flex" flexWrap="wrap" gap={0.5}>
                          {(val as string[]).map((m) => (
                            <Chip key={m} label={m} size="small" />
                          ))}
                        </Box>
                      </TableCell>
                    );
                  }

                  // 3) If “rentalPeriods”, render each as a Chip
                  if (col.field === "rentalPeriods" && Array.isArray(val)) {
                    const periods = val as RentalPeriod[];
                    return (
                      <TableCell key="rentalPeriods" sx={{ p: 1 }}>
                        <Box display="flex" flexDirection="column" gap={0.5}>
                          {periods.map((rp) => (
                            <Chip
                              key={rp._id}
                              label={`${rp.period}: ${rp.priceSYP.toLocaleString()}/SYP, ${rp.priceUSD.toLocaleString()}/USD`}
                              size="small"
                              sx={{ mb: 0.5 }}
                            />
                          ))}
                        </Box>
                      </TableCell>
                    );
                  }

                  if (
                    col.field === "priceSYP" ||
                    col.field === "priceUSD" ||
                    col.field === "Minprice" ||
                    col.field === "Maxprice" 

                  ) {
                    return (
                      <TableCell
                        key={String(col.field)}
                        align="left"
                        sx={{ p: 1 }}
                      >
                        {formatNumber(val)}
                      </TableCell>
                    );
                  }

                  // 4) If “images”, show first thumbnail
                  if (col.field === "images" && Array.isArray(val)) {
                    const urls = val as string[];
                    const firstUrl = urls.length > 0 ? urls[0] : null;
                    return (
                      <TableCell key="images" sx={{ p: 1 }}>
                        {firstUrl ? (
                          <Avatar
                            src={firstUrl}
                            variant="rounded"
                            sx={{
                              width: 60,
                              height: 40,
                              objectFit: "cover",
                              cursor: "pointer",
                            }}
                            onClick={() => handleViewClick(row)}
                          />
                        ) : (
                          <Typography noWrap>—</Typography>
                        )}
                      </TableCell>
                    );
                  }

                  if (
                    val != null &&
                    typeof val === "object" &&
                    "en" in val &&
                    "ar" in val
                  ) {
                    const { en, ar } = val as { en: string; ar: string };
                    const label = `${en} / ${ar}`;
                    return (
                      <TableCell
                        key={String(col.field)}
                        align="left"
                        sx={{ p: 1 }}
                      >
                        <Tooltip title={label}>
                          <Typography noWrap sx={{ maxWidth: 200 }}>
                            {label}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                    );
                  }

                  // 5) Everything else → normal value
                  return (
                    <TableCell
                      key={String(col.field)}
                      align="left"
                      sx={{ p: 1 }}
                    >
                      {val == null ? "—" : String(val)}
                    </TableCell>
                  );
                })}

                {/* ACTIONS COLUMN */}
                <TableCell align="center" sx={{ whiteSpace: "nowrap", p: 1 }}>
                  {showViewButton && (
                    <Button
                      startIcon={<EditIcon />}
                      size="small"
                      variant="outlined"
                      color="primary"
                      sx={{
                        mr: 1,
                        textTransform: "none",
                        borderRadius: 2,
                        px: 1.5,
                        borderColor: "primary.main",
                        color: "primary.main",
                        fontWeight: 500,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "primary.main",
                          color: "#fff",
                          borderColor: "primary.dark",
                        },
                      }}
                      onClick={() =>
                        navigate(`/admin-panel/edit/${row.id}`, {
                          state: { ad: row },
                        })
                      }
                    >
                      Edit
                    </Button>
                  )}
                  {showViewButton && (
                    <Button
                      startIcon={<VisibilityIcon />}
                      size="small"
                      variant="outlined"
                      onClick={() => handleViewClick(row)}
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        px: 1.5,
                        borderColor: "#1976d2",
                        color: "#1976d2",
                        fontWeight: 500,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "#1976d2",
                          color: "#fff",
                          borderColor: "#115293",
                        },
                      }}
                    >
                      View
                    </Button>
                  )}
                  {showViewButton && (
                    <Button
                      startIcon={<DeleteIcon />}
                      size="small"
                      variant="outlined"
                      color="error"
                      sx={{
                        ml: 1,
                        textTransform: "none",
                        borderRadius: 2,
                        px: 1.5,
                        fontWeight: 500,
                      }}
                      onClick={() => handleDelete(row.id)}
                    >
                      Delete
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </TableLayout>

      <PropertyImageDialog
        open={dialogOpen}
        images={selectedImages}
        activeIndex={activeIndex}
        onClose={() => setDialogOpen(false)}
        onThumbnailClick={setActiveIndex}
      />
    </>
  );
};

export default EnhancedPropertyTable;
