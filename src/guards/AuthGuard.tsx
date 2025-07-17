import { Navigate, Outlet } from 'react-router-dom';
import { useAuthService } from '@hooks/api/auth/useAuthService';

export default function AuthGuard() {
  const { isAuthenticated } = useAuthService();

  return isAuthenticated() ? <Outlet /> : <Navigate to="/admin/login" replace />;
}