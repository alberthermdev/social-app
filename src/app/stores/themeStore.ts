import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  setIsDark: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'light',
  isDark: false,
  setMode: (mode) => set({ mode }),
  setIsDark: (isDark) => set({ isDark }),
}));
