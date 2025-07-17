import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToasterContext } from "@contexts/toaster/useToasterContext";
import {
  loginAdmin as apiLogin,
  logoutAdmin as apiLogout,
  ApiError,
} from "@services/authApiService/cosmos.auth";

export const useAuthService = () => {
  const navigate = useNavigate();
  const { showToaster } = useToasterContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{
    message: string;
    status?: number;
  } | null>(null);

  const handleError = (err: ApiError) => {
    setError(err);
    throw err;
  };

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      await apiLogin(credentials);
    } catch (err) {
      handleError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await apiLogout();
      navigate("/admin/login", { replace: true });
    } catch (err) {
      const apiErr = err as ApiError;
      // Handle token expiration/invalidation cases
      if (apiErr.status === 401 || apiErr.status === 400) {
        localStorage.clear();
        navigate("/admin/login", { replace: true });
        showToaster({
          message: "Session expired. Please login again",
          type: "warning",
        });
      } else {
        showToaster({
          message: apiErr.message || "Logout failed",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, showToaster]);

  return {
    loading,
    error,
    login,
    logout,
    isAuthenticated: () => !!localStorage.getItem("authToken"),
  };
};
