import { Menu } from 'lucide-react';
import NotificationButton from './header/NotificationButton';
import FeedbackButton from './header/FeedbackButton';
import ProfileMenu from './header/ProfileMenu';

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
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
            <FeedbackButton />
            <NotificationButton />
            <ProfileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}