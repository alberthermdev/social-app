import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useSettingsStore } from '@/app/stores/settingsStore';
import { colors } from '@/shared/theme/colors';

export function useTheme() {
  const theme = useSettingsStore((s) => s.theme);
  const systemScheme = useColorScheme();

  return useMemo(() => {
    if (theme === 'dark') return colors.dark;
    if (theme === 'light') return colors.light;
    return systemScheme === 'dark' ? colors.dark : colors.light;
  }, [theme, systemScheme]);
}
