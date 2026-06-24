import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getFirestoreDb, getFirebaseStorage } from '@/core/firebase';
import { File, Paths } from 'expo-file-system';
import { IProfileRepository } from '@/features/profile/domain/IProfileRepository';
import { AuthUser } from '@/features/auth/domain/entities';
import {
  UserSettings,
  PrivacySettings,
  NotificationSettings,
  UserStats,
  ActiveSession,
} from '@/features/profile/domain/entities';
import { COLLECTIONS } from '@/shared/constants';

const DEFAULT_SETTINGS: UserSettings = {
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
};

const DEFAULT_PRIVACY: PrivacySettings = {
  lastSeen: 'everyone',
  profilePhoto: 'everyone',
  about: 'everyone',
  readReceipts: true,
  blockedUsers: [],
};

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  messages: true,
  sound: true,
  vibration: true,
  popup: true,
  groupNotifications: true,
};

export const FirestoreProfileRepository: IProfileRepository = {
  updateProfile: async (userId, data) => {
    const db = getFirestoreDb();
    await updateDoc(doc(db, COLLECTIONS.USERS, userId), { ...data, updatedAt: serverTimestamp() });
  },

  uploadAvatar: async (userId, uri) => {
    const storage = getFirebaseStorage();
    const response = await fetch(uri);
    const blob = await response.blob();
    const avatarRef = ref(storage, `avatars/${userId}`);
    await uploadBytes(avatarRef, blob);
    const url = await getDownloadURL(avatarRef);
    const db = getFirestoreDb();
    await updateDoc(doc(db, COLLECTIONS.USERS, userId), { photoURL: url });
    return url;
  },

  deleteAvatar: async (userId) => {
    try {
      const storage = getFirebaseStorage();
      const avatarRef = ref(storage, `avatars/${userId}`);
      await deleteObject(avatarRef);
    } catch {
      /* file may not exist */
    }
    const db = getFirestoreDb();
    await updateDoc(doc(db, COLLECTIONS.USERS, userId), { photoURL: null });
  },

  getProfile: async (userId) => {
    const db = getFirestoreDb();
    const docRef = await getDoc(doc(db, COLLECTIONS.USERS, userId));
    if (!docRef.exists()) return null;
    return { id: docRef.id, ...docRef.data() } as AuthUser;
  },

  getUserSettings: async (userId) => {
    const db = getFirestoreDb();
    const docRef = await getDoc(doc(db, COLLECTIONS.USER_SETTINGS, userId));
    if (!docRef.exists()) return null;
    return { ...DEFAULT_SETTINGS, ...docRef.data() } as UserSettings;
  },

  updateUserSettings: async (userId, settings) => {
    const db = getFirestoreDb();
    await setDoc(doc(db, COLLECTIONS.USER_SETTINGS, userId), settings, { merge: true });
  },

  getPrivacySettings: async (userId) => {
    const db = getFirestoreDb();
    const docRef = await getDoc(doc(db, COLLECTIONS.USER_SETTINGS, userId));
    if (!docRef.exists()) return null;
    const data = docRef.data() as { privacy?: Partial<PrivacySettings> } | undefined;
    return { ...DEFAULT_PRIVACY, ...(data?.privacy || {}) } as PrivacySettings;
  },

  updatePrivacySettings: async (userId, settings) => {
    const db = getFirestoreDb();
    await setDoc(doc(db, COLLECTIONS.USER_SETTINGS, userId), { privacy: settings }, { merge: true });
  },

  getNotificationSettings: async (userId) => {
    const db = getFirestoreDb();
    const docRef = await getDoc(doc(db, COLLECTIONS.USER_SETTINGS, userId));
    if (!docRef.exists()) return null;
    const data = docRef.data() as { notifications?: Partial<NotificationSettings> } | undefined;
    return { ...DEFAULT_NOTIFICATIONS, ...(data?.notifications || {}) } as NotificationSettings;
  },

  updateNotificationSettings: async (userId, settings) => {
    const db = getFirestoreDb();
    await setDoc(doc(db, COLLECTIONS.USER_SETTINGS, userId), { notifications: settings }, { merge: true });
  },

  getUserStats: async (userId) => {
    const db = getFirestoreDb();
    const docRef = await getDoc(doc(db, COLLECTIONS.USER_STATS, userId));
    if (!docRef.exists()) return null;
    return docRef.data() as UserStats;
  },

  blockUser: async (userId, blockedUserId) => {
    const db = getFirestoreDb();
    const ref = doc(db, COLLECTIONS.USER_SETTINGS, userId);
    const snap = await getDoc(ref);
    const data = snap.data() as { privacy?: Partial<PrivacySettings> } | undefined;
    const privacy: PrivacySettings = { ...DEFAULT_PRIVACY, ...(data?.privacy || {}) };
    privacy.blockedUsers = [...new Set([...privacy.blockedUsers, blockedUserId])];
    await setDoc(ref, { privacy }, { merge: true });
  },

  unblockUser: async (userId, blockedUserId) => {
    const db = getFirestoreDb();
    const ref = doc(db, COLLECTIONS.USER_SETTINGS, userId);
    const snap = await getDoc(ref);
    const data = snap.data() as { privacy?: Partial<PrivacySettings> } | undefined;
    const privacy: PrivacySettings = { ...DEFAULT_PRIVACY, ...(data?.privacy || {}) };
    privacy.blockedUsers = privacy.blockedUsers.filter((id) => id !== blockedUserId);
    await setDoc(ref, { privacy }, { merge: true });
  },

  getBlockedUsers: async (userId) => {
    const db = getFirestoreDb();
    const docRef = await getDoc(doc(db, COLLECTIONS.USER_SETTINGS, userId));
    if (!docRef.exists()) return [];
    const data = docRef.data() as { privacy?: PrivacySettings } | undefined;
    return data?.privacy?.blockedUsers || [];
  },

  deleteAccount: async (userId) => {
    const db = getFirestoreDb();
    await deleteDoc(doc(db, COLLECTIONS.USERS, userId));
    await deleteDoc(doc(db, COLLECTIONS.USER_SETTINGS, userId));
    await deleteDoc(doc(db, COLLECTIONS.USER_STATS, userId));
  },

  clearCache: async () => {
    return 0;
  },

  exportData: async (userId) => {
    const db = getFirestoreDb();
    const user = await getDoc(doc(db, COLLECTIONS.USERS, userId));
    const settings = await getDoc(doc(db, COLLECTIONS.USER_SETTINGS, userId));
    const stats = await getDoc(doc(db, COLLECTIONS.USER_STATS, userId));
    const data = { user: user.data(), settings: settings.data(), stats: stats.data() };
    const json = JSON.stringify(data, null, 2);
    const file = new File(Paths.document, `centri-export-${userId}.json`);
    file.create({ overwrite: true });
    file.write(json);
  },

  isUsernameAvailable: async (username) => {
    const db = getFirestoreDb();
    const q = query(collection(db, COLLECTIONS.USERS), where('username', '==', username));
    const snap = await getDocs(q);
    return snap.empty;
  },

  setUsername: async (userId, username) => {
    const db = getFirestoreDb();
    await updateDoc(doc(db, COLLECTIONS.USERS, userId), { username });
  },

  getActiveSessions: async (userId) => {
    const db = getFirestoreDb();
    const q = query(collection(db, 'sessions'), where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as unknown as ActiveSession);
  },

  revokeSession: async (_userId, sessionId) => {
    const db = getFirestoreDb();
    await deleteDoc(doc(db, 'sessions', sessionId));
  },
};
