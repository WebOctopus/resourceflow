import { Play, Pause, StopCircle } from 'lucide-react';

interface TimerControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  disabled?: boolean;
}

export default function TimerControls({
  isRunning,
  onStart,
  onPause,
  onResume,
  onStop,
  disabled = false,
}: TimerControlsProps) {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={isRunning ? onPause : onResume}
        disabled={disabled}
        className={`p-2 rounded-md ${
          isRunning
            ? 'text-yellow-600 hover:text-yellow-700'
            : 'text-green-600 hover:text-green-700'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title={isRunning ? 'Pause' : 'Start/Resume'}
      >
        {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </button>
      <button
        onClick={onStop}
        disabled={disabled}
        className="p-2 rounded-md text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Stop"
      >
        <StopCircle className="h-5 w-5" />
      </button>
    </div>
  );
}