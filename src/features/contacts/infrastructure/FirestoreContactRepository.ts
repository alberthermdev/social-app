import { collection, query, where, getDocs, getDoc, doc, orderBy, limit } from 'firebase/firestore';
import { getFirestoreDb } from '@/core/firebase';
import { IContactRepository } from '@/features/contacts/domain/IContactRepository';
import { ContactUser } from '@/features/contacts/domain/entities';
import { COLLECTIONS } from '@/shared/constants';

export const FirestoreContactRepository: IContactRepository = {
  searchUsers: async (searchQuery: string, excludeUserId: string): Promise<ContactUser[]> => {
    const db = getFirestoreDb();
    const q = query(
      collection(db, COLLECTIONS.USERS),
      where('name', '>=', searchQuery),
      where('name', '<=', searchQuery + '\uf8ff'),
      orderBy('name'),
      limit(20),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as ContactUser).filter((u) => u.id !== excludeUserId);
  },

  getAllUsers: async (excludeUserId: string): Promise<ContactUser[]> => {
    const db = getFirestoreDb();
    const q = query(collection(db, COLLECTIONS.USERS), orderBy('name'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as ContactUser).filter((u) => u.id !== excludeUserId);
  },

  getUserById: async (userId: string): Promise<ContactUser | null> => {
    const db = getFirestoreDb();
    const docRef = await getDoc(doc(db, COLLECTIONS.USERS, userId));
    if (!docRef.exists()) return null;
    return { id: docRef.id, ...docRef.data() } as ContactUser;
  },
};
