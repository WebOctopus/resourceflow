import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../../lib/store';
import Tooltip from '../../common/Tooltip';

export default function ProfileMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative">
      <Tooltip text="Profile & Settings">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center focus:outline-none"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-8 w-8 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <User className="h-5 w-5 text-indigo-600" />
            </div>
          )}
        </button>
      </Tooltip>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 py-1">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            
            <button
              onClick={() => {
                navigate('/dashboard/settings');
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}