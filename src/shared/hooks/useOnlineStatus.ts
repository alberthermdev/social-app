import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getFirestoreDb } from '@/core/firebase';
import { COLLECTIONS } from '@/shared/constants';
import { useAuthStore } from '@/app/stores/authStore';

export function useOnlineStatus() {
  const user = useAuthStore((s) => s.user);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (!user?.id) return;

    const db = getFirestoreDb();
    const userRef = doc(db, COLLECTIONS.USERS, user.id);

    const updateOnline = async (online: boolean) => {
      try {
        await updateDoc(userRef, {
          online,
          lastSeen: serverTimestamp(),
        });
      } catch {}
    };

    updateOnline(true);

    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (appState.current.match(/active/) && nextState.match(/inactive|background/)) {
        updateOnline(false);
      }
      if (nextState === 'active') {
        updateOnline(true);
      }
      appState.current = nextState;
    });

    return () => {
      subscription.remove();
      updateOnline(false);
    };
  }, [user?.id]);
}
