import { create } from 'zustand';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';
export type TextSize = 'small' | 'normal' | 'large';

interface SettingsState {
  theme: ThemeMode;
  textSize: TextSize;
  reducedAnimations: boolean;
  language: string;
  enterToSend: boolean;
  autoDownloadImages: boolean;
  autoDownloadVideos: boolean;
  showTypingIndicators: boolean;
  showReadReceipts: boolean;
  autoSaveMedia: boolean;

  setTheme: (theme: ThemeMode) => void;
  setTextSize: (size: TextSize) => void;
  setReducedAnimations: (v: boolean) => void;
  setLanguage: (lang: string) => void;
  setEnterToSend: (v: boolean) => void;
  setAutoDownloadImages: (v: boolean) => void;
  setAutoDownloadVideos: (v: boolean) => void;
  setShowTypingIndicators: (v: boolean) => void;
  setShowReadReceipts: (v: boolean) => void;
  setAutoSaveMedia: (v: boolean) => void;
  reset: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      textSize: 'normal',
      reducedAnimations: false,
      language: 'es',
      enterToSend: true,
      autoDownloadImages: true,
      autoDownloadVideos: false,
      showTypingIndicators: true,
      showReadReceipts: true,
      autoSaveMedia: false,

      setTheme: (theme) => set({ theme }),
      setTextSize: (textSize) => set({ textSize }),
      setReducedAnimations: (reducedAnimations) => set({ reducedAnimations }),
      setLanguage: (language) => set({ language }),
      setEnterToSend: (enterToSend) => set({ enterToSend }),
      setAutoDownloadImages: (autoDownloadImages) => set({ autoDownloadImages }),
      setAutoDownloadVideos: (autoDownloadVideos) => set({ autoDownloadVideos }),
      setShowTypingIndicators: (showTypingIndicators) => set({ showTypingIndicators }),
      setShowReadReceipts: (showReadReceipts) => set({ showReadReceipts }),
      setAutoSaveMedia: (autoSaveMedia) => set({ autoSaveMedia }),
      reset: () =>
        set({
          theme: 'system',
          textSize: 'normal',
          reducedAnimations: false,
          language: 'es',
          enterToSend: true,
          autoDownloadImages: true,
          autoDownloadVideos: false,
          showTypingIndicators: true,
          showReadReceipts: true,
          autoSaveMedia: false,
        }),
    }),
    {
      name: 'centri-settings',
      storage: createJSONStorage(() => ReactNativeAsyncStorage),
    },
  ),
);
