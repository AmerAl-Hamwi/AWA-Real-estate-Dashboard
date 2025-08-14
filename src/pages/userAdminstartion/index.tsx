/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/admin/UserAdministrationPage.tsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Box, Paper, Typography, ToggleButton, ToggleButtonGroup, useTheme, useMediaQuery,
  Alert, Button, TextField, InputAdornment, IconButton, Avatar, LinearProgress
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import LoadingScreen from "@components/ui/loader/loadingScreen";
import EnhancedUserTable from "./components/table/enhancedExternalUserTable";
import ManualUserDialog from "./components/dialog/ManualUserDialog";
import { Column, Order } from "@components/ui/table/TableLayouts";
import { User } from "@/types/user";
import { useFilteredUsers } from "@/hooks/api/user/useFilteredUsers";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { useManualUserRegister } from "@hooks/api/user/useManualUserRegister";
import { useSubscriptionActions } from "@/hooks/api/user/useSubscriptionActions";
import { useDeleteUser } from "@/hooks/api/user/useDeleteUser";
import CircularProgress from "@mui/material/CircularProgress";

type SubFilter = "all" | "subscribed" | "free";
const onlyDigits = (s: string) => (s || "").replace(/\D+/g, "");

const UserAdministrationPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const { register } = useManualUserRegister();
  const { onSubscribe, onCancel, loadingId } = useSubscriptionActions();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [page, setPage] = useState(0); // zero-based for MUI
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [subFilter, setSubFilter] = useState<SubFilter>("all");
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof User>("name");

  // UX-friendly phone search:
  // - user types into inputPhone (no fetch yet)
  // - after 500ms pause OR pressing Enter/Search icon → commit to queryPhone
  const [inputPhone, setInputPhone] = useState("");
  const [queryPhone, setQueryPhone] = useState(""); // this is sent to the hook
  const [typing, setTyping] = useState(false);

  // Debounce commit after user stops typing
  useEffect(() => {
    setTyping(true);
    const t = setTimeout(() => {
      setTyping(false);
      const digits = onlyDigits(inputPhone);
      // Optional min length: avoid spammy calls for < 3 digits
      if (digits.length >= 3 || digits.length === 0) {
        setQueryPhone(digits);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [inputPhone]);

  // Also allow pressing Enter or clicking the search icon to commit immediately
  const commitSearchNow = useCallback(() => {
    const digits = onlyDigits(inputPhone);
    if (digits.length >= 3 || digits.length === 0) {
      setTyping(false);
      setQueryPhone(digits);
    }
  }, [inputPhone]);

  const hasSubscription =
    subFilter === "all" ? undefined : subFilter === "subscribed";

  const {
    users,
    total,
    loading,      // only initial mount
    isFetching,   // subsequent fetches
    error,
    refetch,
  } = useFilteredUsers(page, rowsPerPage, hasSubscription, queryPhone);

  const { deleteUser: deleteUserReq, loadingId: deletingId } = useDeleteUser(refetch);

  // Reset to page 0 when server-side filters change
  useEffect(() => {
    setPage(0);
  }, [queryPhone, hasSubscription]);

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
      { field: "action", label: isAr ? "الإجراء" : "Action", minWidth: 100, sortable: false },
    ],
    [isAr]
  );

  // const handleSort = (f: keyof User) => {
  //   const asc = orderBy === f && order === "asc" ? "desc" : "asc";
  //   setOrder(asc);
  //   setOrderBy(f);
  //   setPage(0);
  // };

  // const handleManualSubmit = async (data: any) => {
  //   try {
  //     setFormError(null);
  //     await register(data);
  //     await refetch();
  //     setDialogOpen(false);
  //   } catch (err: any) {
  //     setFormError(
  //       err?.response?.data?.message || "Registration failed. Please try again."
  //     );
  //   }
  // };

  // Initial mount still shows fullscreen loader for a clean first paint
  if (loading) return <LoadingScreen />;
  if (error)   return <Alert severity="error">{error.message}</Alert>;

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      {/* subtle top bar while fetching new results (not on first mount) */}
      {isFetching && <LinearProgress sx={{ mb: 1 }} />}

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4e7f1 100%)",
          border: "1px solid rgba(0,0,0,0.05)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        {/* Left: Title & Count */}
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 56,
              height: 56,
              boxShadow: "0 4px 8px rgba(37, 99, 235, 0.2)",
            }}
          >
            <PersonIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {isAr ? "إدارة المستخدمين" : "User Management"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {isAr ? "إجمالي المستخدمين:" : "Total users:"}{" "}
              <Box component="span" fontWeight={600} color="primary.main">
                {total}
              </Box>
            </Typography>
          </Box>
        </Box>

        {/* Middle: Phone search with spinner, Enter-to-search + debounce fallback */}
        <TextField
          size="medium"
          type="tel"
          placeholder={isAr ? "ابحث برقم الهاتف..." : "Search by phone..."}
          value={inputPhone}
          onChange={(e) => setInputPhone(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitSearchNow();
            }
          }}
          sx={{
            flexGrow: 1,
            maxWidth: 400,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "white",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {isFetching && !typing && (
                  <CircularProgress size={18} sx={{ mr: 1 }} />
                )}
                {inputPhone ? (
                  <>
                    <IconButton
                      size="small"
                      onClick={() => setInputPhone("")}
                      edge="end"
                      sx={{ mr: 0.5 }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={commitSearchNow}
                      sx={{ textTransform: "none" }}
                    >
                      {isAr ? "بحث" : "Search"}
                    </Button>
                  </>
                ) : null}
              </InputAdornment>
            ),
            inputMode: "tel",
          }}
          helperText={
            onlyDigits(inputPhone).length > 0 &&
            onlyDigits(inputPhone).length < 3
              ? isAr
                ? "أدخل 3 أرقام على الأقل للبحث"
                : "Enter at least 3 digits to search"
              : " "
          }
        />

        {/* Right: Filters & Add */}
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <ToggleButtonGroup
            value={subFilter}
            exclusive
            onChange={(_, v) => v && setSubFilter(v)}
            sx={{
              "& .MuiToggleButton-root": {
                textTransform: "none",
                px: 2,
                py: 1,
                borderRadius: 1,
                border: "1px solid rgba(0,0,0,0.1)",
                "&:not(:first-of-type)": { borderLeft: "1px solid rgba(0,0,0,0.1)" },
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "white",
                  boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)",
                  "&:hover": { bgcolor: "primary.dark" },
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
            sx={{
              color: "white",
              py: 1.4,
              px: 3,
              borderRadius: 2,
              fontWeight: 600,
              background: "linear-gradient(90deg, #2563eb, #3b82f6)",
              "&:hover": {
                background: "linear-gradient(90deg, #1d4ed8, #2563eb)",
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
              },
            }}
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
        onRequestSort={(f) => {
          const asc = orderBy === f && order === "asc" ? "desc" : "asc";
          setOrder(asc);
          setOrderBy(f);
          setPage(0);
        }}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(+e.target.value);
          setPage(0);
        }}
        onSubscribe={async (id) => { await onSubscribe(id); await refetch(); }}
        onCancel={async (id) => { await onCancel(id); await refetch(); }}
        loadingId={loadingId || deletingId}
        onDelete={async (id) => { await deleteUserReq(id); await refetch(); }}
      />

      <ManualUserDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setFormError(null); }}
        onSubmit={async (data) => {
          try {
            setFormError(null);
            await register(data);
            await refetch();
            setDialogOpen(false);
          } catch (err: any) {
            setFormError(err?.response?.data?.message || "Registration failed. Please try again.");
          }
        }}
        error={formError}
      />
    </Box>
  );
};

export default UserAdministrationPage;
