import { Bell } from 'lucide-react';
import { useState } from 'react';
import { useNotificationStore } from '../../../lib/store/notificationStore';
import NotificationDropdown from '../../notifications/NotificationDropdown';
import Tooltip from '../../common/Tooltip';

export default function NotificationButton() {
  const { notifications } = useNotificationStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Tooltip text="Notifications">
      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        >
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center transform translate-x-1 -translate-y-1">
              {unreadCount}
            </span>
          )}
        </button>
        <NotificationDropdown
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      </div>
    </Tooltip>
  );
}