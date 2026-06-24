import { ContactUser } from '@/features/contacts/domain/entities';

export interface IContactRepository {
  searchUsers(query: string, excludeUserId: string): Promise<ContactUser[]>;
  getAllUsers(excludeUserId: string): Promise<ContactUser[]>;
  getUserById(userId: string): Promise<ContactUser | null>;
}
