import { Coffee, Users, Home } from 'lucide-react';
import { ActivityType } from '../../../lib/types';
import { useTimerStore } from '../../../lib/store/timerStore';

const statusConfigs = {
  break: {
    icon: Coffee,
    label: 'Break',
    activeClass: 'bg-yellow-100 text-yellow-800',
    hoverClass: 'hover:bg-yellow-50',
  },
  meeting: {
    icon: Users,
    label: 'Meeting',
    activeClass: 'bg-purple-100 text-purple-800',
    hoverClass: 'hover:bg-purple-50',
  },
  home: {
    icon: Home,
    label: 'Home',
    activeClass: 'bg-blue-100 text-blue-800',
    hoverClass: 'hover:bg-blue-50',
  },
} as const;

export default function StatusBar() {
  const { globalStatus, setGlobalStatus } = useTimerStore();

  const handleStatusClick = (status: ActivityType) => {
    if (globalStatus === status) {
      setGlobalStatus(null);
    } else {
      setGlobalStatus(status);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {(Object.keys(statusConfigs) as Array<keyof typeof statusConfigs>).map((status) => {
        const config = statusConfigs[status];
        const isActive = globalStatus === status;

        return (
          <button
            key={status}
            onClick={() => handleStatusClick(status as ActivityType)}
            className={`
              flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium
              transition-colors w-full
              ${isActive ? config.activeClass : `text-gray-600 ${config.hoverClass}`}
            `}
          >
            <config.icon className={`h-4 w-4 mr-1.5 ${isActive ? 'animate-pulse' : ''}`} />
            <span className="hidden sm:inline">{isActive ? `End ${config.label}` : config.label}</span>
            <span className="sm:hidden">{config.label}</span>
          </button>
        );
      })}
    </div>
  );
}