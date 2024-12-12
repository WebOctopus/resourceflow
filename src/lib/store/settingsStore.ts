import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Currency = 'USD' | 'GBP';
export type Theme = 'light' | 'dark' | 'system';
export type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
export type TimeFormat = '12' | '24';
export type Language = 'en' | 'es' | 'fr' | 'de';

interface WorkHours {
  start: string;
  end: string;
}

interface NotificationSettings {
  dailySummary: boolean;
  timerAlerts: boolean;
  projectReminders: boolean;
  teamUpdates: boolean;
}

interface TimeTrackingSettings {
  workHours: WorkHours;
  autoStart: boolean;
  autoStop: boolean;
  roundTime: boolean;
  inactivityThreshold: number; // in minutes
}

interface LocalizationSettings {
  language: Language;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
}

interface SettingsState {
  // Theme
  theme: Theme;
  colorScheme: 'default' | 'blue' | 'green' | 'purple';
  
  // Currency
  currency: Currency;
  
  // Notifications
  notifications: NotificationSettings;
  
  // Time Tracking
  timeTracking: TimeTrackingSettings;
  
  // Localization
  localization: LocalizationSettings;

  // Actions
  setTheme: (theme: Theme) => void;
  setColorScheme: (scheme: 'default' | 'blue' | 'green' | 'purple') => void;
  setCurrency: (currency: Currency) => void;
  setNotifications: (settings: Partial<NotificationSettings>) => void;
  setTimeTracking: (settings: Partial<TimeTrackingSettings>) => void;
  setWorkHours: (hours: WorkHours) => void;
  setLocalization: (settings: Partial<LocalizationSettings>) => void;
  toggleNotification: (key: keyof NotificationSettings) => void;
  toggleTimeTrackingSetting: (key: keyof Omit<TimeTrackingSettings, 'workHours' | 'inactivityThreshold'>) => void;
}

const initialState = {
  theme: 'system' as Theme,
  colorScheme: 'default' as const,
  currency: 'USD' as Currency,
  notifications: {
    dailySummary: true,
    timerAlerts: true,
    projectReminders: true,
    teamUpdates: true,
  },
  timeTracking: {
    workHours: {
      start: '09:00',
      end: '17:00',
    },
    autoStart: false,
    autoStop: true,
    roundTime: false,
    inactivityThreshold: 5,
  },
  localization: {
    language: 'en' as Language,
    dateFormat: 'MM/DD/YYYY' as DateFormat,
    timeFormat: '12' as TimeFormat,
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...initialState,

      // Actions
      setTheme: (theme) => set({ theme }),
      setColorScheme: (colorScheme) => set({ colorScheme }),
      setCurrency: (currency) => set({ currency }),
      setNotifications: (settings) => 
        set((state) => ({ 
          notifications: { ...state.notifications, ...settings } 
        })),
      setTimeTracking: (settings) =>
        set((state) => ({
          timeTracking: { ...state.timeTracking, ...settings }
        })),
      setWorkHours: (hours) =>
        set((state) => ({
          timeTracking: {
            ...state.timeTracking,
            workHours: hours,
          }
        })),
      setLocalization: (settings) =>
        set((state) => ({
          localization: { ...state.localization, ...settings }
        })),
      toggleNotification: (key) =>
        set((state) => ({
          notifications: {
            ...state.notifications,
            [key]: !state.notifications[key],
          }
        })),
      toggleTimeTrackingSetting: (key) =>
        set((state) => ({
          timeTracking: {
            ...state.timeTracking,
            [key]: !state.timeTracking[key],
          }
        })),
    }),
    {
      name: 'settings-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migrate from version 0 to version 1
          return {
            ...initialState,
            ...persistedState,
            // Ensure all required fields exist
            notifications: {
              ...initialState.notifications,
              ...(persistedState.notifications || {}),
            },
            timeTracking: {
              ...initialState.timeTracking,
              ...(persistedState.timeTracking || {}),
            },
            localization: {
              ...initialState.localization,
              ...(persistedState.localization || {}),
            },
          };
        }
        return persistedState as SettingsState;
      },
    }
  )
);