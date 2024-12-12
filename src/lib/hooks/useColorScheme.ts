import { useEffect } from 'react';
import { useSettingsStore } from '../store/settingsStore';

const colorSchemes = {
  default: {
    primary: 'indigo',
    secondary: 'purple',
    accent: 'pink',
  },
  blue: {
    primary: 'blue',
    secondary: 'sky',
    accent: 'cyan',
  },
  green: {
    primary: 'emerald',
    secondary: 'green',
    accent: 'teal',
  },
  purple: {
    primary: 'purple',
    secondary: 'violet',
    accent: 'fuchsia',
  },
};

export function useColorScheme() {
  const { colorScheme } = useSettingsStore();

  useEffect(() => {
    const root = document.documentElement;
    const colors = colorSchemes[colorScheme];
    
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }, [colorScheme]);
}