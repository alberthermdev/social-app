import { useState, useEffect, useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/app/stores/authStore';
import { useChatsStore, getFilteredChats } from '@/app/stores/chatsStore';
import type { ChatWithUser } from '@/features/chats/domain/entities';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';
import { useConnectivity } from '@/shared/hooks/useConnectivity';
import { useTheme } from '@/shared/hooks/useTheme';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, MainTabParamList } from '@/app/navigation/types';
import {
  HomeHeader,
  SearchBar,
  FilterChips,
  ChatCard,
  PinnedChatsSection,
  FloatingChatButton,
  EmptyChatsState,
  ChatsSkeleton,
  SearchUsersModal,
} from '@/shared/components/chat';
import { ConnectivityBanner } from '@/shared/components/feedback/ConnectivityBanner';
import { ErrorView } from '@/shared/components/feedback/ErrorView';

type Props = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList, 'Chats'>,
    NativeStackNavigationProp<MainStackParamList>
  >;
};

export function ChatsListScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const c = useTheme();
  const user = useAuthStore((s) => s.user);
  const chats = useChatsStore((s) => s.chats);
  const loading = useChatsStore((s) => s.loading);
  const error = useChatsStore((s) => s.error);
  const activeFilter = useChatsStore((s) => s.activeFilter);
  const searchQuery = useChatsStore((s) => s.searchQuery);
  const subscribe = useChatsStore((s) => s.subscribe);
  const clearError = useChatsStore((s) => s.clearError);

  const { isConnected } = useConnectivity();
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  useOnlineStatus();

  useEffect(() => {
    if (!user?.id) return;
    const unsub = subscribe(user.id);
    return () => unsub();
  }, [user?.id, subscribe]);

  const currentUserId = user?.id || '';

  const filteredChats = useMemo(
    () => getFilteredChats(chats, activeFilter, currentUserId, searchQuery),
    [chats, activeFilter, currentUserId, searchQuery],
  );

  const pinnedChats = useMemo(
    () => filteredChats.filter((c) => c.pinnedBy.includes(currentUserId)),
    [filteredChats, currentUserId],
  );

  const regularChats = useMemo(
    () => filteredChats.filter((c) => !c.pinnedBy.includes(currentUserId)),
    [filteredChats, currentUserId],
  );

  const handleChatPress = useCallback(
    (chat: ChatWithUser) => {
      navigation.navigate('ChatDetail', {
        chatId: chat.id,
        otherUserName: chat.otherUserName,
        otherUserPhoto: chat.otherUserPhoto,
        otherUserOnline: chat.otherUserOnline,
      });
    },
    [navigation],
  );

  const handleProfilePress = useCallback(() => {
    navigation.navigate('Profile');
  }, [navigation]);

  const handleNotificationPress = useCallback(() => {
    navigation.navigate('NotificationsList');
  }, [navigation]);

  const handleNewChat = useCallback(() => {
    setSearchModalVisible(true);
  }, []);

  const handleRetry = useCallback(() => {
    clearError();
    if (!user?.id) return;
    subscribe(user.id);
  }, [user?.id, subscribe, clearError]);

  const headerComponent = useMemo(
    () => (
      <>
        {!isConnected && <ConnectivityBanner />}
        <HomeHeader
          onAvatarPress={handleProfilePress}
          onSettingsPress={handleProfilePress}
          onNotificationPress={handleNotificationPress}
        />
        <SearchBar onChatPress={handleChatPress} />
        <FilterChips />
        {pinnedChats.length > 0 && (
          <PinnedChatsSection chats={pinnedChats} currentUserId={currentUserId} onChatPress={handleChatPress} />
        )}
      </>
    ),
    [isConnected, pinnedChats, currentUserId, handleChatPress, handleProfilePress, handleNotificationPress],
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: c.background }]}>
        <ConnectivityBanner />
        <HomeHeader
          onAvatarPress={handleProfilePress}
          onSettingsPress={handleProfilePress}
          onNotificationPress={handleNotificationPress}
        />
        <ChatsSkeleton />
      </View>
    );
  }

  if (error && filteredChats.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: c.background }]}>
        <ConnectivityBanner />
        <HomeHeader
          onAvatarPress={handleProfilePress}
          onSettingsPress={handleProfilePress}
          onNotificationPress={handleNotificationPress}
        />
        <ErrorView message={t('common.error')} onRetry={handleRetry} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <FlatList
        data={regularChats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatCard chat={item} currentUserId={currentUserId} onPress={handleChatPress} />}
        ListHeaderComponent={headerComponent}
        ListEmptyComponent={!loading ? <EmptyChatsState onStartChat={handleNewChat} /> : null}
        contentContainerStyle={[styles.listContent, regularChats.length === 0 && { flex: 1 }]}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              if (!user?.id) return;
              subscribe(user.id);
            }}
            tintColor={c.primary}
            colors={[c.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews={true}
      />
      <FloatingChatButton
        onNewChat={handleNewChat}
        onNewGroup={() => {}}
        onSearchUser={() => setSearchModalVisible(true)}
      />
      <SearchUsersModal visible={searchModalVisible} onClose={() => setSearchModalVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
});
