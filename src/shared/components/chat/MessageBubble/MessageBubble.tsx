import { useMemo } from 'react';
import { View } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { Message } from '@/features/messages/domain/entities';
import { useTheme } from '@/shared/hooks/useTheme';
import { formatMessageTime } from '@/shared/utils/date';
import { createStyles } from './styles';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const c = useTheme();
  const styles = useMemo(() => createStyles(c, isOwn), [c, isOwn]);

  return (
    <View style={[styles.container, isOwn ? styles.ownContainer : styles.otherContainer]}>
      <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
        <AppText style={styles.text} maxFontSizeMultiplier={1.3}>
          {message.content}
        </AppText>
        <AppText style={styles.time} maxFontSizeMultiplier={1.3}>
          {formatMessageTime(message.createdAt)}
        </AppText>
      </View>
    </View>
  );
}
