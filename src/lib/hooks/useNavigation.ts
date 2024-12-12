import { useLocation } from 'react-router-dom';
import { UserRole } from '../types';

interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  roles: UserRole[];
}

export function useNavigation(userRole: UserRole) {
  const location = useLocation();

  const isRouteActive = (path: string) => {
    return location.pathname === path;
  };

  const getAuthorizedRoutes = (): NavigationItem[] => {
    const routes: NavigationItem[] = [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: 'LayoutDashboard',
        roles: ['manager', 'project_manager'],
      },
      {
        name: 'My Projects',
        href: '/dashboard/my-projects',
        icon: 'FolderKanban',
        roles: ['team_member', 'manager'],
      },
      {
        name: 'Time Tracking',
        href: '/dashboard/time',
        icon: 'Clock',
        roles: ['team_member', 'project_manager', 'manager'],
      },
      {
        name: 'Team',
        href: '/dashboard/team',
        icon: 'Users',
        roles: ['project_manager', 'manager'],
      },
      {
        name: 'Clients',
        href: '/dashboard/clients',
        icon: 'Briefcase',
        roles: ['project_manager', 'manager'],
      },
      {
        name: 'Analytics',
        href: '/dashboard/analytics',
        icon: 'BarChart3',
        roles: ['manager'],
      },
      {
        name: 'Settings',
        href: '/dashboard/settings',
        icon: 'Settings',
        roles: ['manager'],
      },
    ];

    return routes.filter(route => route.roles.includes(userRole));
  };

  return {
    isRouteActive,
    getAuthorizedRoutes,
  };
}