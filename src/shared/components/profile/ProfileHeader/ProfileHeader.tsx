import { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import { Avatar } from '@/shared/components/ui/Avatar';
import { createStyles } from './styles';

interface ProfileHeaderProps {
  name: string;
  about?: string;
  photoURL?: string | null;
  online?: boolean;
  onAvatarPress: () => void;
  onSettingsPress: () => void;
  onSharePress: () => void;
  onQrPress: () => void;
}

export function ProfileHeader({
  name,
  about,
  photoURL,
  online,
  onAvatarPress,
  onSettingsPress,
  onSharePress,
  onQrPress,
}: ProfileHeaderProps) {
  const { t } = useTranslation();
  const c = useTheme();
  const styles = useMemo(() => createStyles(c), [c]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.avatarWrapper} onPress={onAvatarPress} activeOpacity={0.8}>
        <Avatar photoURL={photoURL} name={name} size="xl" online={online} showStatus />
      </TouchableOpacity>
      <AppText style={styles.name} maxFontSizeMultiplier={1.3} weight="bold">
        {name}
      </AppText>
      <View style={styles.statusRow}>
        {online && <View style={styles.dot} />}
        <AppText style={styles.status} maxFontSizeMultiplier={1.3}>
          {online ? t('time.online') : about || t('contacts.offline')}
        </AppText>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={onSettingsPress} accessibilityLabel={t('common.settings')}>
          <Ionicons name="settings-outline" size={22} color={c.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={onSharePress} accessibilityLabel={t('common.share')}>
          <Ionicons name="share-outline" size={22} color={c.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={onQrPress} accessibilityLabel="QR">
          <Ionicons name="qr-code-outline" size={22} color={c.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
