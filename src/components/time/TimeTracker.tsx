import { useEffect } from 'react';
import { Timer as TimerIcon, Coffee, Users, Home } from 'lucide-react';
import { useTimerStore } from '../../lib/store/timerStore';
import { ActivityType } from '../../lib/types';
import { formatTime } from '../../utils/timeUtils';
import ActivityButton from './ActivityButton';

export default function TimeTracker() {
  const {
    timerState,
    timeTracker,
    startTimer,
    stopTimer,
    switchActivity,
    updateElapsed,
  } = useTimerStore();

  useEffect(() => {
    let intervalId: number;

    if (timerState.isRunning && timerState.startTime) {
      intervalId = window.setInterval(() => {
        const elapsed = Math.floor((Date.now() - timerState.startTime!) / 1000);
        updateElapsed(timerState.activityType, elapsed);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timerState.isRunning, timerState.startTime, timerState.activityType, updateElapsed]);

  const handleActivitySwitch = (activityType: ActivityType) => {
    if (timerState.activityType === activityType) {
      if (timerState.isRunning) {
        stopTimer();
      } else {
        startTimer(activityType);
      }
    } else {
      switchActivity(activityType);
    }
  };

  const activities = [
    { type: 'project' as ActivityType, icon: TimerIcon, label: 'Work', color: 'bg-blue-100' },
    { type: 'meeting' as ActivityType, icon: Users, label: 'Meeting', color: 'bg-purple-100' },
    { type: 'break' as ActivityType, icon: Coffee, label: 'Break', color: 'bg-green-100' },
    { type: 'home' as ActivityType, icon: Home, label: 'Home', color: 'bg-yellow-100' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-medium text-gray-900">Time Tracker</div>
        <div className="text-2xl font-bold text-indigo-600">
          {formatTime(timeTracker[timerState.activityType].elapsed)}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {activities.map((activity) => (
          <ActivityButton
            key={activity.type}
            icon={activity.icon}
            label={activity.label}
            colorClass={activity.color}
            activityType={activity.type}
            currentActivity={timerState.activityType}
            elapsed={timeTracker[activity.type].elapsed}
            onClick={() => handleActivitySwitch(activity.type)}
          />
        ))}
      </div>
    </div>
  );
}