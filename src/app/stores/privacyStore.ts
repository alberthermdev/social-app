import { create } from 'zustand';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

export type PrivacyOption = 'everyone' | 'contacts' | 'nobody';

interface PrivacyState {
  lastSeen: PrivacyOption;
  profilePhoto: PrivacyOption;
  about: PrivacyOption;
  readReceipts: boolean;
  blockedUsers: string[];

  setLastSeen: (v: PrivacyOption) => void;
  setProfilePhoto: (v: PrivacyOption) => void;
  setAbout: (v: PrivacyOption) => void;
  setReadReceipts: (v: boolean) => void;
  setBlockedUsers: (users: string[]) => void;
  addBlockedUser: (userId: string) => void;
  removeBlockedUser: (userId: string) => void;
  reset: () => void;
}

export const usePrivacyStore = create<PrivacyState>()(
  persist(
    (set) => ({
      lastSeen: 'everyone',
      profilePhoto: 'everyone',
      about: 'everyone',
      readReceipts: true,
      blockedUsers: [],

      setLastSeen: (lastSeen) => set({ lastSeen }),
      setProfilePhoto: (profilePhoto) => set({ profilePhoto }),
      setAbout: (about) => set({ about }),
      setReadReceipts: (readReceipts) => set({ readReceipts }),
      setBlockedUsers: (blockedUsers) => set({ blockedUsers }),
      addBlockedUser: (userId) => set((s) => ({ blockedUsers: [...s.blockedUsers, userId] })),
      removeBlockedUser: (userId) => set((s) => ({ blockedUsers: s.blockedUsers.filter((id) => id !== userId) })),
      reset: () =>
        set({
          lastSeen: 'everyone',
          profilePhoto: 'everyone',
          about: 'everyone',
          readReceipts: true,
          blockedUsers: [],
        }),
    }),
    {
      name: 'centri-privacy',
      storage: createJSONStorage(() => ReactNativeAsyncStorage),
    },
  ),
);
