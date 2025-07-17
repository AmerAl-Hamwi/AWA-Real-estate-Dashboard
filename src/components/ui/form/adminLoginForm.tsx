import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import { useAuthService } from "@hooks/api/auth/useAuthService";
import { useToasterContext } from "@contexts/toaster/useToasterContext";

const AdminLoginForm: React.FC = () => {
  const { login, loading } = useAuthService();
  const { showToaster } = useToasterContext();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const accent = "#191E29";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(credentials);
      showToaster({ message: "Logged in successfully!", type: "success" });
      navigate("/");
    } catch (err) {
      showToaster({ message: err.message, type: "error" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap={3}>
        <TextField
          fullWidth
          label="Admin Email"
          name="email"
          type="email"
          variant="outlined"
          value={credentials.email}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email sx={{ color: accent }} />
              </InputAdornment>
            ),
          }}
          sx={{
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "& fieldset": { borderColor: "#e0e0e0" },
              "&:hover fieldset": { borderColor: "black" },
              "&.Mui-focused fieldset": { borderColor: "black" },
            },
            "& .MuiInputLabel-root": {
              color: "#5d5a55",
              "&.Mui-focused": { color: accent },
            },
          }}
          required
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          value={credentials.password}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock sx={{ color: accent }} />
              </InputAdornment>
            ),
          }}
          sx={{
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "& fieldset": { borderColor: "#e0e0e0" },
              "&:hover fieldset": { borderColor: "black" },
              "&.Mui-focused fieldset": { borderColor: "black" },
            },
            "& .MuiInputLabel-root": {
              color: "#5d5a55",
              "&.Mui-focused": { color: "accent" },
            },
          }}
          required
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          sx={{
            py: 1.5,
            fontWeight: 600,
            backgroundColor: "#2B2B2B",
            color: "#ffffff",
            borderRadius: 2,
            textTransform: "none",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0px 6px 14px rgba(0,0,0,0.15)",
            },
            "&.Mui-disabled": { backgroundColor: "#000000", color: "#ffffff" },
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "#ffffff" }} />
          ) : (
            "Sign In"
          )}
        </Button>
      </Box>
    </form>
  );
};

export default AdminLoginForm;
