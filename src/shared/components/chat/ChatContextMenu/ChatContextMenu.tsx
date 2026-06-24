import { Modal, View, TouchableOpacity, useWindowDimensions } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { ChatWithUser } from '@/features/chats/domain/entities';
import { useTheme } from '@/shared/hooks/useTheme';
import { styles } from './styles';

interface ChatContextMenuProps {
  visible: boolean;
  chat: ChatWithUser | null;
  currentUserId: string;
  onClose: () => void;
  onTogglePin: (chatId: string) => void;
  onToggleMute: (chatId: string) => void;
  onToggleArchive: (chatId: string) => void;
  onToggleFavorite: (chatId: string) => void;
  onMarkRead: (chatId: string) => void;
}

export function ChatContextMenu({
  visible,
  chat,
  currentUserId,
  onClose,
  onTogglePin,
  onToggleMute,
  onToggleArchive,
  onToggleFavorite,
  onMarkRead,
}: ChatContextMenuProps) {
  const { t } = useTranslation();
  const c = useTheme();
  const { width } = useWindowDimensions();

  if (!chat) return null;

  const isPinned = chat.pinnedBy.includes(currentUserId);
  const isMuted = chat.mutedBy.includes(currentUserId);
  const isArchived = chat.archivedBy.includes(currentUserId);
  const isFavorite = chat.favoriteBy.includes(currentUserId);
  const unread = chat.unreadCount?.[currentUserId] || 0;

  const items: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }[] = [
    {
      icon: isPinned ? 'pin' : 'pin-outline',
      label: isPinned ? t('chats.unpin') : t('chats.pin'),
      onPress: () => {
        onTogglePin(chat.id);
        onClose();
      },
    },
    {
      icon: isMuted ? 'volume-mute' : 'volume-high-outline',
      label: isMuted ? t('chats.unmute') : t('chats.mute'),
      onPress: () => {
        onToggleMute(chat.id);
        onClose();
      },
    },
    {
      icon: isFavorite ? 'star' : 'star-outline',
      label: isFavorite ? t('chats.unfavorite') : t('chats.favorite'),
      onPress: () => {
        onToggleFavorite(chat.id);
        onClose();
      },
    },
    {
      icon: 'archive-outline',
      label: isArchived ? t('chats.unarchive') : t('chats.archive'),
      onPress: () => {
        onToggleArchive(chat.id);
        onClose();
      },
    },
  ];

  if (unread > 0) {
    items.unshift({
      icon: 'checkmark-done',
      label: t('chats.markRead'),
      onPress: () => {
        onMarkRead(chat.id);
        onClose();
      },
    });
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={[styles.menu, { backgroundColor: c.surface, width: Math.min(300, width * 0.85) }]}>
          <AppText
            style={[styles.title, { color: c.text }]}
            weight="semiBold"
            numberOfLines={1}
            maxFontSizeMultiplier={1.3}
          >
            {chat.otherUserName}
          </AppText>
          <View style={[styles.divider, { borderBottomColor: c.border }]} />
          {items.map((item) => (
            <TouchableOpacity key={item.label} style={styles.item} onPress={item.onPress}>
              <Ionicons name={item.icon} size={20} color={c.textSecondary} />
              <AppText style={[styles.itemLabel, { color: c.text }]} maxFontSizeMultiplier={1.3}>
                {item.label}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
