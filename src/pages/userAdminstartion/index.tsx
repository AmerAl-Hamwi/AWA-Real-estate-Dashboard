import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EnhancedUserTable from "./components/table/enhancedExternalUserTable";
import { Column, Order } from "@components/ui/table/TableLayouts";
import { User } from "@/types/user";
import { useUnsubscribedUsers } from "@/hooks/api/user/useUnsubscribedUsers";
import { useLanguage } from "@/contexts/language/LanguageContext";

type SubFilter = "all" | "subscribed" | "free";

const UserAdministrationPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  // translate your column headers here if needed:
  const columns: Column<User>[] = useMemo(
    () => [
      { field: "name", label: isAr ? "الاسم" : "Name", minWidth: 180 },
      { field: "email", label: isAr ? "البريد الإلكتروني" : "Email", minWidth: 200 },
      { field: "number", label: isAr ? "الهاتف" : "Phone", minWidth: 140 },
      { field: "userType", label: isAr ? "النوع" : "Type", minWidth: 120 },
      { field: "hasSubscription", label: isAr ? "الاشتراك" : "Subscription", minWidth: 130 },
      { field: "province", label: isAr ? "المحافظة" : "Province", minWidth: 140 },
      { field: "city", label: isAr ? "المدينة" : "City", minWidth: 140 },
      { field: "createdAt", label: isAr ? "تاريخ التسجيل" : "Registered On", minWidth: 140 },
      { field: "updatedAt", label: isAr ? "آخر تحديث" : "Last Updated", minWidth: 140 },
    ],
    [isAr]
  );

  const { users, loading, error } = useUnsubscribedUsers();
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof User>("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [subFilter, setSubFilter] = useState<SubFilter>("all");

  const handleRequestSort = (field: keyof User) => {
    const isAsc = orderBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(field);
  };

  const filtered = users.filter((u) => {
    if (subFilter === "all") return true;
    return subFilter === "subscribed"
      ? u.hasSubscription
      : !u.hasSubscription;
  });

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error.message}</Alert>;

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* Page Title */}
        <Typography variant="h6">
          {isAr ? "المستخدمون" : "Users"}{" "}
          <Typography component="span" color="primary">
            ({filtered.length})
          </Typography>
        </Typography>

        {/* Filter buttons */}
        <ToggleButtonGroup
          value={subFilter}
          exclusive
          onChange={(_, v) => v && setSubFilter(v)}
          sx={{
            "& .MuiToggleButton-root": {
              textTransform: "none",
              px: 2,
              borderRadius: 1,
            },
            "& .MuiToggleButton-root.Mui-selected": {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            },
          }}
        >
          <ToggleButton value="all">
            <PersonIcon sx={{ mr: 1 }} />
            {isAr ? "الكل" : "All"}
          </ToggleButton>
          <ToggleButton value="subscribed">
            <CheckCircleIcon sx={{ mr: 1 }} />
            {isAr ? "مشترك" : "Subscribed"}
          </ToggleButton>
          <ToggleButton value="free">
            <CancelIcon sx={{ mr: 1 }} />
            {isAr ? "مجاني" : "Free"}
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>

      <EnhancedUserTable
        columns={columns}
        data={filtered}
        count={filtered.length}
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
    </Box>
  );
};

export default UserAdministrationPage;
