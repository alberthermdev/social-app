import { memo, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { ChatWithUser } from '@/features/chats/domain/entities';
import { Avatar } from '@/shared/components/ui/Avatar';
import { useTheme } from '@/shared/hooks/useTheme';
import { formatChatListTime } from '@/shared/utils/date';
import { createStyles } from './styles';

interface ChatItemProps {
  chat: ChatWithUser;
  currentUserId: string;
  onPress: (chatId: string) => void;
  onLongPress?: (chat: ChatWithUser) => void;
}

function getMessagePreview(type: string, content: string): string {
  switch (type) {
    case 'image':
      return '📷 Foto';
    case 'audio':
      return '🎤 Mensaje de voz';
    case 'video':
      return '🎥 Video';
    case 'document':
      return '📄 Documento';
    default:
      return content;
  }
}

export const ChatItem = memo(function ChatItem({ chat, currentUserId, onPress, onLongPress }: ChatItemProps) {
  const { t } = useTranslation();
  const c = useTheme();
  const isPinned = chat.pinnedBy.includes(currentUserId);
  const isMuted = chat.mutedBy.includes(currentUserId);
  const isFavorite = chat.favoriteBy.includes(currentUserId);
  const unread = chat.unreadCount?.[currentUserId] || 0;

  const styles = useMemo(() => createStyles(c), [c]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(chat.id)}
      onLongPress={() => onLongPress?.(chat)}
      activeOpacity={0.7}
    >
      <Avatar
        photoURL={chat.otherUserPhoto}
        name={chat.otherUserName}
        size="lg"
        online={chat.otherUserOnline}
        showStatus
      />
      <View style={styles.info}>
        <View style={styles.topRow}>
          <View style={styles.nameRow}>
            {isPinned && <Ionicons name="pin" size={14} color={c.textTertiary} style={styles.icon} />}
            {isFavorite && <Ionicons name="star" size={14} color={c.warning} style={styles.icon} />}
            {isMuted && <Ionicons name="volume-mute" size={14} color={c.textTertiary} style={styles.icon} />}
            <AppText style={styles.name} weight="semiBold" numberOfLines={1} maxFontSizeMultiplier={1.3}>
              {chat.otherUserName}
            </AppText>
          </View>
          <AppText style={styles.time} maxFontSizeMultiplier={1.3}>
            {formatChatListTime(chat.lastMessageAt)}
          </AppText>
        </View>
        <View style={styles.bottomRow}>
          <AppText
            style={[styles.message, unread > 0 && styles.messageUnread]}
            weight={unread > 0 ? 'semiBold' : undefined}
            numberOfLines={1}
            maxFontSizeMultiplier={1.3}
          >
            {chat.lastMessage ? getMessagePreview('text', chat.lastMessage) : t('chats.noMessages')}
          </AppText>
          {unread > 0 && (
            <View style={styles.badge}>
              <AppText style={styles.badgeText} weight="bold" maxFontSizeMultiplier={1.3}>
                {unread > 99 ? '99+' : unread}
              </AppText>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});
