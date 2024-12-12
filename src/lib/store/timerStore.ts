import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Timer, ActivityType } from '../types';
import { generateId } from '../utils';

interface TimerStoreState {
  activeTimers: Timer[];
  selectedTimerId: string | null;
  globalStatus: ActivityType | null;
  lastWorkState: { [timerId: string]: boolean };
  addTimer: (timer: Omit<Timer, 'id' | 'isRunning' | 'startTime' | 'elapsed'>) => string;
  removeTimer: (timerId: string) => void;
  startTimer: (timerId: string) => void;
  stopTimer: (timerId: string) => void;
  updateElapsed: (timerId: string) => void;
  selectTimer: (timerId: string) => void;
  setGlobalStatus: (status: ActivityType | null) => void;
  getStatusTimer: (userId: string, activityType: ActivityType) => Timer | undefined;
  getTotalTimeForActivity: (activityType: ActivityType) => number;
}

const initialState = {
  activeTimers: [],
  selectedTimerId: null,
  globalStatus: null,
  lastWorkState: {},
};

export const useTimerStore = create<TimerStoreState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addTimer: (timerData) => {
        const newTimer: Timer = {
          id: generateId(),
          ...timerData,
          isRunning: false,
          startTime: null,
          elapsed: 0,
        };

        set((state) => ({
          activeTimers: [...state.activeTimers, newTimer],
          selectedTimerId: newTimer.id,
        }));

        return newTimer.id;
      },

      removeTimer: (timerId) => {
        set((state) => ({
          activeTimers: state.activeTimers.filter((timer) => timer.id !== timerId),
          selectedTimerId: state.selectedTimerId === timerId ? null : state.selectedTimerId,
          lastWorkState: {
            ...state.lastWorkState,
            [timerId]: undefined,
          },
        }));
      },

      startTimer: (timerId) => {
        const timer = get().activeTimers.find(t => t.id === timerId);
        if (!timer) return;

        set((state) => ({
          activeTimers: state.activeTimers.map((t) =>
            t.id === timerId
              ? {
                  ...t,
                  isRunning: true,
                  startTime: Date.now() - (t.elapsed * 1000),
                }
              : t
          ),
        }));
      },

      stopTimer: (timerId) => {
        const timer = get().activeTimers.find(t => t.id === timerId);
        if (!timer || !timer.isRunning || !timer.startTime) return;

        const elapsed = Math.floor((Date.now() - timer.startTime) / 1000);

        set((state) => ({
          activeTimers: state.activeTimers.map((t) =>
            t.id === timerId
              ? {
                  ...t,
                  isRunning: false,
                  startTime: null,
                  elapsed: t.elapsed + elapsed,
                }
              : t
          ),
        }));
      },

      updateElapsed: (timerId) => {
        const timer = get().activeTimers.find(t => t.id === timerId);
        if (!timer?.isRunning || !timer.startTime) return;

        const elapsed = Math.floor((Date.now() - timer.startTime) / 1000);

        set((state) => ({
          activeTimers: state.activeTimers.map((t) =>
            t.id === timerId
              ? { ...t, elapsed }
              : t
          ),
        }));
      },

      selectTimer: (timerId) => {
        set({ selectedTimerId: timerId });
      },

      setGlobalStatus: (status) => {
        const currentStatus = get().globalStatus;
        const workTimers = get().activeTimers.filter(t => t.activityType === 'project');

        // If we're ending a status
        if (currentStatus && (!status || status !== currentStatus)) {
          // Stop the current status timer
          const statusTimer = get().activeTimers.find(t => t.activityType === currentStatus);
          if (statusTimer) {
            get().stopTimer(statusTimer.id);
          }

          // Resume work timers that were running before
          workTimers.forEach(timer => {
            if (get().lastWorkState[timer.id]) {
              get().startTimer(timer.id);
            }
          });
        }

        // If we're starting a new status
        if (status && status !== currentStatus) {
          // Store current work timer states
          const newLastWorkState = workTimers.reduce((acc, timer) => ({
            ...acc,
            [timer.id]: timer.isRunning,
          }), {});

          // Pause all work timers
          workTimers.forEach(timer => {
            if (timer.isRunning) {
              get().stopTimer(timer.id);
            }
          });

          // Start the new status timer
          const existingTimer = get().activeTimers.find(t => t.activityType === status);
          if (existingTimer) {
            get().startTimer(existingTimer.id);
          } else {
            const newTimerId = get().addTimer({
              userId: '1',
              activityType: status,
            });
            get().startTimer(newTimerId);
          }

          set({ lastWorkState: newLastWorkState });
        }

        set({ globalStatus: status });
      },

      getStatusTimer: (userId: string, activityType: ActivityType) => {
        return get().activeTimers.find(
          t => t.userId === userId && t.activityType === activityType
        );
      },

      getTotalTimeForActivity: (activityType: ActivityType) => {
        return get().activeTimers
          .filter(t => t.activityType === activityType)
          .reduce((total, timer) => {
            if (timer.isRunning && timer.startTime) {
              const currentElapsed = Math.floor((Date.now() - timer.startTime) / 1000);
              return total + currentElapsed;
            }
            return total + timer.elapsed;
          }, 0);
      },
    }),
    {
      name: 'timer-storage',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            ...initialState,
            ...persistedState,
            lastWorkState: {},
          };
        }
        return persistedState as TimerStoreState;
      },
    }
  )
);