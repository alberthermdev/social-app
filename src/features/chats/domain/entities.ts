export interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: number;
  lastSenderId: string;
  lastMessageType?: 'text' | 'image' | 'audio' | 'video' | 'document';
  lastMessageStatus?: 'sent' | 'delivered' | 'read';
  createdAt: number;
  pinnedBy: string[];
  mutedBy: string[];
  archivedBy: string[];
  favoriteBy: string[];
  typingUsers: string[];
  isRecording: string[];
  unreadCount: Record<string, number>;
  isGroup: boolean;
  groupName?: string;
  groupPhoto?: string;
  lastMessageSenderName?: string;
  category?: 'personal' | 'work' | 'family';
}

export interface ChatWithUser extends Chat {
  otherUserName: string;
  otherUserPhoto: string | null;
  otherUserOnline: boolean;
  otherUserLastSeen: number;
}
