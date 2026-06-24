import { IProfileRepository } from '@/features/profile/domain/IProfileRepository';
import { ProfileUpdate, UserSettings, PrivacySettings, NotificationSettings } from '@/features/profile/domain/entities';

export function createProfileUseCases(repository: IProfileRepository) {
  return {
    updateProfile: (userId: string, data: ProfileUpdate) => repository.updateProfile(userId, data),
    uploadAvatar: (userId: string, uri: string) => repository.uploadAvatar(userId, uri),
    deleteAvatar: (userId: string) => repository.deleteAvatar(userId),
    getProfile: (userId: string) => repository.getProfile(userId),

    getUserSettings: (userId: string) => repository.getUserSettings(userId),
    updateUserSettings: (userId: string, settings: Partial<UserSettings>) =>
      repository.updateUserSettings(userId, settings),

    getPrivacySettings: (userId: string) => repository.getPrivacySettings(userId),
    updatePrivacySettings: (userId: string, settings: Partial<PrivacySettings>) =>
      repository.updatePrivacySettings(userId, settings),

    getNotificationSettings: (userId: string) => repository.getNotificationSettings(userId),
    updateNotificationSettings: (userId: string, settings: Partial<NotificationSettings>) =>
      repository.updateNotificationSettings(userId, settings),

    getUserStats: (userId: string) => repository.getUserStats(userId),

    blockUser: (userId: string, blockedUserId: string) => repository.blockUser(userId, blockedUserId),
    unblockUser: (userId: string, blockedUserId: string) => repository.unblockUser(userId, blockedUserId),
    getBlockedUsers: (userId: string) => repository.getBlockedUsers(userId),

    deleteAccount: (userId: string) => repository.deleteAccount(userId),
    clearCache: () => repository.clearCache(),
    exportData: (userId: string) => repository.exportData(userId),

    isUsernameAvailable: (username: string) => repository.isUsernameAvailable(username),
    setUsername: (userId: string, username: string) => repository.setUsername(userId, username),

    getActiveSessions: (userId: string) => repository.getActiveSessions(userId),
    revokeSession: (userId: string, sessionId: string) => repository.revokeSession(userId, sessionId),
  };
}

export type ProfileUseCases = ReturnType<typeof createProfileUseCases>;
