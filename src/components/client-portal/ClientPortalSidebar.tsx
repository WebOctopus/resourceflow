import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  FileText, 
  Clock,
  MessageSquare,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/client-portal', icon: LayoutDashboard },
  { name: 'Projects', href: '/client-portal/projects', icon: FileText },
  { name: 'Time & Budget', href: '/client-portal/time-budget', icon: Clock },
  { name: 'Communication', href: '/client-portal/communication', icon: MessageSquare },
];

interface ClientPortalSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ClientPortalSidebar({ isOpen, onClose }: ClientPortalSidebarProps) {
  const location = useLocation();

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