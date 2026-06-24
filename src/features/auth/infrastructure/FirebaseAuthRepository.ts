import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseAuth, getFirestoreDb } from '@/core/firebase';
import { IAuthRepository } from '@/features/auth/domain/IAuthRepository';
import { AuthUser, LoginParams, RegisterParams } from '@/features/auth/domain/entities';
import { COLLECTIONS } from '@/shared/constants';
import { AuthError, getFirebaseErrorMessage } from '@/shared/errors';

export const FirebaseAuthRepository: IAuthRepository = {
  login: async ({ email, password }: LoginParams): Promise<AuthUser> => {
    try {
      const auth = getFirebaseAuth();
      const db = getFirestoreDb();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userCredential.user.uid));

      if (!userDoc.exists()) {
        throw new AuthError('User profile not found');
      }

      await updateDoc(doc(db, COLLECTIONS.USERS, userCredential.user.uid), {
        online: true,
        lastSeen: serverTimestamp(),
      });

      return { ...(userDoc.data() as AuthUser), id: userCredential.user.uid };
    } catch (error) {
      throw new AuthError(getFirebaseErrorMessage(error));
    }
  },

  register: async ({ name, email, password }: RegisterParams): Promise<AuthUser> => {
    try {
      const auth = getFirebaseAuth();
      const db = getFirestoreDb();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const newUser: AuthUser = {
        id: userCredential.user.uid,
        email,
        name,
        photoURL: null,
        createdAt: Date.now(),
        lastSeen: Date.now(),
        online: true,
        about: 'Hey there! I am using Centri Social',
      };

      await setDoc(doc(db, COLLECTIONS.USERS, userCredential.user.uid), {
        ...newUser,
        createdAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
      });

      return newUser;
    } catch (error) {
      throw new AuthError(getFirebaseErrorMessage(error));
    }
  },

  logout: async (): Promise<void> => {
    try {
      const auth = getFirebaseAuth();
      const user = auth.currentUser;
      if (user) {
        const db = getFirestoreDb();
        await updateDoc(doc(db, COLLECTIONS.USERS, user.uid), {
          online: false,
          lastSeen: serverTimestamp(),
        });
      }
      await signOut(auth);
    } catch (error) {
      throw new AuthError(getFirebaseErrorMessage(error));
    }
  },

  getCurrentUser: async (): Promise<AuthUser | null> => {
    try {
      const auth = getFirebaseAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) return null;

      const db = getFirestoreDb();
      const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, currentUser.uid));
      if (!userDoc.exists()) return null;

      return { ...(userDoc.data() as AuthUser), id: currentUser.uid };
    } catch {
      return null;
    }
  },

  sendPasswordReset: async (email: string): Promise<void> => {
    try {
      const auth = getFirebaseAuth();
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new AuthError(getFirebaseErrorMessage(error));
    }
  },

  onAuthStateChanged: (callback: (user: AuthUser | null) => void) => {
    const auth = getFirebaseAuth();
    const db = getFirestoreDb();

    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = { ...(userDoc.data() as AuthUser), id: firebaseUser.uid };
          callback(userData);
        } else {
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  },
};
