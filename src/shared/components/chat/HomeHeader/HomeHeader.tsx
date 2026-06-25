import { useMemo } from 'react';
import { View, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import { useAuthStore } from '@/app/stores/authStore';
import { useChatsStore } from '@/app/stores/chatsStore';
import { Avatar } from '@/shared/components/ui/Avatar';
import { AppText } from '@/shared/components/ui/AppText';
import { spacing } from '@/shared/theme/spacing';
import { createStyles } from './styles';

interface HomeHeaderProps {
  onAvatarPress?: () => void;
  onSettingsPress?: () => void;
  onNotificationPress?: () => void;
}

const ICON_SIZES = { small: 22, large: 26 } as const;

export function HomeHeader({ onAvatarPress, onSettingsPress, onNotificationPress }: HomeHeaderProps) {
  const c = useTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const unreadTotal = useChatsStore((s) => s.unreadTotal);

  const isLarge = width >= 400;
  const avatarSize = isLarge ? 'md' : 'sm';
  const iconSize = isLarge ? ICON_SIZES.large : ICON_SIZES.small;

  const styles = useMemo(() => createStyles(c, width), [c, width]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + (isLarge ? spacing.sm : spacing.xs) }]}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={onAvatarPress} style={styles.avatarWrap} accessibilityLabel={t('chats.profile')}>
          <Avatar photoURL={user?.photoURL} name={user?.name} size={avatarSize} online={user?.online} showStatus />
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={onNotificationPress}
            style={styles.iconBtn}
            accessibilityLabel={t('chats.notifications')}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          >
            <View>
              <Ionicons name="notifications-outline" size={iconSize} color={c.text} />
              {unreadTotal > 0 && (
                <View style={[styles.notifDot, { backgroundColor: c.primary }]}>
                  <AppText style={styles.notifText}>{unreadTotal > 9 ? '9+' : unreadTotal}</AppText>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onSettingsPress}
            style={styles.iconBtn}
            accessibilityLabel={t('chats.settings')}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          >
            <Ionicons name="settings-outline" size={iconSize} color={c.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
