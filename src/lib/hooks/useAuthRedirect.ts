import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';
import { ROLE_PERMISSIONS } from '../constants/roles';

export function useAuthRedirect() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      const rolePermissions = ROLE_PERMISSIONS[user.role];
      if (rolePermissions) {
        const from = (location.state as any)?.from?.pathname;
        const isAllowed = rolePermissions.allowedRoutes.includes('*') || 
                         rolePermissions.allowedRoutes.includes(from);

        if (from && isAllowed) {
          navigate(from);
        } else {
          navigate(rolePermissions.defaultRoute);
        }
      }
    }
  }, [user, navigate, location]);

  return { user };
}