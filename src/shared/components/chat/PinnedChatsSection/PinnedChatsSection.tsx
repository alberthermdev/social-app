import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import type { ChatWithUser } from '@/features/chats/domain/entities';
import { ChatCard } from '@/shared/components/chat/ChatCard';
import { AppText } from '@/shared/components/ui/AppText';
import { styles } from './styles';

interface PinnedChatsSectionProps {
  chats: ChatWithUser[];
  currentUserId: string;
  onChatPress: (chat: ChatWithUser) => void;
}

export function PinnedChatsSection({ chats, currentUserId, onChatPress }: PinnedChatsSectionProps) {
  const c = useTheme();
  const { t } = useTranslation();
  if (chats.length === 0) return null;

  return (
    <View style={[styles.container, { borderBottomColor: c.border }]}>
      <View style={styles.header}>
        <Ionicons name="pin" size={16} color={c.textSecondary} />
        <AppText style={[styles.title, { color: c.textSecondary }]} weight="semiBold">
          {t('chats.pinnedChats')}
        </AppText>
      </View>
      {chats.map((chat) => (
        <ChatCard key={chat.id} chat={chat} currentUserId={currentUserId} onPress={onChatPress} />
      ))}
    </View>
  );
}
