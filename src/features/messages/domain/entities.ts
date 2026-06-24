export type MessageType = 'text' | 'image' | 'audio' | 'video' | 'document';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: MessageType;
  createdAt: number;
  status: MessageStatus;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    thumbnail?: string;
    duration?: number;
  };
}
