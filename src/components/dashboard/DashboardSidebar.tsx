import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Clock, 
  Users, 
  Briefcase, 
  BarChart3, 
  Settings,
  FolderKanban,
  MessageSquare,
} from 'lucide-react';
import { useAuthStore } from '../../lib/store';

const getNavigation = (role: string) => {
  const baseNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'project_manager', 'team_member', 'freelancer'] },
    { name: 'My Projects', href: '/dashboard/my-projects', icon: FolderKanban, roles: ['admin', 'manager', 'team_member', 'freelancer'] },
    { name: 'Time Tracking', href: '/dashboard/time', icon: Clock, roles: ['admin', 'manager', 'project_manager', 'team_member', 'freelancer'] },
    { name: 'Team', href: '/dashboard/team', icon: Users, roles: ['admin', 'manager', 'project_manager', 'freelancer'] },
    { name: 'Clients', href: '/dashboard/clients', icon: Briefcase, roles: ['admin', 'manager', 'project_manager', 'freelancer'] },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, roles: ['admin', 'manager', 'freelancer'] },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['admin', 'manager', 'freelancer'] },
  ];

  return baseNavigation.filter(item => item.roles.includes(role));
};

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const location = useLocation();
  const user = useAuthStore(state => state.user);
  const navigation = getNavigation(user?.role || '');

  return (
    <div className={`
      lg:relative lg:flex lg:flex-col
      lg:flex-1 lg:min-h-0
      ${!isOpen ? 'hidden lg:flex' : 'fixed inset-y-0 left-0 z-50 w-64 bg-white'}
    `}>
      <nav className="flex-1 px-2 pb-4 space-y-1" aria-label="Sidebar">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={`
                group flex items-center px-2 py-2 text-sm font-medium rounded-md
                ${isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <item.icon
                className={`
                  mr-3 flex-shrink-0 h-6 w-6
                  ${isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'}
                `}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}