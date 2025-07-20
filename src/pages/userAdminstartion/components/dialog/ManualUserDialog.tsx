import React, { useState } from "react";
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
} from "@mui/material";
import { useProvinces } from "@hooks/api/user/useProvinces";

export interface ManualUserPayload {
  name: string;
  email: string;
  number: string;
  province: string;
  city: string;
  userType: string;
  subscriptionAmount: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (user: ManualUserPayload) => void;
  error?: string | null;
}

const userTypes = ["owner", "real estate company"];

const ManualUserDialog: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState<ManualUserPayload>({
    name: "",
    email: "",
    number: "",
    province: "",
    city: "",
    userType: "",
    subscriptionAmount: "",
  });

  const { provinces, loading } = useProvinces();

  const selectedProvince = provinces.find((p) => p.id === form.province);

  const handleChange =
    (field: keyof ManualUserPayload) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [field]: e.target.value });
    };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, province: e.target.value, city: "" });
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add User Manually</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Stack spacing={2} mt={1}>
              <TextField
                label="Name"
                fullWidth
                value={form.name}
                onChange={handleChange("name")}
              />
              <TextField
                label="Email"
                fullWidth
                value={form.email}
                onChange={handleChange("email")}
              />
              <TextField
                label="Phone Number"
                fullWidth
                value={form.number}
                onChange={handleChange("number")}
              />
              <TextField
                select
                label="Province"
                fullWidth
                value={form.province}
                onChange={handleProvinceChange}
              >
                {provinces.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="City"
                fullWidth
                value={form.city}
                onChange={handleChange("city")}
                disabled={!form.province}
              >
                {selectedProvince?.cities.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="User Type"
                fullWidth
                value={form.userType}
                onChange={handleChange("userType")}
              >
                {userTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Subscription Amount"
                fullWidth
                type="number"
                value={form.subscriptionAmount}
                onChange={handleChange("subscriptionAmount")}
              />
            </Stack>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManualUserDialog;
