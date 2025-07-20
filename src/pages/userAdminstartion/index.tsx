import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  useMediaQuery,
  Alert,
  Button,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import EnhancedUserTable from "./components/table/enhancedExternalUserTable";
import ManualUserDialog, {
  ManualUserPayload,
} from "./components/dialog/ManualUserDialog";
import LoadingScreen from "@components/ui/loader/loadingScreen";
import { Column, Order } from "@components/ui/table/TableLayouts";
import { User } from "@/types/user";
import { useFilteredUsers } from "@/hooks/api/user/useFilteredUsers";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { useManualUserRegister } from "@hooks/api/user/useManualUserRegister";

type SubFilter = "all" | "subscribed" | "free";

const UserAdministrationPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [subFilter, setSubFilter] = useState<SubFilter>("all");
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof User>("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const hasSubscription =
    subFilter === "all" ? undefined : subFilter === "subscribed";

  const { users, total, loading, error, refetch } = useFilteredUsers(
    page,
    rowsPerPage,
    hasSubscription
  );

  const { register } = useManualUserRegister();

  const handleRequestSort = (field: keyof User) => {
    const isAsc = orderBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(field);
  };

  const columns: Column<User>[] = useMemo(
    () => [
      { field: "name", label: isAr ? "الاسم" : "Name", minWidth: 180 },
      {
        field: "email",
        label: isAr ? "البريد الإلكتروني" : "Email",
        minWidth: 200,
      },
      { field: "number", label: isAr ? "الهاتف" : "Phone", minWidth: 140 },
      { field: "userType", label: isAr ? "النوع" : "Type", minWidth: 120 },
      {
        field: "hasSubscription",
        label: isAr ? "الاشتراك" : "Subscription",
        minWidth: 130,
      },
      {
        field: "province",
        label: isAr ? "المحافظة" : "Province",
        minWidth: 140,
      },
      { field: "city", label: isAr ? "المدينة" : "City", minWidth: 140 },
      {
        field: "createdAt",
        label: isAr ? "تاريخ التسجيل" : "Registered On",
        minWidth: 140,
      },
      {
        field: "updatedAt",
        label: isAr ? "آخر تحديث" : "Last Updated",
        minWidth: 140,
      },
    ],
    [isAr]
  );

  const handleManualSubmit = async (data: ManualUserPayload) => {
    try {
      setFormError(null);
      await register(data);
      await refetch();
      setDialogOpen(false);
    } catch (err) {
      setFormError(
        err?.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

    if (loading) return <LoadingScreen />;
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
        <Typography variant="h6">
          {isAr ? "المستخدمون" : "Users"}{" "}
          <Typography component="span" color="primary">
            ({users.length})
          </Typography>
        </Typography>

        <Box display="flex" alignItems="center" gap={1}>
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

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{ color: "white", py: 1.4 }}
          >
            {isAr ? "إضافة يدويًا" : "Add User"}
          </Button>
        </Box>
      </Paper>

      <EnhancedUserTable
        columns={columns}
        data={users}
        count={total}
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

      <ManualUserDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setFormError(null);
        }}
        onSubmit={handleManualSubmit}
        error={formError}
      />
    </Box>
  );
};

export default UserAdministrationPage;
