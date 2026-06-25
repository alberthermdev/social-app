import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  writeBatch,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { getFirestoreDb } from '@/core/firebase/config';
import type { AppNotification } from '@/features/notifications/domain/entities';
import type { INotificationRepository } from '@/features/notifications/domain/INotificationRepository';

const COLLECTION = 'notifications';

function mapDoc(id: string, data: Record<string, unknown>): AppNotification {
  return {
    id,
    type: data.type as AppNotification['type'],
    title: data.title as string,
    body: data.body as string,
    senderId: data.senderId as string | undefined,
    senderName: data.senderName as string | undefined,
    senderPhoto: data.senderPhoto as string | null | undefined,
    chatId: data.chatId as string | undefined,
    read: data.read as boolean,
    createdAt: (data.createdAt as Timestamp)?.toMillis() ?? Date.now(),
  };
}

export const FirestoreNotificationRepository: INotificationRepository = {
  subscribeToNotifications(userId: string, onUpdate: (notifications: AppNotification[]) => void): () => void {
    const db = getFirestoreDb();
    const q = query(collection(db, COLLECTION), where('targetUserId', '==', userId), orderBy('createdAt', 'desc'));

    const unsub = onSnapshot(q, (snapshot) => {
      const list: AppNotification[] = [];
      snapshot.forEach((snap) => {
        list.push(mapDoc(snap.id, snap.data() as Record<string, unknown>));
      });
      onUpdate(list);
    });

    return unsub;
  },

  async markAsRead(notificationId: string): Promise<void> {
    const db = getFirestoreDb();
    await updateDoc(doc(db, COLLECTION, notificationId), { read: true });
  },

  async markAllAsRead(userId: string): Promise<void> {
    const db = getFirestoreDb();
    const q = query(collection(db, COLLECTION), where('targetUserId', '==', userId), where('read', '==', false));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return;

    const batch = writeBatch(db);
    snapshot.forEach((snap) => {
      batch.update(snap.ref, { read: true });
    });
    await batch.commit();
  },

  async getUnreadCount(userId: string): Promise<number> {
    const db = getFirestoreDb();
    const q = query(collection(db, COLLECTION), where('targetUserId', '==', userId), where('read', '==', false));
    const snapshot = await getDocs(q);
    return snapshot.size;
  },
};
