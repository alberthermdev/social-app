export interface ProfileUpdate {
  name?: string;
  about?: string;
  photoURL?: string | null;
  username?: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  textSize: 'small' | 'normal' | 'large';
  reducedAnimations: boolean;
  language: string;
  enterToSend: boolean;
  autoDownloadImages: boolean;
  autoDownloadVideos: boolean;
  showTypingIndicators: boolean;
  showReadReceipts: boolean;
  autoSaveMedia: boolean;
}

export interface PrivacySettings {
  lastSeen: 'everyone' | 'contacts' | 'nobody';
  profilePhoto: 'everyone' | 'contacts' | 'nobody';
  about: 'everyone' | 'contacts' | 'nobody';
  readReceipts: boolean;
  blockedUsers: string[];
}

export interface NotificationSettings {
  messages: boolean;
  sound: boolean;
  vibration: boolean;
  popup: boolean;
  groupNotifications: boolean;
}

export interface UserStats {
  totalChats: number;
  messagesSent: number;
  messagesReceived: number;
  photosShared: number;
  audioSent: number;
  appUsageDays: number;
}

export interface ActiveSession {
  id: string;
  device: string;
  location: string;
  lastActive: number;
  current: boolean;
}
