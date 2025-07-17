import React, { ReactNode } from "react";
import {
  Box,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TablePagination,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";

export type Order = "asc" | "desc";

export interface Column<T> {
  field: keyof T;
  label: string;
  numeric?: boolean;
  minWidth?: number;
}

export interface TableLayoutProps<T> {
  columns: Column<T>[];
  count: number;
  order: Order;
  orderBy?: keyof T;
  page: number;
  rowsPerPage: number;
  onRequestSort: (field: keyof T) => void;
  onPageChange: (_: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  children: ReactNode;
  showActions?: boolean
}

const TableLayout = <T extends { id: string }>({
  columns,
  count,
  order,
  orderBy,
  page,
  rowsPerPage,
  onRequestSort,
  onPageChange,
  onRowsPerPageChange,
  children,
  showActions = true,
}: TableLayoutProps<T>) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxWidth: "100%", overflowX: "auto" }}>
          <Table size={isMobile ? "small" : "medium"} sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={String(col.field)}
                    align="left"
                    sortDirection={orderBy === col.field ? order : false}
                    sx={{
                      p: 0.8,
                      position: "sticky",
                      top: 0,
                      backgroundColor: theme.palette.background.default,
                      zIndex: 1,
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === col.field}
                      direction={orderBy === col.field ? order : "asc"}
                      onClick={() => onRequestSort(col.field)}
                    >
                      {col.label}
                      {orderBy === col.field && (
                        <Box component="span" sx={visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      )}
                    </TableSortLabel>
                  </TableCell>
                ))}
                {showActions && (
                  <TableCell
                    key="actions"
                    align="center"
                    sx={{
                      position: "sticky",
                      top: 0,
                      backgroundColor: theme.palette.background.default,
                      zIndex: 1,
                    }}
                  >
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            {children}
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          rowsPerPageOptions={[3, 5, 10, 25, 50, 100]}
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          sx={{
            backgroundColor: "white",
            "& .MuiTablePagination-toolbar": {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(70px, auto))",
              justifyContent: "start",
            },
            "& .MuiTablePagination-spacer": {
              display: "none",
            },
            "& .MuiTablePagination-actions": {
              marginLeft: "auto",
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default TableLayout;
