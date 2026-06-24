import { Chat } from '@/features/chats/domain/entities';

export interface IChatRepository {
  getChats(userId: string): Promise<Chat[]>;
  getChatById(chatId: string): Promise<Chat | null>;
  createChat(participants: string[]): Promise<string>;
  getOrCreateChat(userId1: string, userId2: string): Promise<string>;
  updateLastMessage(chatId: string, message: string, senderId: string): Promise<void>;
  subscribeToChats(userId: string, callback: (chats: Chat[]) => void): () => void;

  togglePinned(chatId: string, userId: string): Promise<void>;
  toggleMuted(chatId: string, userId: string): Promise<void>;
  toggleArchived(chatId: string, userId: string): Promise<void>;
  toggleFavorite(chatId: string, userId: string): Promise<void>;

  updateTypingStatus(chatId: string, userId: string, isTyping: boolean): Promise<void>;
  markAsRead(chatId: string, userId: string): Promise<void>;
}
