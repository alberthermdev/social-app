import { Message, MessageType, MessageStatus } from '@/features/messages/domain/entities';

export interface IMessageRepository {
  getMessages(chatId: string): Promise<Message[]>;
  sendMessage(
    chatId: string,
    senderId: string,
    content: string,
    type?: MessageType,
    metadata?: Record<string, unknown>,
  ): Promise<void>;
  subscribeToMessages(chatId: string, callback: (messages: Message[]) => void): () => void;
  updateMessageStatus(chatId: string, messageId: string, status: MessageStatus): Promise<void>;
  markMessagesAsRead(chatId: string, userId: string): Promise<void>;
}
