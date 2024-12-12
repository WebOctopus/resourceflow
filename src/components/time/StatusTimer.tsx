import { useTimer } from '../../lib/hooks/useTimer';
import TimeDisplay from './TimeDisplay';
import { Coffee, Users } from 'lucide-react';

interface StatusTimerProps {
  type: 'break' | 'meeting';
  isActive: boolean;
  onToggle: () => void;
}

export default function StatusTimer({ type, isActive, onToggle }: StatusTimerProps) {
  const timer = useTimer();

  const Icon = type === 'break' ? Coffee : Users;
  const label = type === 'break' ? 'Break' : 'Meeting';
  const colorClass = type === 'break' 
    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
    : 'bg-purple-100 text-purple-700 hover:bg-purple-200';

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={onToggle}
        className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
          isActive
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : colorClass
        }`}
      >
        <Icon className="h-4 w-4 mr-2" />
        {isActive ? `Back From ${label}` : `${label} Time`}
      </button>
      {isActive && (
        <TimeDisplay 
          seconds={timer.elapsedTime} 
          className="text-gray-600"
        />
      )}
    </div>
  );
}