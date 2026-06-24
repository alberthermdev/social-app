import { initializeApp, FirebaseApp } from 'firebase/app';
import { initializeAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence } from '@/core/firebase/rn-persistence';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID!,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

export function initializeFirebase(): void {
  if (app) return;

  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
  db = getFirestore(app);
  storage = getStorage(app);

  if (__DEV__) {
    // connectAuthEmulator(auth, 'http://localhost:9099');
    // connectFirestoreEmulator(db, 'localhost', 8080);
    // connectStorageEmulator(storage, 'localhost', 9199);
  }
}

export function getFirebaseApp(): FirebaseApp {
  if (!app) throw new Error('Firebase not initialized');
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) throw new Error('Firebase Auth not initialized');
  return auth;
}

export function getFirestoreDb(): Firestore {
  if (!db) throw new Error('Firestore not initialized');
  return db;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) throw new Error('Firebase Storage not initialized');
  return storage;
}
