import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import { useAuthStore } from '@/app/stores/authStore';
import { useChatsStore } from '@/app/stores/chatsStore';
import { Avatar } from '@/shared/components/ui/Avatar';
import { AppText } from '@/shared/components/ui/AppText';
import { styles } from './styles';

interface HomeHeaderProps {
  onAvatarPress?: () => void;
  onSettingsPress?: () => void;
  onSearchPress?: () => void;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

export function HomeHeader({ onAvatarPress, onSettingsPress, onSearchPress }: HomeHeaderProps) {
  const c = useTheme();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const unreadTotal = useChatsStore((s) => s.unreadTotal);

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={onAvatarPress} style={styles.avatarWrap} accessibilityLabel={t('chats.profile')}>
          <Avatar photoURL={user?.photoURL} name={user?.name} size="md" online={user?.online} showStatus />
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity onPress={onSearchPress} style={styles.iconBtn} accessibilityLabel={t('chats.search')}>
            <Ionicons name="search-outline" size={24} color={c.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} accessibilityLabel={t('chats.notifications')}>
            <View>
              <Ionicons name="notifications-outline" size={24} color={c.text} />
              {unreadTotal > 0 && (
                <View style={[styles.notifDot, { backgroundColor: c.primary }]}>
                  <AppText style={styles.notifText}>{unreadTotal > 9 ? '9+' : unreadTotal}</AppText>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSettingsPress} style={styles.iconBtn} accessibilityLabel={t('chats.settings')}>
            <Ionicons name="settings-outline" size={24} color={c.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.greeting}>
        <AppText style={[styles.greetingText, { color: c.text }]}>
          {getGreeting()}, {user?.name?.split(' ')[0] || ''} 👋
        </AppText>
        {unreadTotal > 0 ? (
          <AppText style={[styles.subtext, { color: c.textSecondary }]}>
            Tienes {unreadTotal} mensaje{unreadTotal !== 1 ? 's' : ''} sin leer
          </AppText>
        ) : (
          <AppText style={[styles.subtext, { color: c.textSecondary }]}>No tienes mensajes pendientes</AppText>
        )}
      </View>
    </View>
  );
}
