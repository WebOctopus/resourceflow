import { useEffect } from 'react';
import { useSettingsStore } from '../store/settingsStore';

export function useTheme() {
  const { theme } = useSettingsStore();

  useEffect(() => {
    const root = document.documentElement;
    
    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
        root.style.backgroundColor = '#1a1a1a';
        root.style.color = '#ffffff';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
        root.style.backgroundColor = '#ffffff';
        root.style.color = '#000000';
      }
    };

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      applyTheme(e.matches);
    };

    if (theme === 'dark') {
      applyTheme(true);
    } else if (theme === 'light') {
      applyTheme(false);
    } else {
      // System theme
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }
  }, [theme]);
}