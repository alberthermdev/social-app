import { IChatRepository } from '@/features/chats/domain/IChatRepository';
import { Chat } from '@/features/chats/domain/entities';

export function createChatUseCases(repository: IChatRepository) {
  return {
    getChats: (userId: string): Promise<Chat[]> => repository.getChats(userId),
    getChatById: (chatId: string): Promise<Chat | null> => repository.getChatById(chatId),
    createChat: (participants: string[]): Promise<string> => repository.createChat(participants),
    getOrCreateChat: (userId1: string, userId2: string): Promise<string> =>
      repository.getOrCreateChat(userId1, userId2),
  };
}

export type ChatUseCases = ReturnType<typeof createChatUseCases>;
