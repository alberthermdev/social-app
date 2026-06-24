import { IMessageRepository } from '@/features/messages/domain/IMessageRepository';
import { Message } from '@/features/messages/domain/entities';

export function createMessageUseCases(repository: IMessageRepository) {
  return {
    getMessages: (chatId: string): Promise<Message[]> => repository.getMessages(chatId),
    sendMessage: (chatId: string, senderId: string, content: string): Promise<void> =>
      repository.sendMessage(chatId, senderId, content),
  };
}

export type MessageUseCases = ReturnType<typeof createMessageUseCases>;
