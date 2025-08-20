import React, { useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Button,
  TableBody,
  TableRow,
  TableCell,
  LinearProgress,
  Avatar,
  Stack,
  Card,
  CardContent,
  Skeleton,
  Divider,
  useTheme,
} from "@mui/material";
import SystemUpdateIcon from "@mui/icons-material/SystemUpdate";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import AndroidIcon from "@mui/icons-material/Android";
import AppleIcon from "@mui/icons-material/Apple";
import TableLayout, { Column, Order } from "@components/ui/table/TableLayouts";
import { useVersions } from "@/hooks/api/version/useVersions";
import VersionDialog from "./components/versionDialog";
import { ReleaseVersion } from "@/services/versionService/versionService";
import { useLanguage } from "@/contexts/language/LanguageContext";

const platformIcon = (p: string) =>
  p === "android" ? (
    <AndroidIcon fontSize="small" />
  ) : (
    <AppleIcon fontSize="small" />
  );

const ReleaseVersionsPage: React.FC = () => {
  const { versions, loading, isFetching, error, refetch, save, remove } =
    useVersions();
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const theme = useTheme();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ReleaseVersion | null>(null);

  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<keyof ReleaseVersion>("updatedAt");

  const columns: Column<ReleaseVersion>[] = useMemo(
    () => [
      { field: "platform", label: isAr ? "المنصة" : "Platform", minWidth: 120 },
      {
        field: "latestVersion",
        label: isAr ? "الإصدار" : "Latest Version",
        minWidth: 140,
      },
      {
        field: "forceUpdate",
        label: isAr ? "إجباري" : "Force Update",
        minWidth: 120,
      },
      { field: "isActive", label: isAr ? "فعال" : "Active", minWidth: 100 },
      {
        field: "downloadUrl",
        label: isAr ? "الرابط" : "Download URL",
        minWidth: 220,
      },
      {
        field: "updatedAt",
        label: isAr ? "آخر تحديث" : "Updated At",
        minWidth: 160,
      },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        field: "action" as any,
        label: isAr ? "إجراء" : "Action",
        minWidth: 120,
        sortable: false,
      },
    ],
    [isAr]
  );

  const sorted = useMemo(() => {
    const arr = [...versions];
    arr.sort((a, b) => {
      const va = a[orderBy];
      const vb = b[orderBy];
      const cmp = String(va ?? "").localeCompare(String(vb ?? ""));
      return order === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [versions, order, orderBy]);

  const android = versions.find((v) => v.platform === "android");
  const ios = versions.find((v) => v.platform === "ios");

  if (loading)
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton
          variant="rectangular"
          height={56}
          sx={{ mb: 3, borderRadius: 2 }}
        />
        <Grid container spacing={3}>
          {[0, 1].map((i) => (
            <Grid size={{ xs: 12, md: 6 }} key={i}>
              <Skeleton
                variant="rectangular"
                height={120}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
          ))}
        </Grid>
        <Skeleton
          variant="rectangular"
          height={400}
          sx={{ mt: 3, borderRadius: 2 }}
        />
      </Box>
    );

  if (error)
    return (
      <Paper
        sx={{ p: 3, borderRadius: 2, textAlign: "center", color: "error.main" }}
      >
        <Typography variant="h6">{error.message}</Typography>
        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => refetch()}>
          {isAr ? "إعادة المحاولة" : "Retry"}
        </Button>
      </Paper>
    );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 3 }}>
      {isFetching && (
        <LinearProgress sx={{ position: "fixed", top: 0, left: 0, right: 0 }} />
      )}

      {/* Header */}
      <Card
        sx={{
          borderRadius: 3,
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #2c3e50 0%, #1a1a2e 100%)"
              : "linear-gradient(135deg, #4b6cb7 0%, #182848 100%)",
          color: "white",
          overflow: "visible",
          boxShadow: theme.shadows[4],
        }}
      >
        <CardContent sx={{ position: "relative" }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  width: 56,
                  height: 56,
                  backdropFilter: "blur(10px)",
                  boxShadow: theme.shadows[4],
                }}
              >
                <SystemUpdateIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  {isAr ? "إدارة إصدارات التطبيق" : "Release Versions"}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {isAr
                    ? "إدارة الإصدارات لكل منصة وتفعيل التحديثات الإجبارية"
                    : "Manage per-platform releases and force updates"}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditing(null);
                setDialogOpen(true);
              }}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                bgcolor: "rgba(255,255,255,0.15)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              }}
            >
              {isAr ? "إضافة إصدار" : "Add Version"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Platform cards */}
      <Grid container spacing={3}>
        {[
          { title: "Android", v: android, key: "android" },
          { title: "iOS", v: ios, key: "ios" },
        ].map(({ title, v, key }) => (
          <Grid size={{ xs: 12, md: 6 }} key={key}>
            <Card
              sx={{
                borderRadius: 3,
                height: "100%",
                boxShadow: theme.shadows[1],
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      variant="rounded"
                      sx={{
                        bgcolor: key === "android" ? "#3DDC84" : "#A2AAAD",
                        width: 48,
                        height: 48,
                      }}
                    >
                      {platformIcon(key)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {v
                          ? isAr
                            ? "آخر إصدار:"
                            : "Latest:"
                          : isAr
                            ? "لا يوجد بيانات"
                            : "No data"}
                        {v && (
                          <Box
                            component="span"
                            ml={1}
                            fontWeight={600}
                            color="primary"
                          >
                            {v.latestVersion}
                          </Box>
                        )}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    {v && (
                      <>
                        <Chip
                          label={
                            v.isActive
                              ? isAr
                                ? "فعال"
                                : "Active"
                              : isAr
                                ? "غير فعال"
                                : "Inactive"
                          }
                          color={v.isActive ? "success" : "default"}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                        <Chip
                          label={
                            v.forceUpdate
                              ? isAr
                                ? "إجباري"
                                : "Forced"
                              : isAr
                                ? "اختياري"
                                : "Optional"
                          }
                          color={v.forceUpdate ? "warning" : "default"}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </>
                    )}
                    <Tooltip title={isAr ? "تحرير" : "Edit"}>
                      <span>
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setEditing(
                              v ?? {
                                id: "",
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                platform: key as any,
                                latestVersion: "",
                                forceUpdate: false,
                                isActive: true,
                              }
                            );
                            setDialogOpen(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                </Box>

                {v && (
                  <Box mt={2}>
                    <Divider sx={{ my: 1 }} />
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      mt={2}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {isAr ? "آخر تحديث:" : "Last Updated:"}
                      </Typography>
                      <Typography variant="body2">
                        {v.updatedAt
                          ? new Date(v.updatedAt).toLocaleString()
                          : "—"}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      mt={1}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {isAr ? "رابط التنزيل:" : "Download URL:"}
                      </Typography>
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{ maxWidth: "60%" }}
                      >
                        {v.downloadUrl || "—"}
                      </Typography>
                    </Stack>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Table Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
        mb={1}
      >
        <Typography variant="h6" fontWeight={700}>
          {isAr ? "جميع الإصدارات" : "All Versions"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {sorted.length} {isAr ? "عنصر" : "items"}
        </Typography>
      </Box>

      {/* Table */}
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <TableLayout<ReleaseVersion>
          columns={[...columns]}
          count={sorted.length}
          order={order}
          orderBy={orderBy}
          page={0}
          rowsPerPage={sorted.length || 5}
          onRequestSort={(f) => {
            const asc = orderBy === f && order === "asc" ? "desc" : "asc";
            setOrder(asc);
            setOrderBy(f as keyof ReleaseVersion);
          }}
          onPageChange={() => {}}
          onRowsPerPageChange={() => {}}
          showActions={false}
        >
          <TableBody>
            {sorted.map((row) => (
              <TableRow
                hover
                key={row.id || row.platform}
                sx={{ "&:last-child td": { borderBottom: 0 } }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    {platformIcon(row.platform)}
                    <Typography textTransform="capitalize" fontWeight={500}>
                      {row.platform}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600} color="primary">
                    {row.latestVersion}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={
                      row.forceUpdate
                        ? isAr
                          ? "إجباري"
                          : "Forced"
                        : isAr
                          ? "اختياري"
                          : "Optional"
                    }
                    color={row.forceUpdate ? "warning" : "default"}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={
                      row.isActive
                        ? isAr
                          ? "فعال"
                          : "Active"
                        : isAr
                          ? "غير فعال"
                          : "Inactive"
                    }
                    color={row.isActive ? "success" : "default"}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell sx={{ maxWidth: 360 }}>
                  <Tooltip title={row.downloadUrl || ""}>
                    <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                      {row.downloadUrl || "—"}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {row.updatedAt
                      ? new Date(row.updatedAt).toLocaleString()
                      : "—"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Tooltip title={isAr ? "تحرير" : "Edit"}>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setEditing(row);
                          setDialogOpen(true);
                        }}
                        sx={{
                          bgcolor: theme.palette.primary.light,
                          "&:hover": {
                            bgcolor: theme.palette.primary.main,
                            color: "white",
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      color="error"
                      onClick={async () => {
                        if (
                          confirm(
                            isAr
                              ? "هل أنت متأكد من حذف هذا الإصدار؟"
                              : "Are you sure you want to delete this version?"
                          )
                        ) {
                          await remove(row.platform);
                          await refetch();
                        }
                      }}
                      sx={{
                        bgcolor: theme.palette.error.light,
                        "&:hover": {
                          bgcolor: theme.palette.error.main,
                          color: "white",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableLayout>
      </Card>

      <VersionDialog
        open={dialogOpen}
        editing={editing || undefined}
        onClose={() => setDialogOpen(false)}
        onSave={async (payload) => {
          await save(payload);
          await refetch();
        }}
        isAr={isAr}
      />
    </Box>
  );
};

export default ReleaseVersionsPage;
