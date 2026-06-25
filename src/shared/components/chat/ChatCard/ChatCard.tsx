import { memo, useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { useTheme } from '@/shared/hooks/useTheme';
import { useChatsStore } from '@/app/stores/chatsStore';
import type { ChatWithUser } from '@/features/chats/domain/entities';
import { Avatar } from '@/shared/components/ui/Avatar';
import { AppText } from '@/shared/components/ui/AppText';
import { UnreadBadge } from '@/shared/components/chat/UnreadBadge';
import { TypingIndicator } from '@/shared/components/chat/TypingIndicator';
import { formatChatListTime } from '@/shared/utils/date';
import { styles } from './styles';

interface ChatCardProps {
  chat: ChatWithUser;
  currentUserId: string;
  onPress: (chat: ChatWithUser) => void;
}

function getMessagePreview(chat: ChatWithUser, currentUserId: string): { text: string; isSystem: boolean } {
  if (chat.lastMessageType === 'image') return { text: '🖼️ Foto', isSystem: false };
  if (chat.lastMessageType === 'audio') return { text: '🎤 Audio', isSystem: false };
  if (chat.lastMessageType === 'video') return { text: '📹 Video', isSystem: false };
  if (chat.lastMessageType === 'document') return { text: '📄 Documento', isSystem: false };
  if (chat.lastSenderId === currentUserId) return { text: `Tú: ${chat.lastMessage}`, isSystem: false };
  return { text: chat.lastMessage, isSystem: false };
}

function DeliveryIcon({ status }: { status?: 'sent' | 'delivered' | 'read' }) {
  const c = useTheme();
  if (!status) return null;
  const color = status === 'read' ? c.primary : c.textTertiary;
  if (status === 'sent') return <Ionicons name="checkmark" size={14} color={color} />;
  return <Ionicons name="checkmark-done" size={14} color={color} />;
}

function ChatCardInner({ chat, currentUserId, onPress }: ChatCardProps) {
  const c = useTheme();

  const togglePin = useChatsStore((s) => s.togglePin);
  const toggleArchive = useChatsStore((s) => s.toggleArchive);
  const toggleMute = useChatsStore((s) => s.toggleMute);
  const toggleFavorite = useChatsStore((s) => s.toggleFavorite);
  const markAsRead = useChatsStore((s) => s.markAsRead);

  const isPinned = chat.pinnedBy.includes(currentUserId);
  const isMuted = chat.mutedBy.includes(currentUserId);
  const isFavorite = chat.favoriteBy.includes(currentUserId);
  const unread = chat.unreadCount[currentUserId] || 0;
  const isTyping = chat.typingUsers.length > 0 && !chat.typingUsers.includes(currentUserId);
  const isRecording = chat.isRecording.length > 0 && !chat.isRecording.includes(currentUserId);
  const isLastFromMe = chat.lastSenderId === currentUserId;

  const preview = getMessagePreview(chat, currentUserId);
  const avatarSize = chat.isGroup ? 'md' : 'md';

  const handlePress = useCallback(() => {
    if (unread > 0) markAsRead(chat.id, currentUserId);
    onPress(chat);
  }, [chat, currentUserId, unread, markAsRead, onPress]);

  const renderRightActions = () => (
    <View style={styles.swipeContainer}>
      <TouchableOpacity
        style={[styles.swipeBtn, { backgroundColor: '#3BA55D' }]}
        onPress={() => togglePin(chat.id, currentUserId)}
      >
        <Ionicons name="pin" size={22} color="#FFF" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.swipeBtn, { backgroundColor: '#FEE75C' }]}
        onPress={() => toggleFavorite(chat.id, currentUserId)}
      >
        <Ionicons name="star" size={22} color="#FFF" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.swipeBtn, { backgroundColor: '#ED4245' }]}
        onPress={() => toggleArchive(chat.id, currentUserId)}
      >
        <Ionicons name="archive" size={22} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

  const renderLeftActions = () => (
    <View style={styles.swipeContainer}>
      <TouchableOpacity
        style={[styles.swipeBtn, { backgroundColor: '#ED4245' }]}
        onPress={() => useChatsStore.getState().deleteChat(chat.id)}
      >
        <Ionicons name="trash" size={22} color="#FFF" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.swipeBtn, { backgroundColor: '#5865F2' }]}
        onPress={() => toggleMute(chat.id, currentUserId)}
      >
        <Ionicons name={isMuted ? 'volume-high' : 'volume-mute'} size={22} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      overshootRight={false}
      overshootLeft={false}
    >
      <TouchableOpacity
        style={[styles.container, { backgroundColor: c.background }]}
        onPress={handlePress}
        onLongPress={handlePress}
        activeOpacity={0.6}
        accessibilityLabel={`${chat.otherUserName}, ${unread > 0 ? `${unread} mensajes sin leer` : ''}`}
      >
        <View style={styles.avatarWrap}>
          {chat.isGroup ? (
            <View style={[styles.groupAvatar, { backgroundColor: c.primary }]}>
              <Ionicons name="people" size={avatarSize === 'md' ? 20 : 24} color="#FFF" />
            </View>
          ) : (
            <>
              <Avatar photoURL={chat.otherUserPhoto} name={chat.otherUserName} size="md" />
              <View
                style={[
                  styles.onlineDot,
                  { backgroundColor: chat.otherUserOnline ? '#3BA55D' : '#747F8D', borderColor: c.background },
                ]}
              />
            </>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.topRow}>
            <AppText style={[styles.name, { color: c.text }]} numberOfLines={1} weight="semiBold">
              {chat.otherUserName}
              {chat.isGroup && chat.lastMessageSenderName ? ` (${chat.lastMessageSenderName})` : ''}
            </AppText>
            <View style={styles.timeRow}>
              {isLastFromMe && <DeliveryIcon status={chat.lastMessageStatus} />}
              <AppText style={[styles.time, { color: unread > 0 ? c.primary : c.textTertiary }]}>
                {formatChatListTime(chat.lastMessageAt)}
              </AppText>
            </View>
          </View>

          <View style={styles.bottomRow}>
            {isTyping || isRecording ? (
              <TypingIndicator name={chat.otherUserName} isRecording={isRecording} />
            ) : (
              <AppText
                style={[styles.message, { color: preview.isSystem ? c.primary : c.textSecondary }]}
                numberOfLines={1}
              >
                {preview.text}
              </AppText>
            )}

            <View style={styles.badges}>
              {isPinned && <Ionicons name="pin" size={14} color={c.textTertiary} style={styles.badgeIcon} />}
              {isMuted && <Ionicons name="volume-mute" size={14} color={c.textTertiary} style={styles.badgeIcon} />}
              {isFavorite && <Ionicons name="star" size={14} color="#FEE75C" style={styles.badgeIcon} />}
              <UnreadBadge count={unread} muted={isMuted} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

export const ChatCard = memo(ChatCardInner);
