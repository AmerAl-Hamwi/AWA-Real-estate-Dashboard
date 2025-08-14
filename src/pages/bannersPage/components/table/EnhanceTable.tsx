import React from "react";
import { 
  TableBody, 
  TableRow, 
  TableCell, 
  IconButton, 
  Box, 
  Typography,
  Chip,
  useTheme,
  CircularProgress
} from "@mui/material";
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
  onViewImage?: (url: string) => void;
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
  onViewImage,
  deleting = false,
}: Props<T>) {
  const theme = useTheme();
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof T>();
  const [hoveredRow, setHoveredRow] = React.useState<string | null>(null);

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
            <TableRow 
              hover 
              key={key}
              onMouseEnter={() => setHoveredRow(key)}
              onMouseLeave={() => setHoveredRow(null)}
              sx={{
                '&:hover': {
                  backgroundColor: `${theme.palette.primary.light}08`,
                }
              }}
            >
              {columns.map((col) => {
                const val = row[col.field] as unknown;
                
                // Image cell
                if (col.field === "imageUrl" && typeof val === "string") {
                  return (
                    <TableCell key="imageUrl" sx={{ width: 180 }}>
                      {val ? (
                        <Box
                          onClick={() => onViewImage && onViewImage(val)}
                          sx={{
                            width: 120,
                            height: 60,
                            borderRadius: 1,
                            overflow: 'hidden',
                            position: 'relative',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            transform: hoveredRow === key ? 'scale(1.05)' : 'scale(1)',
                            boxShadow: hoveredRow === key ? theme.shadows[2] : 'none',
                            '&:hover': {
                              '&:after': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                              },
                              '&:before': {
                                content: '"View"',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: 'white',
                                zIndex: 2,
                                fontWeight: 600,
                              }
                            }
                          }}
                        >
                          <Box
                            component="img"
                            src={val}
                            alt="banner"
                            sx={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover',
                            }}
                          />
                        </Box>
                      ) : (
                        <Box sx={{ 
                          width: 120, 
                          height: 60, 
                          bgcolor: theme.palette.grey[200],
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: theme.palette.text.secondary
                        }}>
                          No image
                        </Box>
                      )}
                    </TableCell>
                  );
                }

                // Default cell
                const display = val == null || val === "" ? "–" : String(val);

                return (
                  <TableCell
                    key={String(col.field)}
                    align={col.numeric ? "right" : "left"}
                  >
                    {col.field === "type" ? (
                      <Chip 
                        label={display} 
                        size="small" 
                        sx={{ 
                          bgcolor: display === 'image' ? theme.palette.primary.light : theme.palette.secondary.light,
                          color: display === 'image' ? theme.palette.primary.dark : theme.palette.secondary.dark,
                          fontWeight: 500,
                          borderRadius: 1
                        }} 
                      />
                    ) : (
                      <Typography variant="body2">
                        {display}
                      </Typography>
                    )}
                  </TableCell>
                );
              })}

              {/* Actions */}
              <TableCell align="center" sx={{ width: 120 }}>
                <Box display="flex" gap={1} justifyContent="center">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(row.id)}
                    sx={{
                      bgcolor: `${theme.palette.primary.light}20`,
                      color: theme.palette.primary.main,
                      '&:hover': {
                        bgcolor: `${theme.palette.primary.light}30`,
                      }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onDelete(row.id)}
                    disabled={deleting}
                    sx={{
                      bgcolor: `${theme.palette.error.light}20`,
                      color: theme.palette.error.main,
                      '&:hover': {
                        bgcolor: `${theme.palette.error.light}30`,
                      },
                      '&:disabled': {
                        opacity: 0.5
                      }
                    }}
                  >
                    {deleting ? (
                      <CircularProgress size={16} color="error" />
                    ) : (
                      <DeleteIcon fontSize="small" />
                    )}
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </TableLayout>
  );
}