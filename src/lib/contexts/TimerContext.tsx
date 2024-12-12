import { createContext, useContext, useEffect, useState } from 'react';
import { useTimerStore } from '../store/timerStore';
import { ActivityType } from '../types';

interface TimerContextType {
  currentActivity: ActivityType | null;
  isRunning: boolean;
  elapsedTime: number;
  activityTimes: Record<ActivityType, number>;
  startTimer: (activity: ActivityType) => void;
  stopTimer: () => void;
  switchActivity: (activity: ActivityType) => void;
}

const TimerContext = createContext<TimerContextType | null>(null);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const {
    activeTimers,
    globalStatus,
    setGlobalStatus,
    getTotalTimeForActivity,
  } = useTimerStore();

  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let intervalId: number;

    if (globalStatus) {
      const statusTimer = activeTimers.find(t => t.activityType === globalStatus);
      
      if (statusTimer?.isRunning && statusTimer.startTime) {
        intervalId = window.setInterval(() => {
          const elapsed = Math.floor((Date.now() - statusTimer.startTime!) / 1000);
          setElapsedTime(elapsed);
        }, 1000);
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [globalStatus, activeTimers]);

  const value: TimerContextType = {
    currentActivity: globalStatus,
    isRunning: activeTimers.some(t => t.isRunning),
    elapsedTime,
    activityTimes: {
      project: getTotalTimeForActivity('project'),
      meeting: getTotalTimeForActivity('meeting'),
      break: getTotalTimeForActivity('break'),
      home: getTotalTimeForActivity('home'),
    },
    startTimer: (activity) => setGlobalStatus(activity),
    stopTimer: () => setGlobalStatus(null),
    switchActivity: (activity) => setGlobalStatus(activity),
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}