import { useMemo } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/shared/components/ui/AppText';
import type { Message } from '@/features/messages/domain/entities';
import { useTheme } from '@/shared/hooks/useTheme';
import { formatMessageTime } from '@/shared/utils/date';
import { createStyles } from './styles';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showSenderName?: boolean;
  senderName?: string;
}

export function MessageBubble({ message, isOwn, showSenderName, senderName }: MessageBubbleProps) {
  const c = useTheme();
  const styles = useMemo(() => createStyles(c, isOwn), [c, isOwn]);

  const statusIcon =
    message.status === 'read' ? 'checkmark-done' : message.status === 'delivered' ? 'checkmark-done' : 'checkmark';
  const statusColor = message.status === 'read' ? c.primary : c.textTertiary;

  return (
    <View style={[styles.container, isOwn ? styles.ownContainer : styles.otherContainer]}>
      <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
        {showSenderName && senderName && (
          <AppText style={styles.senderName} weight="semiBold" maxFontSizeMultiplier={1.3}>
            {senderName}
          </AppText>
        )}
        <AppText style={styles.text} maxFontSizeMultiplier={1.3}>
          {message.content}
        </AppText>
        <View style={styles.footer}>
          <AppText style={styles.time} maxFontSizeMultiplier={1.3}>
            {formatMessageTime(message.createdAt)}
          </AppText>
          {isOwn && <Ionicons name={statusIcon} size={12} color={statusColor} style={{ marginLeft: 3 }} />}
        </View>
      </View>
    </View>
  );
}
