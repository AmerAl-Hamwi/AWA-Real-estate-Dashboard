/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Grid,
  InputAdornment,
} from "@mui/material";
import type {
  Platform,
  UpsertVersionInput,
  ReleaseVersion,
} from "@/services/versionService/versionService";
import AndroidIcon from "@mui/icons-material/Android";
import AppleIcon from "@mui/icons-material/Apple";
import WarningIcon from "@mui/icons-material/Warning";

const semverRe = /^(\d+)\.(\d+)\.(\d+)(?:[-+][A-Za-z0-9.-]+)?$/i;
const isUrl = (s?: string) =>
  !s || /^(https?:\/\/|itms-services:\/\/)/i.test(s.trim());

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (payload: UpsertVersionInput) => Promise<void>;
  editing?: ReleaseVersion | null;
  isAr?: boolean;
}

const VersionDialog: React.FC<Props> = ({
  open,
  onClose,
  onSave,
  editing,
  isAr,
}) => {
  const [platform, setPlatform] = useState<Platform>("android");
  const [latestVersion, setLatestVersion] = useState("");
  const [forceUpdate, setForceUpdate] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [releaseNotesEn, setReleaseNotesEn] = useState(""); // EN
  const [releaseNotesAr, setReleaseNotesAr] = useState(""); // AR
  const [saving, setSaving] = useState(false);

  // NEW: confirmation state
  const [confirmForceOpen, setConfirmForceOpen] = useState(false);
  const [pendingForceValue, setPendingForceValue] = useState(false);

  useEffect(() => {
    if (editing) {
      setPlatform(editing.platform);
      setLatestVersion(editing.latestVersion ?? "");
      setForceUpdate(!!editing.forceUpdate);
      setIsActive(!!editing.isActive);
      setDownloadUrl(editing.downloadUrl ?? "");

      if (typeof editing.releaseNotes === "string") {
        setReleaseNotesEn(editing.releaseNotes);
        setReleaseNotesAr("");
      } else {
        setReleaseNotesEn(editing.releaseNotes?.en ?? "");
        setReleaseNotesAr(editing.releaseNotes?.ar ?? "");
      }
    } else {
      setPlatform("android");
      setLatestVersion("");
      setForceUpdate(false);
      setIsActive(true);
      setDownloadUrl("");
      setReleaseNotesEn("");
      setReleaseNotesAr("");
    }
  }, [editing, open]);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!latestVersion.trim()) e.latestVersion = "Version is required";
    else if (!semverRe.test(latestVersion.trim()))
      e.latestVersion = "Use semver, e.g. 1.2.3";
    if (!platform) e.platform = "Platform is required";
    if (!isUrl(downloadUrl))
      e.downloadUrl = "Enter a valid URL (http/https or itms-services://)";
    return e;
  }, [latestVersion, platform, downloadUrl]);

  const handleSave = async () => {
    if (Object.keys(errors).length) return;
    const payload: UpsertVersionInput = {
      platform,
      latestVersion: latestVersion.trim(),
      forceUpdate,
      isActive,
      downloadUrl: downloadUrl.trim() || undefined,
      releaseNotesEn: releaseNotesEn.trim(),
      releaseNotesAr: releaseNotesAr.trim(),
    };
    setSaving(true);
    try {
      await onSave(payload);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  // NEW: when toggling Force Update
  const onToggleForceUpdate = (checked: boolean) => {
    if (checked) {
      // ask confirmation only when enabling
      setPendingForceValue(true);
      setConfirmForceOpen(true);
    } else {
      setForceUpdate(false);
    }
  };

  // NEW: handle confirmation result
  const confirmEnableForceUpdate = () => {
    setForceUpdate(true);
    setConfirmForceOpen(false);
    setPendingForceValue(false);
  };
  const cancelEnableForceUpdate = () => {
    setForceUpdate(false); // explicitly keep it OFF
    setConfirmForceOpen(false);
    setPendingForceValue(false);
  };

  const icon =
    platform === "android" ? (
      <AndroidIcon sx={{ color: "#3DDC84" }} />
    ) : (
      <AppleIcon sx={{ color: "#A2AAAD" }} />
    );

  return (
    <>
      <Dialog
        open={open}
        onClose={saving ? undefined : onClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1.5}>
            {icon}
            <Typography variant="h6" fontWeight={600}>
              {editing
                ? isAr
                  ? "تعديل الإصدار"
                  : "Edit Release Version"
                : isAr
                  ? "إضافة إصدار جديد"
                  : "Add Release Version"}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ py: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label={isAr ? "المنصة" : "Platform"}
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                disabled={!!editing}
                error={!!errors.platform}
                helperText={errors.platform}
                fullWidth
                size="small"
              >
                <MenuItem value="android">Android</MenuItem>
                <MenuItem value="ios">iOS</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label={isAr ? "الإصدار" : "Latest Version"}
                value={latestVersion}
                onChange={(e) => setLatestVersion(e.target.value)}
                placeholder={isAr ? "مثال: 1.2.3" : "e.g. 1.2.3"}
                error={!!errors.latestVersion}
                helperText={
                  errors.latestVersion ||
                  (isAr ? "نسخة دلالية" : "Semantic version")
                }
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">v</InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label={isAr ? "رابط التنزيل" : "Download URL"}
                value={downloadUrl}
                onChange={(e) => setDownloadUrl(e.target.value)}
                placeholder="https://example.com/app.apk"
                error={!!errors.downloadUrl}
                helperText={
                  errors.downloadUrl ||
                  (isAr
                    ? "اختياري؛ مطلوب إذا كنت تخدم التنزيلات المباشرة"
                    : "Optional; required if you serve direct downloads")
                }
                fullWidth
                size="small"
              />
            </Grid>

            {/* EN & AR notes */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label={
                  isAr ? "ملاحظات الإصدار (بالإنجليزية)" : "Release Notes (EN)"
                }
                value={releaseNotesEn}
                onChange={(e) => setReleaseNotesEn(e.target.value)}
                multiline
                minRows={3}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label={isAr ? "ملاحظات الإصدار (بالعربية)" : "Release Notes (AR)"}
                value={releaseNotesAr}
                onChange={(e) => setReleaseNotesAr(e.target.value)}
                multiline
                minRows={3}
                fullWidth
                size="small"
              />
            </Grid>
          </Grid>

          <Box mt={3} display="flex" gap={3} alignItems="center" flexWrap="wrap">
            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  color="success"
                />
              }
              label={isAr ? "فعال" : "Active"}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={forceUpdate}
                  // ⬇️ use the guarded handler instead of direct setState
                  onChange={(e) => onToggleForceUpdate(e.target.checked)}
                  color="warning"
                />
              }
              label={isAr ? "تحديث إجباري" : "Force Update"}
            />
          </Box>

          {!editing && (
            <Box
              mt={2}
              display="flex"
              alignItems="center"
              gap={1}
              p={1.5}
              bgcolor="warning.light"
              borderRadius={1}
            >
              <WarningIcon fontSize="small" color="warning" />
              <Typography variant="body2" color="text.secondary">
                {isAr
                  ? "ملاحظة: المنصة فريدة — إضافة إصدار لمنصة موجودة قد تستبدله حسب منطق الخادم."
                  : "Note: Platform is unique — adding a version for an existing platform may overwrite it on the server."}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={onClose}
            disabled={saving}
            variant="outlined"
            sx={{ borderRadius: 2, px: 3 }}
          >
            {isAr ? "إلغاء" : "Cancel"}
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving || Object.keys(errors).length > 0}
            sx={{ borderRadius: 2, px: 4 }}
          >
            {saving
              ? isAr
                ? "جاري الحفظ..."
                : "Saving..."
              : isAr
                ? "حفظ"
                : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* NEW: confirmation dialog */}
      <Dialog
        open={confirmForceOpen}
        onClose={cancelEnableForceUpdate}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {isAr ? "تأكيد التحديث الإجباري" : "Confirm Force Update"}
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" gap={1.5} alignItems="flex-start">
            <WarningIcon color="warning" />
            <Typography variant="body2">
              {isAr
                ? "سيُطلب من جميع المستخدمين التحديث قبل استخدام التطبيق. هل تريد المتابعة؟"
                : "All users will be required to update before using the app. Do you want to proceed?"}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelEnableForceUpdate}>
            {isAr ? "إلغاء" : "Cancel"}
          </Button>
          <Button variant="contained" color="warning" onClick={confirmEnableForceUpdate} autoFocus>
            {isAr ? "تفعيل التحديث الإجباري" : "Enable Force Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VersionDialog;
