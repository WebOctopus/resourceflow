import { useEffect } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { useTheme } from './useTheme';
import { useColorScheme } from './useColorScheme';

export function useSettings() {
  const {
    timeTracking,
    notifications,
    localization,
  } = useSettingsStore();

  // Apply theme
  useTheme();

  // Apply color scheme
  useColorScheme();

  // Apply time tracking settings
  useEffect(() => {
    if (timeTracking.autoStop) {
      let inactivityTimer: number;
      
      const resetTimer = () => {
        if (inactivityTimer) {
          window.clearTimeout(inactivityTimer);
        }
        
        inactivityTimer = window.setTimeout(() => {
          // Handle inactivity (stop timers, etc.)
        }, timeTracking.inactivityThreshold * 60 * 1000);
      };

      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keydown', resetTimer);
      
      return () => {
        window.removeEventListener('mousemove', resetTimer);
        window.removeEventListener('keydown', resetTimer);
        if (inactivityTimer) {
          window.clearTimeout(inactivityTimer);
        }
      };
    }
  }, [timeTracking.autoStop, timeTracking.inactivityThreshold]);

  // Apply notification settings
  useEffect(() => {
    if (notifications.timerAlerts) {
      // Request notification permission if needed
      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    }
  }, [notifications.timerAlerts]);

  // Apply localization settings
  useEffect(() => {
    document.documentElement.lang = localization.language;
  }, [localization.language]);
}