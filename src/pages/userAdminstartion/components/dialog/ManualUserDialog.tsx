import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useProvinces } from "@/hooks/api/user/useProvinces";
import { ManualUserPayload } from "@hooks/api/user/useManualUserRegister";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (user: ManualUserPayload) => void;
  error?: string | null;
  loading?: boolean;
}

const userTypes = ["owner", "real estate company"] as const;

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
  const selectedProvince = provinces.find(p => p.id === form.province);

  useEffect(() => {
    if (!open) {
      // reset when closing
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
    }
  }, [open]);

  const handleChange = (field: keyof ManualUserPayload) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  const submit = () => onSubmit(form);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add User Manually</DialogTitle>
      <DialogContent>
        {provLoading ? (
          <Box display="flex" justifyContent="center"><CircularProgress /></Box>
        ) : (
          <Stack spacing={2} mt={1}>
            {error && (
              <Typography color="error" variant="body2">{error}</Typography>
            )}

            <TextField
              label="Name" fullWidth
              value={form.name}
              onChange={handleChange("name")}
            />
            <TextField
              label="Email" fullWidth
              value={form.email}
              onChange={handleChange("email")}
            />
            <TextField
              label="Phone Number" fullWidth
              value={form.number}
              onChange={handleChange("number")}
            />
            <TextField
              select label="Province" fullWidth
              value={form.province}
              onChange={handleProvince}
            >
              {provinces.map(p => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              select label="City" fullWidth
              value={form.city}
              onChange={handleChange("city")}
              disabled={!form.province}
            >
              {selectedProvince?.cities.map(c => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              select label="User Type" fullWidth
              value={form.userType}
              onChange={handleChange("userType")}
            >
              {userTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>

            {form.userType === "real estate company" && (
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFileIcon />}
              >
                {form.image?.name || "Upload Logo"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFile}
                />
              </Button>
            )}

            <TextField
              label="Subscription Amount"
              fullWidth
              type="number"
              value={form.subscriptionAmount}
              onChange={handleChange("subscriptionAmount")}
            />
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button
          onClick={submit}
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} color="inherit"/> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManualUserDialog;
