import { Navigate, Outlet } from "react-router-dom";
import { useAuthService } from "@hooks/api/auth/useAuthService";

export default function PublicGuard() {
  const { isAuthenticated } = useAuthService();
  return !isAuthenticated() ? <Outlet /> : <Navigate to="/" replace />;
}
