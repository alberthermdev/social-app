import { useState, useEffect, useCallback, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@/shared/hooks/useTheme';
import { useAuthStore } from '@/app/stores/authStore';
import { FirestoreNotificationRepository } from '@/features/notifications/infrastructure/FirestoreNotificationRepository';
import { AppText } from '@/shared/components/ui/AppText';
import { Avatar } from '@/shared/components/ui/Avatar';
import type { AppNotification } from '@/features/notifications/domain/entities';
import type { MainStackParamList } from '@/app/navigation/types';
import { spacing, fontSize } from '@/shared/theme/spacing';

export function NotificationsListScreen() {
  const { t } = useTranslation();
  const c = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const user = useAuthStore((s) => s.user);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: c.background },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          borderBottomWidth: 0.5,
          borderBottomColor: c.border,
          backgroundColor: c.background,
        },
        headerTitle: { fontSize: fontSize.lg, color: c.text },
        markAllBtn: { padding: spacing.xs },
        markAllText: { fontSize: fontSize.sm, color: c.primary },
        unreadBg: { backgroundColor: c.surface },
        listContent: { paddingVertical: spacing.sm },
        item: {
          flexDirection: 'row',
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          borderBottomWidth: 0.5,
          borderBottomColor: c.border,
        },
        unread: { backgroundColor: c.surface },
        itemAvatar: { marginRight: spacing.md },
        itemContent: { flex: 1 },
        itemTitle: { fontSize: fontSize.md, color: c.text, marginBottom: 2 },
        itemBody: { fontSize: fontSize.sm, color: c.textSecondary, lineHeight: 18 },
        itemTime: { fontSize: fontSize.xs, color: c.textTertiary, marginTop: spacing.xs },
        emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
        emptyText: { color: c.textSecondary, fontSize: fontSize.md },
      }),
    [c],
  );

  useEffect(() => {
    if (!user?.id) return;
    const unsub = FirestoreNotificationRepository.subscribeToNotifications(user.id, setNotifications);
    return unsub;
  }, [user?.id]);

  const handlePress = useCallback(
    async (notification: AppNotification) => {
      if (!notification.read) {
        await FirestoreNotificationRepository.markAsRead(notification.id);
      }
      if (notification.chatId) {
        navigation.navigate('ChatDetail', { chatId: notification.chatId });
      }
    },
    [navigation],
  );

  const handleMarkAll = useCallback(async () => {
    if (!user?.id) return;
    await FirestoreNotificationRepository.markAllAsRead(user.id);
  }, [user?.id]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshing(false);
  }, []);

  const formatTime = useCallback(
    (timestamp: number) => {
      const diffMs = now - timestamp;
      const mins = Math.floor(diffMs / 60000);
      if (mins < 1) return t('time.justNow');
      if (mins < 60) return t('time.minutes', { count: mins });
      const hours = Math.floor(mins / 60);
      if (hours < 24) return t('time.hours', { count: hours });
      const days = Math.floor(hours / 24);
      if (days === 1) return t('time.yesterday');
      return t('time.days', { count: days });
    },
    [t, now],
  );

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.header}>
        <AppText style={styles.headerTitle} weight="semiBold">
          {t('profile.notifications')}
        </AppText>
        {notifications.some((n) => !n.read) && (
          <TouchableOpacity style={styles.markAllBtn} onPress={handleMarkAll} activeOpacity={0.7}>
            <AppText style={styles.markAllText}> {t('chats.markAllRead') ?? 'Mark all as read'}</AppText>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, !item.read && styles.unread]}
            onPress={() => handlePress(item)}
            activeOpacity={0.7}
          >
            {item.senderPhoto !== undefined && (
              <View style={styles.itemAvatar}>
                <Avatar photoURL={item.senderPhoto} name={item.senderName} size="sm" />
              </View>
            )}
            <View style={styles.itemContent}>
              <AppText style={styles.itemTitle} numberOfLines={1} weight="semiBold">
                {item.title}
              </AppText>
              <AppText style={styles.itemBody} numberOfLines={2}>
                {item.body}
              </AppText>
              <AppText style={styles.itemTime}>{formatTime(item.createdAt)}</AppText>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={[styles.listContent, notifications.length === 0 && { flex: 1 }]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AppText style={styles.emptyText}>{t('chats.noNotifications')}</AppText>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={c.primary} colors={[c.primary]} />
        }
      />
    </SafeAreaView>
  );
}
