import { Menu, Bell } from 'lucide-react';
import { useAuthStore } from '../../lib/store';

interface ClientPortalHeaderProps {
  onMenuClick: () => void;
}

export default function ClientPortalHeader({ onMenuClick }: ClientPortalHeaderProps) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <button 
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              <Bell className="h-6 w-6" />
            </button>
            <div className="relative flex items-center">
              {user?.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full mr-2"
                />
              )}
              <button
                onClick={() => logout()}
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}