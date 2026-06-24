import { IContactRepository } from '@/features/contacts/domain/IContactRepository';
import { ContactUser } from '@/features/contacts/domain/entities';

export function createContactUseCases(repository: IContactRepository) {
  return {
    searchUsers: (query: string, excludeUserId: string): Promise<ContactUser[]> =>
      repository.searchUsers(query, excludeUserId),
    getAllUsers: (excludeUserId: string): Promise<ContactUser[]> => repository.getAllUsers(excludeUserId),
    getUserById: (userId: string): Promise<ContactUser | null> => repository.getUserById(userId),
  };
}

export type ContactUseCases = ReturnType<typeof createContactUseCases>;
