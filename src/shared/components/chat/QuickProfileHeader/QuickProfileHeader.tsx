import { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/app/stores/authStore';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from '@/shared/components/ui/Avatar';
import { useTheme } from '@/shared/hooks/useTheme';
import { createStyles } from './styles';

interface QuickProfileHeaderProps {
  onThemeToggle: () => void;
}

export function QuickProfileHeader({ onThemeToggle }: QuickProfileHeaderProps) {
  const { t } = useTranslation();
  const c = useTheme();
  const user = useAuthStore((s) => s.user);
  const navigation = useNavigation<any>();

  const styles = useMemo(() => createStyles(c), [c]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.profile} onPress={() => navigation.navigate('Profile')}>
        <Avatar photoURL={user?.photoURL} name={user?.name} size="sm" online={user?.online} showStatus />
        <View style={styles.info}>
          <AppText style={styles.name} weight="semiBold" numberOfLines={1}>
            {user?.name || t('profile.title')}
          </AppText>
          <AppText style={styles.status}>{user?.online ? t('time.online') : t('contacts.offline')}</AppText>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onThemeToggle} style={styles.themeBtn}>
        <Ionicons name="moon-outline" size={22} color={c.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}
