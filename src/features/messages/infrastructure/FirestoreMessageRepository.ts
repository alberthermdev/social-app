import {
  collection,
  query,
  where,
  orderBy,
  limit as fLimit,
  onSnapshot,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { getFirestoreDb } from '@/core/firebase';
import { IMessageRepository } from '@/features/messages/domain/IMessageRepository';
import { Message, MessageType, MessageStatus } from '@/features/messages/domain/entities';
import { COLLECTIONS, MESSAGE_PAGE_SIZE } from '@/shared/constants';

function toMillis(value: unknown): number {
  if (value instanceof Timestamp) return value.toMillis();
  if (typeof value === 'number') return value;
  return Date.now();
}

function mapDocToMessage(d: { id: string; data: () => Record<string, unknown> }): Message {
  const data = d.data();
  return {
    id: d.id,
    chatId: data.chatId as string,
    senderId: data.senderId as string,
    content: data.content as string,
    type: (data.type as MessageType) || 'text',
    createdAt: toMillis(data.createdAt),
    status: (data.status as MessageStatus) || 'sent',
    metadata: data.metadata as Record<string, unknown> | undefined,
  };
}

export const FirestoreMessageRepository: IMessageRepository = {
  getMessages: async (chatId: string): Promise<Message[]> => {
    const db = getFirestoreDb();
    const q = query(
      collection(db, COLLECTIONS.MESSAGES),
      where('chatId', '==', chatId),
      orderBy('createdAt', 'asc'),
      fLimit(MESSAGE_PAGE_SIZE),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDocToMessage);
  },

  sendMessage: async (
    chatId: string,
    senderId: string,
    content: string,
    type: MessageType = 'text',
    metadata?: Record<string, unknown>,
  ): Promise<void> => {
    const db = getFirestoreDb();
    await addDoc(collection(db, COLLECTIONS.MESSAGES), {
      chatId,
      senderId,
      content,
      type,
      createdAt: serverTimestamp(),
      status: 'sent',
      metadata: metadata || null,
    });
  },

  subscribeToMessages: (chatId: string, callback: (messages: Message[]) => void) => {
    const db = getFirestoreDb();
    const q = query(collection(db, COLLECTIONS.MESSAGES), where('chatId', '==', chatId), orderBy('createdAt', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(mapDocToMessage);
      callback(messages);
    });
  },

  updateMessageStatus: async (chatId: string, messageId: string, status: MessageStatus): Promise<void> => {
    const db = getFirestoreDb();
    await updateDoc(doc(db, COLLECTIONS.MESSAGES, chatId, messageId), { status });
  },

  markMessagesAsRead: async (chatId: string, userId: string): Promise<void> => {
    const db = getFirestoreDb();
    const q = query(collection(db, COLLECTIONS.MESSAGES), where('chatId', '==', chatId), where('status', '!=', 'read'));
    const snapshot = await getDocs(q);
    const updates = snapshot.docs
      .filter((d) => d.data().senderId !== userId)
      .map((d) => updateDoc(doc(db, COLLECTIONS.MESSAGES, d.id), { status: 'read' }));
    await Promise.all(updates);
  },
};
