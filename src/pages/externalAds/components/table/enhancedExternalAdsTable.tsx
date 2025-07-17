import React, { useState } from "react";
import {
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TableLayout, { Column, Order } from "@components/ui/table/TableLayouts";
import { ExternalAd } from "@/types/externalAd";

export interface EnhancedExternalAdsTableProps {
  columns: Column<ExternalAd>[];
  data: ExternalAd[];
  count: number;
  page: number;
  rowsPerPage: number;
  order: Order;
  orderBy?: keyof ExternalAd;
  onRequestSort: (f: keyof ExternalAd) => void;
  onPageChange: (_: unknown, page: number) => void;
  onRowsPerPageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EnhancedExternalAdsTable: React.FC<EnhancedExternalAdsTableProps> = ({
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
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");

  const handleView = (ad: ExternalAd) => {
    setImages(ad.images);
    setTitle(ad.entityName);
    setDialogOpen(true);
  };

  return (
    <>
      <TableLayout<ExternalAd>
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
          {data.map((row) => (
            <TableRow hover key={row.id}>
              {columns.map((col) => {
                const val = row[col.field];
                // format dates nicely
                if (
                  col.field === "subscriptionDate" ||
                  col.field === "adStart" ||
                  col.field === "adEnd"
                ) {
                  return (
                    <TableCell
                      key={String(col.field)}
                      align={col.numeric ? "right" : "left"}
                      sx={{ p: 1 }}
                    >
                      {new Date(String(val)).toLocaleString()}
                    </TableCell>
                  );
                }

                // status as colored chip
                if (col.field === "status") {
                  return (
                    <TableCell key="status" sx={{ p: 1 }}>
                      <Chip
                        label={val === "active" ? "Active" : "Expired"}
                        color={val === "active" ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                  );
                }

                return (
                  <TableCell
                    key={String(col.field)}
                    align={col.numeric ? "right" : "left"}
                    sx={{ p: 1 }}
                  >
                    {String(val ?? "")}
                  </TableCell>
                );
              })}

              {/* view button */}
              <TableCell align="center" sx={{ p: 1 }}>
                <Button
                  startIcon={<VisibilityIcon />}
                  size="small"
                  variant="outlined"
                  onClick={() => handleView(row)}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                  }}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableLayout>

      {/* simple dialog for images */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {images.map((src) => (
            <Box
              component="img"
              key={src}
              src={src}
              alt="Ad"
              sx={{
                width: "100%",
                mb: 2,
                borderRadius: 2,
                objectFit: "cover",
              }}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EnhancedExternalAdsTable;
