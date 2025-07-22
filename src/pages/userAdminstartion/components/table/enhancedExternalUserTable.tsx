import React from "react";
import {
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Avatar,
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import TableLayout, { Column, Order } from "@components/ui/table/TableLayouts";
import { User } from "@/types/user";

export interface EnhancedUserTableProps {
  columns: Column<User>[];
  data: User[];
  count: number;
  page: number;
  rowsPerPage: number;
  order: Order;
  orderBy?: keyof User;
  onRequestSort: (f: keyof User) => void;
  onPageChange: (_: unknown, page: number) => void;
  onRowsPerPageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubscribe: (userId: string) => void;
  onCancel: (userId: string) => void;
  onDelete: (userId: string) => void;
  loadingId: string | null;
}

const EnhancedUserTable: React.FC<EnhancedUserTableProps> = ({
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
  onSubscribe,
  onCancel,
  onDelete,
  loadingId,
}) => {
  // We assume data is already the current page slice.
  return (
    <TableLayout<User>
      columns={columns}
      count={count}
      order={order}
      orderBy={orderBy}
      page={page}
      rowsPerPage={rowsPerPage}
      onRequestSort={onRequestSort}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      showActions={false}
    >
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              sx={{ py: 6, textAlign: "center" }}
            >
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                color="text.secondary"
              >
                <InboxIcon sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="subtitle1">No users found.</Typography>
              </Box>
            </TableCell>
          </TableRow>
        ) : (
          data.map((user) => {
            const busy = loadingId === user.id;
            return (
              <TableRow hover key={user.id}>
                {columns.map((col) => {
                  const val = user[col.field as keyof User];

                  // 1) Name column with optional avatar
                  if (col.field === "name") {
                    const name = user.name?.trim() || "";
                    const empty = !name;
                    return (
                      <TableCell
                        key="name"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          p: 1.6,
                          ...(empty
                            ? {
                                color: "text.disabled",
                                backgroundColor: (t) => t.palette.action.hover,
                              }
                            : {}),
                        }}
                      >
                        {user.logo && !empty && <Avatar src={user.logo} />}
                        {empty ? "—" : name}
                      </TableCell>
                    );
                  }

                  // 2) Subscription status chip
                  if (col.field === "hasSubscription") {
                    return (
                      <TableCell key="hasSubscription" sx={{ p: 1 }}>
                        <Chip
                          label={user.hasSubscription ? "Subscribed" : "Free"}
                          color={user.hasSubscription ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                    );
                  }

                  // 3) User type chip
                  if (col.field === "userType") {
                    const isCompany = user.userType === "real estate company";
                    return (
                      <TableCell key="userType" sx={{ p: 1 }}>
                        <Chip
                          label={isCompany ? "Company" : "Individual"}
                          color={isCompany ? "primary" : "info"}
                          size="small"
                        />
                      </TableCell>
                    );
                  }

                  // 4) Province name
                  if (col.field === "province" && user.province) {
                    return (
                      <TableCell key="province" sx={{ p: 1 }}>
                        {user.province.name}
                      </TableCell>
                    );
                  }

                  // 5) City name
                  if (col.field === "city" && user.city) {
                    return (
                      <TableCell key="city" sx={{ p: 1 }}>
                        {user.city.name}
                      </TableCell>
                    );
                  }

                  // 6) Dates
                  if (col.field === "createdAt" || col.field === "updatedAt") {
                    const date = new Date(val as string).toLocaleDateString();
                    return (
                      <TableCell key={String(col.field)} sx={{ p: 1 }}>
                        {date}
                      </TableCell>
                    );
                  }

                  // 7) Action column
                  if (col.field === "action") {
                    const sub = user.subscription;
                    const isExpired =
                      sub?.isSubscribed && sub.status === "EXPIRED";

                    return (
                      <TableCell
                        key="action"
                        sx={{ p: 1, whiteSpace: "nowrap" }}
                      >
                        {busy ? (
                          <CircularProgress size={24} />
                        ) : (
                          <>
                            {/* Expired => Renew */}
                            {isExpired && (
                              <IconButton
                                color="warning"
                                onClick={() => onSubscribe(user.id)}
                                title="Renew Subscription"
                              >
                                <AutorenewIcon fontSize="small" style={{color: "gray"}} />
                              </IconButton>
                            )}

                            {/* Active / Free branches */}
                            {!isExpired &&
                              (user.hasSubscription ? (
                                <IconButton
                                  color="error"
                                  onClick={() => onCancel(user.id)}
                                  title="Cancel Subscription"
                                >
                                  <CancelIcon fontSize="small" />
                                </IconButton>
                              ) : (
                                <IconButton
                                  color="primary"
                                  onClick={() => onSubscribe(user.id)}
                                  title="Grant Subscription"
                                >
                                  <SubscriptionsIcon fontSize="small" />
                                </IconButton>
                              ))}

                            {/* Delete always */}
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => onDelete(user.id)}
                              title="Delete User"
                              sx={{ ml: 0.5 }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    );
                  }

                  // 8) Fallback for any other field
                  const isEmpty = val == null;
                  return (
                    <TableCell
                      key={String(col.field)}
                      align={col.numeric ? "right" : "left"}
                      sx={{
                        p: 1,
                        ...(isEmpty
                          ? {
                              color: "text.disabled",
                              backgroundColor: (t) => t.palette.action.hover,
                            }
                          : {}),
                      }}
                    >
                      {isEmpty ? "—" : String(val)}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </TableLayout>
  );
};

export default EnhancedUserTable;
