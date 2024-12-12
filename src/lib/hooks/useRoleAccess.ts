import { useAuthStatus } from './useAuth';
import { ROLE_PERMISSIONS } from '../constants/roles';

export function useRoleAccess() {
  const { user } = useAuthStatus();

  const hasAccess = (route: string) => {
    if (!user) return false;
    
    const permissions = ROLE_PERMISSIONS[user.role];
    if (!permissions) return false;

    return permissions.allowedRoutes.includes('*') || 
           permissions.allowedRoutes.includes(route);
  };

  const getDefaultRoute = () => {
    if (!user) return '/login';
    const permissions = ROLE_PERMISSIONS[user.role];
    return permissions?.defaultRoute || '/login';
  };

  return {
    hasAccess,
    getDefaultRoute,
    userRole: user?.role,
  };
}