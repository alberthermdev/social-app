import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { useTranslation } from 'react-i18next';
import { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FirestoreMessageRepository } from '@/features/messages/infrastructure/FirestoreMessageRepository';
import { FirestoreChatRepository } from '@/features/chats/infrastructure/FirestoreChatRepository';
import { Message } from '@/features/messages/domain/entities';
import { useAuthStore } from '@/app/stores/authStore';
import { useTheme } from '@/shared/hooks/useTheme';
import { InputBar } from '@/shared/components/chat/InputBar';
import { MessageBubble } from '@/shared/components/chat/MessageBubble';
import { LoadingScreen } from '@/shared/components/feedback/LoadingScreen';
import { spacing, fontSize } from '@/shared/theme/spacing';
import { MainStackParamList } from '@/app/navigation/types';

type Props = {
  route: RouteProp<MainStackParamList, 'ChatDetail'>;
};

export function ChatScreen({ route }: Props) {
  const { t } = useTranslation();
  const c = useTheme();
  const { chatId } = route.params;
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: c.surface },
        container: { flex: 1, backgroundColor: c.surface },
        messageList: { flex: 1 },
        messageListContent: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
        emptyMessages: { flex: 1, justifyContent: 'center', alignItems: 'center' },
        emptyText: { color: c.textSecondary, fontSize: fontSize.md },
      }),
    [c],
  );

  useEffect(() => {
    const unsubscribe = FirestoreMessageRepository.subscribeToMessages(chatId, (msgs) => {
      setMessages(msgs);
      setLoading(false);
    });
    return unsubscribe;
  }, [chatId]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!user || !text.trim() || sending) return;
      setSending(true);
      try {
        await FirestoreMessageRepository.sendMessage(chatId, user.id, text.trim());
        await FirestoreChatRepository.updateLastMessage(chatId, text.trim(), user.id);
      } catch {
        // Error handled by UI feedback
      } finally {
        setSending(false);
      }
    },
    [user, chatId, sending],
  );

  if (loading) return <LoadingScreen />;

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} isOwn={item.senderId === user?.id} />}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          ListEmptyComponent={
            <View style={styles.emptyMessages}>
              <AppText style={styles.emptyText} maxFontSizeMultiplier={1.3}>
                {t('chats.startChatting')}
              </AppText>
            </View>
          }
        />
        <InputBar onSend={handleSend} sending={sending} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
