import { useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import { createStyles } from './styles';

interface MenuOption {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  destructive?: boolean;
}

interface ProfileAvatarMenuProps {
  visible: boolean;
  options: MenuOption[];
  onClose: () => void;
}

export function ProfileAvatarMenu({ visible, options, onClose }: ProfileAvatarMenuProps) {
  const { t } = useTranslation();
  const c = useTheme();
  const styles = useMemo(() => createStyles(c), [c]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <AppText style={styles.title} maxFontSizeMultiplier={1.3} weight="bold">
          {t('profile.photo')}
        </AppText>
        {options.map((opt, i) => (
          <TouchableOpacity key={i} style={styles.option} onPress={opt.onPress} activeOpacity={0.7}>
            <Ionicons name={opt.icon} size={22} color={opt.destructive ? c.error : c.text} />
            <AppText style={[styles.optionText, opt.destructive && styles.destructive]} maxFontSizeMultiplier={1.3}>
              {opt.label}
            </AppText>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
          <AppText style={styles.cancelText} maxFontSizeMultiplier={1.3} weight="bold">
            {t('common.cancel')}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
