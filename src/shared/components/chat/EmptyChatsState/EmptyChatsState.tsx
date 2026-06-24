import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import { Button } from '@/shared/components/ui/Button';
import { AppText } from '@/shared/components/ui/AppText';
import { styles } from './styles';

interface EmptyChatsStateProps {
  onStartChat?: () => void;
}

export function EmptyChatsState({ onStartChat }: EmptyChatsStateProps) {
  const c = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <View style={[styles.iconWrap, { backgroundColor: c.surface }]}>
        <Ionicons name="chatbubbles-outline" size={48} color={c.textTertiary} />
      </View>
      <AppText style={[styles.title, { color: c.text }]} weight="bold">
        {t('chats.noChats')}
      </AppText>
      <AppText style={[styles.description, { color: c.textSecondary }]}>{t('chats.noChatsDescription')}</AppText>
      {onStartChat && (
        <Button
          title={t('chats.startChatting')}
          onPress={onStartChat}
          variant="primary"
          size="md"
          style={styles.button}
        />
      )}
    </View>
  );
}
