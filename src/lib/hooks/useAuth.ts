import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';
import { ROLE_PERMISSIONS } from '../constants/roles';
import type { UserRole } from '../types';

// Hook for checking authentication status
export function useAuthStatus() {
  const { isAuthenticated, user } = useAuthStore();
  return { isAuthenticated, user };
}

// Hook for handling protected route logic
export function useAuth(allowedRoles?: UserRole[]) {
  const { isAuthenticated, user } = useAuthStatus();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login', { 
        state: { from: location.pathname },
        replace: true 
      });
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      const rolePermissions = ROLE_PERMISSIONS[user.role];
      if (rolePermissions) {
        navigate(rolePermissions.defaultRoute, { replace: true });
      }
    }
  }, [isAuthenticated, user, allowedRoles, navigate, location.pathname]);

  return { isAuthenticated, user };
}

// Hook for handling post-login redirects
export function useRedirectAfterAuth() {
  const { user } = useAuthStatus();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;

    const rolePermissions = ROLE_PERMISSIONS[user.role];
    if (!rolePermissions) return;

    const from = (location.state as any)?.from;
    const isAllowedRoute = from && (
      rolePermissions.allowedRoutes.includes(from) || 
      rolePermissions.allowedRoutes.includes('*')
    );

    navigate(isAllowedRoute ? from : rolePermissions.defaultRoute, { replace: true });
  }, [user, navigate, location.state]);
}