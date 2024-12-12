import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import { useAdminStore } from '../lib/store/adminStore';
import type { UserRole } from '../lib/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, allowedRoles, requireAdmin }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const { isAuthenticated: isAdminAuthenticated } = useAdminStore();

  if (requireAdmin) {
    return isAdminAuthenticated ? (
      <>{children}</>
    ) : (
      <Navigate to="/admin/login" replace />
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}