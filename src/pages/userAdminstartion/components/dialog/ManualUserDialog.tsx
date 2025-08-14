import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
  CircularProgress,
  Box,
  Typography,
  InputAdornment,
  Avatar,
  FormHelperText,
  Grid,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useProvinces } from "@/hooks/api/user/useProvinces";
import { ManualUserPayload } from "@hooks/api/user/useManualUserRegister";
import { styled } from "@mui/material/styles";

// Define Props interface
interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (user: ManualUserPayload) => void;
  error?: string | null;
  loading?: boolean;
}

const userTypes = ["owner", "real estate company"] as const;

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ManualUserDialog: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  error,
  loading,
}) => {
  const [form, setForm] = useState<ManualUserPayload>({
    name: "",
    email: "",
    number: "",
    province: "",
    city: "",
    userType: "owner",
    subscriptionAmount: "",
    image: undefined,
  });

  const { provinces, loading: provLoading } = useProvinces();
  const selectedProvince = provinces.find((p) => p.id === form.province);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const isFormValid = useMemo(() => {
    const basicFields =
      form.name &&
      form.email &&
      form.number &&
      form.province &&
      form.city &&
      form.subscriptionAmount;
    if (form.userType === "real estate company") {
      return basicFields && form.image;
    }
    return basicFields;
  }, [form]);

  useEffect(() => {
    if (!open) {
      setForm({
        name: "",
        email: "",
        number: "",
        province: "",
        city: "",
        userType: "owner",
        subscriptionAmount: "",
        image: undefined,
      });
      setLogoPreview(null);
    }
  }, [open]);

  useEffect(() => {
    if (!form.image) {
      setLogoPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(form.image);
    setLogoPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [form.image]);

  const handleChange =
    (field: keyof ManualUserPayload) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [field]: e.target.value });
    };

  const handleProvince = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, province: e.target.value, city: "" });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setForm({ ...form, image: e.target.files[0] });
    }
  };

  const removeImage = () => {
    setForm({ ...form, image: undefined });
    setLogoPreview(null);
  };

  const submit = () => onSubmit(form);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle
        variant="h5"
        sx={{
          bgcolor: "primary.main",
          color: "common.white",
          py: 2,
          borderTopLeftRadius: "inherit",
          borderTopRightRadius: "inherit",
        }}
      >
        Add User Manually
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        {provLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress size={48} />
          </Box>
        ) : (
          <Stack spacing={3} mt={1}>
            {error && (
              <Typography
                color="error"
                variant="body2"
                sx={{
                  bgcolor: "error.light",
                  py: 1,
                  px: 2,
                  borderRadius: 1,
                  fontWeight: 500,
                }}
              >
                {error}
              </Typography>
            )}

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Full Name *"
                  fullWidth
                  value={form.name}
                  onChange={handleChange("name")}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Email *"
                  fullWidth
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </Grid>

            <TextField
              label="Phone Number *"
              fullWidth
              value={form.number}
              onChange={handleChange("number")}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+1</InputAdornment>
                ),
              }}
            />

            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  select
                  label="Province *"
                  fullWidth
                  value={form.province}
                  onChange={handleProvince}
                  variant="outlined"
                  size="small"
                >
                  {provinces.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  select
                  label="City *"
                  fullWidth
                  value={form.city}
                  onChange={handleChange("city")}
                  disabled={!form.province}
                  variant="outlined"
                  size="small"
                >
                  {selectedProvince?.cities.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <TextField
              select
              label="User Type *"
              fullWidth
              value={form.userType}
              onChange={handleChange("userType")}
              variant="outlined"
              size="small"
            >
              {userTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </MenuItem>
              ))}
            </TextField>

            {form.userType === "real estate company" && (
              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Company Logo *
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    variant="rounded"
                    src={logoPreview || undefined}
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: logoPreview ? "transparent" : "action.hover",
                    }}
                  >
                    {!logoPreview && <CloudUploadIcon />}
                  </Avatar>

                  <Box>
                    <Button
                      component="label"
                      variant="outlined"
                      color="primary"
                      startIcon={<CloudUploadIcon />}
                      sx={{ mr: 2 }}
                    >
                      Upload Logo
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={handleFile}
                      />
                    </Button>

                    {logoPreview && (
                      <Button
                        variant="text"
                        color="error"
                        onClick={removeImage}
                      >
                        Remove
                      </Button>
                    )}
                  </Box>
                </Stack>
                <FormHelperText>JPG, PNG or GIF (Max 5MB)</FormHelperText>
              </Box>
            )}

            <TextField
              label="Subscription Amount *"
              fullWidth
              type="number"
              value={form.subscriptionAmount}
              onChange={handleChange("subscriptionAmount")}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
                inputProps: { min: 0, step: 0.01 },
              }}
            />
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          variant="outlined"
          sx={{ borderRadius: 2, px: 3 }}
        >
          Cancel
        </Button>
        <Button
          onClick={submit}
          variant="contained"
          disabled={loading || !isFormValid}
          sx={{ borderRadius: 2, px: 4 }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Create User"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManualUserDialog;
