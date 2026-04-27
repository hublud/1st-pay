import { useState, useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme, Appearance } from 'react-native';

let overrideTheme: 'light' | 'dark' | null = null;
const listeners = new Set<() => void>();

export function setAppTheme(theme: 'light' | 'dark') {
  overrideTheme = theme;
  try {
    if (typeof Appearance.setColorScheme === 'function') {
      Appearance.setColorScheme(theme);
    }
  } catch (e) {}
  
  listeners.forEach(l => l());
}

export function useColorScheme() {
  const deviceTheme = useDeviceColorScheme();
  const [theme, setTheme] = useState(overrideTheme || deviceTheme || 'light');

  useEffect(() => {
    const listener = () => {
      setTheme(overrideTheme || Appearance.getColorScheme() || 'light');
    };
    listeners.add(listener);
    
    const subscription = Appearance.addChangeListener(() => {
      if (!overrideTheme) {
        setTheme(Appearance.getColorScheme() || 'light');
      }
    });

    return () => {
      listeners.delete(listener);
      subscription.remove();
    };
  }, []);

  return theme;
}
