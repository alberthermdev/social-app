import { AuthUser } from '@/features/auth/domain/entities';
import {
  ProfileUpdate,
  UserSettings,
  PrivacySettings,
  NotificationSettings,
  UserStats,
  ActiveSession,
} from '@/features/profile/domain/entities';

export interface IProfileRepository {
  updateProfile(userId: string, data: ProfileUpdate): Promise<void>;
  uploadAvatar(userId: string, uri: string): Promise<string>;
  deleteAvatar(userId: string): Promise<void>;
  getProfile(userId: string): Promise<AuthUser | null>;

  getUserSettings(userId: string): Promise<UserSettings | null>;
  updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<void>;

  getPrivacySettings(userId: string): Promise<PrivacySettings | null>;
  updatePrivacySettings(userId: string, settings: Partial<PrivacySettings>): Promise<void>;

  getNotificationSettings(userId: string): Promise<NotificationSettings | null>;
  updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>): Promise<void>;

  getUserStats(userId: string): Promise<UserStats | null>;

  blockUser(userId: string, blockedUserId: string): Promise<void>;
  unblockUser(userId: string, blockedUserId: string): Promise<void>;
  getBlockedUsers(userId: string): Promise<string[]>;

  deleteAccount(userId: string): Promise<void>;
  clearCache(): Promise<number>;
  exportData(userId: string): Promise<void>;

  isUsernameAvailable(username: string): Promise<boolean>;
  setUsername(userId: string, username: string): Promise<void>;

  getActiveSessions(userId: string): Promise<ActiveSession[]>;
  revokeSession(userId: string, sessionId: string): Promise<void>;
}
