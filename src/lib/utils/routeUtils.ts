import { UserRole } from '../types';
import { ROLE_PERMISSIONS } from '../constants/roles';

export const isRouteAuthorized = (route: string, userRole: UserRole): boolean => {
  const permissions = ROLE_PERMISSIONS[userRole];
  if (!permissions) return false;

  return permissions.allowedRoutes.includes('*') || 
         permissions.allowedRoutes.includes(route);
};

export const getDefaultRoute = (userRole: UserRole): string => {
  const permissions = ROLE_PERMISSIONS[userRole];
  return permissions?.defaultRoute || '/login';
};

export const getBreadcrumbs = (pathname: string): { label: string; path: string }[] => {
  const paths = pathname.split('/').filter(Boolean);
  return paths.map((path, index) => ({
    label: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' '),
    path: '/' + paths.slice(0, index + 1).join('/'),
  }));
};