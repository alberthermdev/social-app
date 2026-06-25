import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { getFirestoreDb } from '@/core/firebase';
import { IChatRepository } from '@/features/chats/domain/IChatRepository';
import { Chat } from '@/features/chats/domain/entities';
import { COLLECTIONS } from '@/shared/constants';

function toMillis(value: unknown): number {
  if (value instanceof Timestamp) return value.toMillis();
  if (typeof value === 'number') return value;
  return Date.now();
}

function mapDocToChat(doc: { id: string; data: () => Record<string, unknown> }): Chat {
  const d = doc.data();
  return {
    id: doc.id,
    participants: d.participants as string[],
    lastMessage: (d.lastMessage as string) || '',
    lastMessageAt: toMillis(d.lastMessageAt),
    lastSenderId: (d.lastSenderId as string) || '',
    createdAt: toMillis(d.createdAt),
    pinnedBy: (d.pinnedBy as string[]) || [],
    mutedBy: (d.mutedBy as string[]) || [],
    archivedBy: (d.archivedBy as string[]) || [],
    favoriteBy: (d.favoriteBy as string[]) || [],
    typingUsers: (d.typingUsers as string[]) || [],
    isRecording: (d.isRecording as string[]) || [],
    isGroup: (d.isGroup as boolean) || false,
    groupName: (d.groupName as string) || undefined,
    groupPhoto: (d.groupPhoto as string) || undefined,
    lastMessageType: (d.lastMessageType as Chat['lastMessageType']) || undefined,
    lastMessageStatus: (d.lastMessageStatus as Chat['lastMessageStatus']) || undefined,
    lastMessageSenderName: (d.lastMessageSenderName as string) || undefined,
    category: (d.category as Chat['category']) || undefined,
    unreadCount: (d.unreadCount as Record<string, number>) || {},
  };
}

export const FirestoreChatRepository: IChatRepository = {
  getChats: async (userId: string): Promise<Chat[]> => {
    const db = getFirestoreDb();
    const q = query(
      collection(db, COLLECTIONS.CHATS),
      where('participants', 'array-contains', userId),
      orderBy('lastMessageAt', 'desc'),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDocToChat);
  },

  getChatById: async (chatId: string): Promise<Chat | null> => {
    const db = getFirestoreDb();
    const docRef = await getDoc(doc(db, COLLECTIONS.CHATS, chatId));
    if (!docRef.exists()) return null;
    return mapDocToChat({ id: docRef.id, data: () => docRef.data() as Record<string, unknown> });
  },

  createChat: async (participants: string[]): Promise<string> => {
    const db = getFirestoreDb();
    const chatRef = await addDoc(collection(db, COLLECTIONS.CHATS), {
      participants,
      lastMessage: '',
      lastMessageAt: serverTimestamp(),
      lastSenderId: '',
      createdAt: serverTimestamp(),
      pinnedBy: [],
      mutedBy: [],
      archivedBy: [],
      favoriteBy: [],
      typingUsers: [],
      unreadCount: {},
    });
    return chatRef.id;
  },

  getOrCreateChat: async (userId1: string, userId2: string): Promise<string> => {
    const db = getFirestoreDb();
    const q = query(
      collection(db, COLLECTIONS.CHATS),
      where('participants', 'array-contains', userId1),
      orderBy('lastMessageAt', 'desc'),
    );
    const snapshot = await getDocs(q);
    const existing = snapshot.docs.find((d) => {
      const participants = d.data().participants as string[];
      return participants.includes(userId2);
    });
    if (existing) return existing.id;

    const chatRef = await addDoc(collection(db, COLLECTIONS.CHATS), {
      participants: [userId1, userId2],
      lastMessage: '',
      lastMessageAt: serverTimestamp(),
      lastSenderId: '',
      createdAt: serverTimestamp(),
      pinnedBy: [],
      mutedBy: [],
      archivedBy: [],
      favoriteBy: [],
      typingUsers: [],
      unreadCount: {},
    });
    return chatRef.id;
  },

  updateLastMessage: async (chatId: string, message: string, senderId: string): Promise<void> => {
    const db = getFirestoreDb();
    await updateDoc(doc(db, COLLECTIONS.CHATS, chatId), {
      lastMessage: message,
      lastMessageAt: serverTimestamp(),
      lastSenderId: senderId,
    });
  },

  subscribeToChats: (userId: string, callback: (chats: Chat[]) => void, onError?: (error: Error) => void) => {
    const db = getFirestoreDb();
    const q = query(
      collection(db, COLLECTIONS.CHATS),
      where('participants', 'array-contains', userId),
      orderBy('lastMessageAt', 'desc'),
    );
    return onSnapshot(
      q,
      (snapshot) => {
        const chats = snapshot.docs.map(mapDocToChat);
        callback(chats);
      },
      (error) => {
        if (onError) onError(error);
      },
    );
  },

  togglePinned: async (chatId: string, userId: string): Promise<void> => {
    const db = getFirestoreDb();
    const ref = doc(db, COLLECTIONS.CHATS, chatId);
    const snap = await getDoc(ref);
    const pinnedBy = (snap.data()?.pinnedBy as string[]) || [];
    const isPinned = pinnedBy.includes(userId);
    await updateDoc(ref, {
      pinnedBy: isPinned ? arrayRemove(userId) : arrayUnion(userId),
    });
  },

  toggleMuted: async (chatId: string, userId: string): Promise<void> => {
    const db = getFirestoreDb();
    const ref = doc(db, COLLECTIONS.CHATS, chatId);
    const snap = await getDoc(ref);
    const mutedBy = (snap.data()?.mutedBy as string[]) || [];
    const isMuted = mutedBy.includes(userId);
    await updateDoc(ref, {
      mutedBy: isMuted ? arrayRemove(userId) : arrayUnion(userId),
    });
  },

  toggleArchived: async (chatId: string, userId: string): Promise<void> => {
    const db = getFirestoreDb();
    const ref = doc(db, COLLECTIONS.CHATS, chatId);
    const snap = await getDoc(ref);
    const archivedBy = (snap.data()?.archivedBy as string[]) || [];
    const isArchived = archivedBy.includes(userId);
    await updateDoc(ref, {
      archivedBy: isArchived ? arrayRemove(userId) : arrayUnion(userId),
    });
  },

  toggleFavorite: async (chatId: string, userId: string): Promise<void> => {
    const db = getFirestoreDb();
    const ref = doc(db, COLLECTIONS.CHATS, chatId);
    const snap = await getDoc(ref);
    const favoriteBy = (snap.data()?.favoriteBy as string[]) || [];
    const isFavorite = favoriteBy.includes(userId);
    await updateDoc(ref, {
      favoriteBy: isFavorite ? arrayRemove(userId) : arrayUnion(userId),
    });
  },

  updateTypingStatus: async (chatId: string, userId: string, isTyping: boolean): Promise<void> => {
    const db = getFirestoreDb();
    const ref = doc(db, COLLECTIONS.CHATS, chatId);
    await updateDoc(ref, {
      typingUsers: isTyping ? arrayUnion(userId) : arrayRemove(userId),
    });
  },

  markAsRead: async (chatId: string, userId: string): Promise<void> => {
    const db = getFirestoreDb();
    const ref = doc(db, COLLECTIONS.CHATS, chatId);
    await updateDoc(ref, {
      [`unreadCount.${userId}`]: 0,
    });
  },
};
