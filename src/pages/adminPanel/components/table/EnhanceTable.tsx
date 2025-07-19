import React, { useState } from "react";
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
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
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
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  processingIds: Set<string>;
  completedIds: Set<string>;
  loading?: boolean;
  error?: string | null;
  totalPages?: number;
  showViewButton?: boolean;
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
  onAccept,
  onReject,
  processingIds,
  completedIds,
  loading = false,
  error = null,
  showViewButton = true,
}: EnhancedPropertyTableProps<T>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

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
        showActions={true}
      >
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                sx={{ py: 8, textAlign: "center", color: "text.secondary" }}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  gap={1}
                >
                  <InfoOutlinedIcon fontSize="large" color="disabled" />
                  <Typography variant="subtitle1" color="text.secondary">
                    No records to display
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => {
              const isProcessing = processingIds.has(row.id);
              const isCompleted = completedIds.has(row.id);

              return (
                <TableRow
                  hover
                  key={row.id}
                  sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                >
                  {columns.map((col) => {
                    const val = row[col.field];

                    // Description field
                    if (
                      (col.field === "description[en]" ||
                        col.field === "description[ar]") &&
                      typeof val === "string"
                    ) {
                      const text = val;
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

                    // Amenities
                    if (col.field === "menities" && Array.isArray(val)) {
                      return (
                        <TableCell key="amenities" sx={{ p: 1 }}>
                          <Box display="flex" flexWrap="wrap" gap={0.5}>
                            {val.map((m: string) => (
                              <Chip key={m} label={m} size="small" />
                            ))}
                          </Box>
                        </TableCell>
                      );
                    }

                    if (
                      col.field === "province" &&
                      typeof val === "object" &&
                      val !== null &&
                      "name" in val
                    ) {
                      const provinceName = (
                        val as { name: { en: string; ar: string } }
                      ).name;
                      return (
                        <TableCell
                          key={String(col.field)}
                          align="left"
                          sx={{ p: 1 }}
                        >
                          <Tooltip
                            title={`${provinceName.ar} / ${provinceName.en}`}
                          >
                            <Typography noWrap sx={{ maxWidth: 200 }}>
                              {`${provinceName.ar} / ${provinceName.en}`}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                      );
                    }

                    // Rental periods
                    if (col.field === "rentalPeriods" && Array.isArray(val)) {
                      return (
                        <TableCell key="rentalPeriods" sx={{ p: 1 }}>
                          <Box display="flex" flexDirection="column" gap={0.5}>
                            {(val as RentalPeriod[]).map((rp) => (
                              <Chip
                                key={rp._id}
                                label={`${rp.period}: ${rp.priceSYP}/SYP, ${rp.priceUSD}/USD`}
                                size="small"
                              />
                            ))}
                          </Box>
                        </TableCell>
                      );
                    }

                    // Images
                    if (col.field === "images" && Array.isArray(val)) {
                      const first = val[0];
                      return (
                        <TableCell key="images" sx={{ p: 1 }}>
                          {first ? (
                            <Avatar
                              src={first}
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

                  {/* Actions */}
                  <TableCell align="center" sx={{ whiteSpace: "nowrap", p: 1 }}>
                    <Button
                      startIcon={
                        isProcessing ? (
                          <CircularProgress color="inherit" size={16} />
                        ) : (
                          <CheckIcon />
                        )
                      }
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => onAccept(row.id)}
                      disabled={isProcessing || isCompleted}
                      sx={{
                        mr: 1,
                        textTransform: "none",
                        borderRadius: 2,
                        px: 1.5,
                      }}
                    >
                      {isCompleted ? "Approved" : "Approve"}
                    </Button>

                    <Button
                      startIcon={
                        isProcessing ? (
                          <CircularProgress color="inherit" size={16} />
                        ) : (
                          <CloseIcon />
                        )
                      }
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => onReject(row.id)}
                      disabled={isProcessing || isCompleted}
                      sx={{
                        mr: 1,
                        textTransform: "none",
                        borderRadius: 2,
                        px: 1.5,
                      }}
                    >
                      {isCompleted ? "Rejected" : "Reject"}
                    </Button>
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
                  </TableCell>
                </TableRow>
              );
            })
          )}
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
