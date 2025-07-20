import React from "react";
import {
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Avatar,
  Box,
  Typography,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
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
}) => {
  const pageData = data;

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
        {pageData.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} sx={{ py: 6 }}>
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
          pageData.map((user) => (
            <TableRow hover key={user.id}>
              {columns.map((col) => {
                const val = user[col.field as keyof User];
                // … same rendering logic as before …
                // logo + name
                if (col.field === "name") {
                  const name = user.name?.trim();
                  const isEmptyName = !name;
                  return (
                    <TableCell
                      key="name"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        p: 1.6,
                        ...(isEmptyName
                          ? {
                              color: "text.disabled",
                              backgroundColor: (theme) =>
                                theme.palette.action.hover,
                            }
                          : {}),
                      }}
                    >
                      {user.logo && !isEmptyName && <Avatar src={user.logo} />}
                      {isEmptyName ? "—" : name}
                    </TableCell>
                  );
                }
                // subscription status
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
                // userType
                if (col.field === "userType") {
                  return (
                    <TableCell key="userType" sx={{ p: 1 }}>
                      <Chip
                        label={
                          user.userType === "real estate company"
                            ? "Company"
                            : "Individual"
                        }
                        color={
                          user.userType === "real estate company"
                            ? "primary"
                            : "info"
                        }
                        size="small"
                      />
                    </TableCell>
                  );
                }
                // province.name
                if (col.field === "province" && user.province) {
                  return (
                    <TableCell key="province" sx={{ p: 1 }}>
                      {user.province.name}
                    </TableCell>
                  );
                }
                // city.name
                if (col.field === "city" && user.city) {
                  return (
                    <TableCell key="city" sx={{ p: 1 }}>
                      {user.city.name}
                    </TableCell>
                  );
                }
                // createdAt
                if (col.field === "createdAt") {
                  return (
                    <TableCell key="createdAt" sx={{ p: 1 }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                  );
                }
                // updatedAt
                if (col.field === "updatedAt") {
                  return (
                    <TableCell key="updatedAt" sx={{ p: 1 }}>
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </TableCell>
                  );
                }

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
                            backgroundColor: (theme) =>
                              theme.palette.action.hover,
                          }
                        : {}),
                    }}
                  >
                    {isEmpty ? "—" : String(val)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))
        )}
      </TableBody>
    </TableLayout>
  );
};

export default EnhancedUserTable;
