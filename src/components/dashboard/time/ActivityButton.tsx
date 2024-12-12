import { LucideIcon } from 'lucide-react';
import { ActivityType } from '../../../lib/types';
import { formatTime } from '../../../utils/timeUtils';

interface ActivityButtonProps {
  icon: LucideIcon;
  label: string;
  colorClass: string;
  activityType: ActivityType;
  currentActivity: ActivityType;
  elapsed: number;
  onClick: () => void;
}

export default function ActivityButton({
  icon: Icon,
  label,
  colorClass,
  activityType,
  currentActivity,
  elapsed,
  onClick,
}: ActivityButtonProps) {
  const isActive = currentActivity === activityType;
  
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 rounded-md transition-all ${
        isActive
          ? `${colorClass} text-${colorClass.split('-')[0]}-600 ring-2 ring-${colorClass.split('-')[0]}-400`
          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
      <span className="text-xs font-medium mt-1">{label}</span>
      <span className="text-[10px] text-gray-500 mt-0.5">{formatTime(elapsed)}</span>
    </button>
  );
}