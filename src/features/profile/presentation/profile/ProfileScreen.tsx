import { useState, useEffect, useCallback, useMemo } from 'react';
import { ScrollView, View, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '@/app/stores/authStore';
import { useTheme } from '@/shared/hooks/useTheme';
import { FirestoreProfileRepository } from '@/features/profile/infrastructure/FirestoreProfileRepository';
import { ProfileHeader, ProfileAvatarMenu } from '@/shared/components/profile';
import * as ImagePicker from 'expo-image-picker';
import { ProfileStackParamList } from '@/app/navigation/types';
import { createStyles } from './styles';

type Nav = NativeStackNavigationProp<ProfileStackParamList>;

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  screen: keyof ProfileStackParamList;
  color?: string;
}

export function ProfileScreen() {
  const { t } = useTranslation();
  const c = useTheme();
  const navigation = useNavigation<Nav>();
  const { user, setUser } = useAuthStore();
  const [avatarMenuVisible, setAvatarMenuVisible] = useState(false);
  const [stats, setStats] = useState<{ label: string; value: string | number; icon: string }[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const styles = useMemo(() => createStyles(c), [c]);

  const menuItems: MenuItem[] = useMemo(
    () => [
      { icon: 'person-outline', label: t('profile.editProfile'), screen: 'EditProfile' },
      { icon: 'color-palette-outline', label: t('profile.appearance'), screen: 'Appearance' },
      { icon: 'shield-checkmark-outline', label: t('profile.privacy'), screen: 'Privacy' },
      { icon: 'lock-closed-outline', label: t('profile.security'), screen: 'Security' },
      { icon: 'notifications-outline', label: t('profile.notifications'), screen: 'Notifications' },
      { icon: 'chatbubbles-outline', label: t('profile.chatPrefs'), screen: 'ChatPreferences' },
      { icon: 'server-outline', label: t('profile.dataManagement'), screen: 'DataStorage' },
      { icon: 'help-circle-outline', label: t('profile.help'), screen: 'Help' },
    ],
    [t],
  );

  const loadStats = useCallback(async () => {
    if (!user) return;
    try {
      const userStats = await FirestoreProfileRepository.getUserStats(user.id);
      if (userStats) {
        setStats([
          { label: t('profile.totalChats'), value: userStats.totalChats, icon: 'chatbubbles' },
          { label: t('profile.messagesSent'), value: userStats.messagesSent, icon: 'arrow-up' },
          { label: t('profile.messagesReceived'), value: userStats.messagesReceived, icon: 'arrow-down' },
          { label: t('profile.photosShared'), value: userStats.photosShared, icon: 'image' },
          { label: t('profile.audioSent'), value: userStats.audioSent, icon: 'mic' },
          { label: t('profile.appUsage'), value: `${userStats.appUsageDays} ${t('profile.days')}`, icon: 'time' },
        ]);
      }
    } catch {}
  }, [user, t]);

  useEffect(() => {
    if (user) loadStats();
  }, [user, loadStats]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  }, [loadStats]);

  const handlePickAvatar = async () => {
    setAvatarMenuVisible(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && user) {
      try {
        const url = await FirestoreProfileRepository.uploadAvatar(user.id, result.assets[0].uri);
        setUser({ ...user, photoURL: url });
      } catch {
        Alert.alert('Error', 'Failed to upload avatar');
      }
    }
  };

  const handleCameraAvatar = async () => {
    setAvatarMenuVisible(false);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && user) {
      try {
        const url = await FirestoreProfileRepository.uploadAvatar(user.id, result.assets[0].uri);
        setUser({ ...user, photoURL: url });
      } catch {
        Alert.alert('Error', 'Failed to upload avatar');
      }
    }
  };

  const handleDeleteAvatar = async () => {
    setAvatarMenuVisible(false);
    if (!user) return;
    try {
      await FirestoreProfileRepository.deleteAvatar(user.id);
      setUser({ ...user, photoURL: null });
    } catch {
      Alert.alert('Error', 'Failed to delete avatar');
    }
  };

  const avatarOptions = [
    { label: t('profile.viewPhoto'), icon: 'eye-outline' as const, onPress: () => setAvatarMenuVisible(false) },
    { label: t('profile.changePhoto'), icon: 'image-outline' as const, onPress: handlePickAvatar },
    { label: 'Camera', icon: 'camera-outline' as const, onPress: handleCameraAvatar },
    { label: t('profile.deletePhoto'), icon: 'trash-outline' as const, onPress: handleDeleteAvatar, destructive: true },
  ];

  return (
    <SafeAreaView edges={['bottom']} style={[styles.container, { backgroundColor: c.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={c.primary} />}
      >
        <ProfileHeader
          name={user?.name || ''}
          about={user?.about}
          photoURL={user?.photoURL}
          online={user?.online}
          onAvatarPress={() => setAvatarMenuVisible(true)}
          onSettingsPress={() => navigation.navigate('EditProfile')}
          onSharePress={() => {}}
          onQrPress={() => {}}
        />

        <ProfileAvatarMenu
          visible={avatarMenuVisible}
          options={avatarOptions}
          onClose={() => setAvatarMenuVisible(false)}
        />

        {user && (
          <View style={styles.accountCard}>
            <AppText style={styles.accountLabel}>{t('profile.email')}</AppText>
            <AppText style={styles.accountValue}>{user.email}</AppText>
            <AppText style={styles.accountLabel}>{t('profile.memberSince')}</AppText>
            <AppText style={styles.accountValue}>{new Date(user.createdAt).toLocaleDateString()}</AppText>
            <AppText style={styles.accountLabel}>{t('profile.uid')}</AppText>
            <AppText style={[styles.accountValue, { marginBottom: 0 }]}>{user.id.slice(0, 8)}...</AppText>
          </View>
        )}

        {stats.length > 0 && (
          <View style={styles.statsSection}>
            <AppText style={styles.statsTitle} weight="bold">
              {t('profile.stats')}
            </AppText>
            <View style={styles.statsRow}>
              {stats.map((stat, i) => (
                <View key={i} style={styles.statCard}>
                  <AppText style={styles.statLabel}>{stat.label}</AppText>
                  <AppText style={styles.statValue} weight="bold">
                    {stat.value}
                  </AppText>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.screen}
              style={[
                styles.menuItem,
                index === 0 && styles.menuItemFirst,
                index === menuItems.length - 1 && styles.menuItemLast,
              ]}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.7}
            >
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon} size={22} color={item.color || c.primary} />
              </View>
              <AppText style={styles.menuLabel}>{item.label}</AppText>
              <Ionicons name="chevron-forward" size={18} color={c.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <AppText style={styles.footerText} weight="bold">
            Centri Social
          </AppText>
          <AppText style={styles.footerVersion}>1.0.0 Build 1</AppText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
