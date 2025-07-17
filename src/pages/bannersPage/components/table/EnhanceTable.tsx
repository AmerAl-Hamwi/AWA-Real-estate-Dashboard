import React from "react";
import { TableBody, TableRow, TableCell, IconButton, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TableLayout, { Column, Order } from "@components/ui/table/TableLayouts";
import { FormattedBanner } from "@/types/banner";

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  count: number;
  page: number;
  rowsPerPage: number;
  onRequestSort?: (field: keyof T) => void;
  onPageChange: (_: unknown, page: number) => void;
  onRowsPerPageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rowKey: keyof T;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  deleting?: boolean;
}

export default function EnhancedBannerTable<T extends FormattedBanner>({
  columns,
  data,
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onRequestSort = () => {},
  rowKey,
  onEdit,
  onDelete,
  deleting = false,
}: Props<T>) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof T>();

  const sorted = React.useMemo(() => {
    if (!orderBy) return data;
    return [...data].sort((a, b) => {
      const va = a[orderBy],
        vb = b[orderBy];
      return (va < vb ? -1 : 1) * (order === "asc" ? 1 : -1);
    });
  }, [data, order, orderBy]);

  return (
    <TableLayout<T>
      columns={columns}
      count={count}
      order={order}
      orderBy={orderBy}
      page={page}
      rowsPerPage={rowsPerPage}
      onRequestSort={(field) => {
        const asc = orderBy === field && order === "asc";
        setOrder(asc ? "desc" : "asc");
        setOrderBy(field);
        onRequestSort(field);
      }}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    >
      <TableBody>
        {sorted.map((row) => {
          const key = String(row[rowKey]);
          return (
            <TableRow hover key={key}>
              {columns.map((col) => {
                const val = row[col.field] as unknown;
                // image cell
                if (col.field === "imageUrl" && typeof val === "string") {
                  return (
                    <TableCell key="imageUrl">
                      {val ? (
                        <Box
                          component="img"
                          src={`${val}`}
                          alt="banner"
                          sx={{ width: 100, height: 60, objectFit: "cover" }}
                        />
                      ) : (
                        "–"
                      )}
                    </TableCell>
                  );
                }

                // default cell: show dash if nullish
                const display = val == null || val === "" ? "–" : String(val);

                return (
                  <TableCell
                    key={String(col.field)}
                    align={col.numeric ? "right" : "left"}
                  >
                    {display}
                  </TableCell>
                );
              })}

              {/* Actions */}
              <TableCell align="center">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => onEdit(row.id)}
                  sx={{color: "black"}}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(row.id)}
                  disabled={deleting}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </TableLayout>
  );
}
