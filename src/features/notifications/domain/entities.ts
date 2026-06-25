export interface AppNotification {
  id: string;
  type: 'message' | 'contact_request' | 'system';
  title: string;
  body: string;
  senderId?: string;
  senderName?: string;
  senderPhoto?: string | null;
  chatId?: string;
  read: boolean;
  createdAt: number;
}
