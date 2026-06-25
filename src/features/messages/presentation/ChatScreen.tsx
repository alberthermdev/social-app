import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/shared/components/ui/AppText';
import { useTranslation } from 'react-i18next';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { FirestoreMessageRepository } from '@/features/messages/infrastructure/FirestoreMessageRepository';
import { FirestoreChatRepository } from '@/features/chats/infrastructure/FirestoreChatRepository';
import type { Message } from '@/features/messages/domain/entities';
import { useAuthStore } from '@/app/stores/authStore';
import { useTheme } from '@/shared/hooks/useTheme';
import { InputBar } from '@/shared/components/chat/InputBar';
import { MessageBubble } from '@/shared/components/chat/MessageBubble';
import { Avatar } from '@/shared/components/ui/Avatar';
import { LoadingScreen } from '@/shared/components/feedback/LoadingScreen';
import { ConfirmModal } from '@/shared/components/feedback';
import { spacing, fontSize } from '@/shared/theme/spacing';
import { setActiveChatId } from '@/shared/utils/activeChat';
import type { MainStackParamList } from '@/app/navigation/types';

type Props = {
  route: RouteProp<MainStackParamList, 'ChatDetail'>;
};

function shouldShowDateSeparator(current: Message, previous?: Message): boolean {
  if (!previous) return true;
  const currDate = new Date(current.createdAt).toDateString();
  const prevDate = new Date(previous.createdAt).toDateString();
  return currDate !== prevDate;
}

function shouldGroupMessages(current: Message, previous?: Message): boolean {
  if (!previous) return false;
  if (current.senderId !== previous.senderId) return false;
  const diff = current.createdAt - previous.createdAt;
  return diff < 300000;
}

export function ChatScreen({ route }: Props) {
  const { t, i18n } = useTranslation();
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { chatId, otherUserName, otherUserPhoto, otherUserOnline } = route.params;
  const user = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [alert, setAlert] = useState<{ title: string; message: string } | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const messagesLengthRef = useRef(0);
  const initialLoadDone = useRef(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: c.background },
        container: { flex: 1, backgroundColor: c.background },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          paddingTop: insets.top + spacing.sm,
          borderBottomWidth: 0.5,
          borderBottomColor: c.border,
          backgroundColor: c.background,
        },
        headerInfo: { flex: 1, marginLeft: spacing.md },
        headerName: { fontSize: fontSize.md, color: c.text },
        headerStatus: { fontSize: fontSize.xs, color: c.textSecondary, marginTop: 1 },
        backButton: { padding: spacing.xs, marginRight: spacing.xs },
        messageList: { flex: 1 },
        messageListContent: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
        emptyMessages: { flex: 1, justifyContent: 'center', alignItems: 'center' },
        emptyText: { color: c.textSecondary, fontSize: fontSize.md },
        dateSeparator: {
          alignItems: 'center',
          marginVertical: spacing.md,
        },
        dateSeparatorText: {
          fontSize: fontSize.xs,
          color: c.textTertiary,
          backgroundColor: c.background,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs,
          overflow: 'hidden',
        },
      }),
    [c, insets.top],
  );

  useEffect(() => {
    const unsubscribe = FirestoreMessageRepository.subscribeToMessages(chatId, (msgs) => {
      setMessages(msgs);
      setLoading(false);
    });
    return unsubscribe;
  }, [chatId]);

  useEffect(() => {
    if (!loading && !initialLoadDone.current && messages.length > 0) {
      initialLoadDone.current = true;
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 50);
    }
  }, [loading, messages.length]);

  useEffect(() => {
    if (initialLoadDone.current && messages.length > messagesLengthRef.current) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
    messagesLengthRef.current = messages.length;
  }, [messages.length]);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    setActiveChatId(chatId);
    return () => setActiveChatId(null);
  }, [chatId]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!user || !text.trim() || sending) return;
      setSending(true);
      try {
        await FirestoreMessageRepository.sendMessage(chatId, user.id, text.trim());
        await FirestoreChatRepository.updateLastMessage(chatId, text.trim(), user.id);
      } catch {
        setAlert({ title: 'Error', message: 'No se pudo enviar el mensaje' });
      } finally {
        setSending(false);
      }
    },
    [user, chatId, sending],
  );

  const formatDateLabel = useCallback(
    (timestamp: number) => {
      const date = new Date(timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) return t('time.today');
      if (date.toDateString() === yesterday.toDateString()) return t('time.yesterday');
      return date.toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' });
    },
    [t, i18n.language],
  );

  if (loading) return <LoadingScreen />;

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={c.primary} />
        </TouchableOpacity>
        <Avatar photoURL={otherUserPhoto} name={otherUserName || ''} size="sm" online={otherUserOnline} showStatus />
        <View style={styles.headerInfo}>
          <AppText style={styles.headerName} numberOfLines={1} weight="semiBold">
            {otherUserName || t('chat.title')}
          </AppText>
          <AppText style={styles.headerStatus}>{otherUserOnline ? t('time.online') : t('contacts.offline')}</AppText>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View key={item.id}>
              {shouldShowDateSeparator(item, messages[index - 1]) && (
                <View style={styles.dateSeparator}>
                  <AppText style={styles.dateSeparatorText} maxFontSizeMultiplier={1.3}>
                    {formatDateLabel(item.createdAt)}
                  </AppText>
                </View>
              )}
              <MessageBubble
                message={item}
                isOwn={item.senderId === user?.id}
                showSenderName={item.senderId !== user?.id && !shouldGroupMessages(item, messages[index - 1])}
                senderName={item.senderId !== user?.id ? otherUserName : undefined}
              />
            </View>
          )}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
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

      <ConfirmModal visible={!!alert} title={alert?.title} message={alert?.message} onDismiss={() => setAlert(null)} />
    </SafeAreaView>
  );
}
