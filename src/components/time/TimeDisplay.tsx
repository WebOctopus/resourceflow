import { formatTime } from '../../utils/timeUtils';

interface TimeDisplayProps {
  seconds: number;
  className?: string;
}

export default function TimeDisplay({ seconds, className = '' }: TimeDisplayProps) {
  return (
    <div className={`font-mono text-2xl font-bold ${className}`}>
      {formatTime(seconds)}
    </div>
  );
}