import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthUser } from '@/features/auth/domain/entities';
import { FirebaseAuthRepository } from '@/features/auth/infrastructure/FirebaseAuthRepository';
import { createAuthUseCases, AuthUseCases } from '@/features/auth/application';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  initialized: boolean;
  useCases: AuthUseCases;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      initialized: false,
      useCases: createAuthUseCases(FirebaseAuthRepository),
      setUser: (user) => set({ user, loading: false, initialized: true }),
      setLoading: (loading) => set({ loading }),
      setInitialized: (initialized) => set({ initialized }),
      reset: () => {
        AsyncStorage.removeItem('centri-auth');
        set({ user: null, loading: false, initialized: true });
      },
    }),
    {
      name: 'centri-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        initialized: state.initialized,
      }),
    },
  ),
);
