import type { AppNotification } from './entities';

export interface INotificationRepository {
  subscribeToNotifications(userId: string, onUpdate: (notifications: AppNotification[]) => void): () => void;
  markAsRead(notificationId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
  getUnreadCount(userId: string): Promise<number>;
}
