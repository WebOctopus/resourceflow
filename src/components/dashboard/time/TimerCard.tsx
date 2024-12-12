import { Timer as TimerIcon, Pause, Play, StopCircle, X } from 'lucide-react';
import { formatTime } from '../../../utils/timeUtils';
import { Timer } from '../../../lib/types';
import { useEffect } from 'react';
import { useTimerStore } from '../../../lib/store/timerStore';
import { useStore } from '../../../lib/store';

interface TimerCardProps {
  timer: Timer;
  onComplete: (timer: Timer) => void;
}

export default function TimerCard({ timer, onComplete }: TimerCardProps) {
  const { startTimer, stopTimer, updateElapsed, removeTimer } = useTimerStore();
  const { clients, teamMembers } = useStore();

  const client = clients.find(c => c.id === timer.clientId);
  const project = client?.projects.find(p => p.id === timer.projectId);
  const member = teamMembers.find(m => m.id === timer.userId);

  useEffect(() => {
    let intervalId: number;

    if (timer.isRunning && timer.startTime) {
      intervalId = window.setInterval(() => {
        const elapsed = Math.floor((Date.now() - timer.startTime!) / 1000);
        updateElapsed(timer.id);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timer.isRunning, timer.startTime, timer.id, updateElapsed]);

  const handleToggleTimer = () => {
    if (timer.isRunning) {
      stopTimer(timer.id);
    } else {
      startTimer(timer.id);
    }
  };

  const handleComplete = () => {
    if (timer.isRunning) {
      stopTimer(timer.id);
    }
    onComplete(timer);
    removeTimer(timer.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center min-w-0">
          <TimerIcon className="h-4 w-4 text-gray-400 flex-shrink-0 mr-2" />
          <span className="text-sm font-medium text-gray-900 truncate">
            {project?.name}
          </span>
        </div>
        <button
          onClick={() => removeTimer(timer.id)}
          className="text-gray-400 hover:text-gray-500 ml-2 flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="text-xs text-gray-500 mb-3 truncate">
        {client?.name} • {member?.name}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-lg font-mono font-medium text-indigo-600">
          {formatTime(timer.elapsed)}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleToggleTimer}
            className={`p-1.5 rounded-md ${
              timer.isRunning
                ? 'text-yellow-600 hover:text-yellow-700'
                : 'text-green-600 hover:text-green-700'
            }`}
          >
            {timer.isRunning ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>
          
          <button
            onClick={handleComplete}
            className="p-1.5 rounded-md text-red-600 hover:text-red-700"
          >
            <StopCircle className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}