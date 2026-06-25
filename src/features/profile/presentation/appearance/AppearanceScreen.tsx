import { useMemo } from 'react';
import { ScrollView, View, Switch, TouchableOpacity } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/shared/hooks/useTheme';
import { useSettingsStore, ThemeMode, TextSize } from '@/app/stores/settingsStore';
import { SettingsCard, SettingsRow } from '@/shared/components/profile';
import { createStyles } from './styles';

export function AppearanceScreen() {
  const { t } = useTranslation();
  const c = useTheme();
  const theme = useSettingsStore((s) => s.theme);
  const textSize = useSettingsStore((s) => s.textSize);
  const reducedAnimations = useSettingsStore((s) => s.reducedAnimations);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const setTextSize = useSettingsStore((s) => s.setTextSize);
  const setReducedAnimations = useSettingsStore((s) => s.setReducedAnimations);
  const styles = useMemo(() => createStyles(c), [c]);

  const themes: { key: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'light', label: t('theme.light'), icon: 'sunny-outline' },
    { key: 'dark', label: t('theme.dark'), icon: 'moon-outline' },
    { key: 'system', label: t('theme.system'), icon: 'phone-portrait-outline' },
  ];

  const textSizes: { key: TextSize; label: string }[] = [
    { key: 'small', label: t('textSize.small') },
    { key: 'normal', label: t('textSize.normal') },
    { key: 'large', label: t('textSize.large') },
  ];

  return (
    <SafeAreaView edges={['bottom']} style={[styles.container, { backgroundColor: c.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <SettingsCard title={t('profile.appearance')}>
          <View style={styles.chipRow}>
            {themes.map((th) => (
              <TouchableOpacity
                key={th.key}
                style={[styles.chip, theme === th.key && styles.chipActive]}
                onPress={() => setTheme(th.key)}
                activeOpacity={0.7}
              >
                <Ionicons name={th.icon} size={18} color={theme === th.key ? '#FFFFFF' : c.textSecondary} />
                <AppText style={[styles.chipText, theme === th.key && styles.chipTextActive]} weight="medium">
                  {th.label}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.chipRow}>
            {textSizes.map((ts) => (
              <TouchableOpacity
                key={ts.key}
                style={[styles.chip, textSize === ts.key && styles.chipActive]}
                onPress={() => setTextSize(ts.key)}
                activeOpacity={0.7}
              >
                <AppText style={[styles.chipText, textSize === ts.key && styles.chipTextActive]} weight="medium">
                  {ts.label}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
          <SettingsRow
            label={t('profile.reducedAnimations')}
            right={
              <Switch
                value={reducedAnimations}
                onValueChange={setReducedAnimations}
                trackColor={{ false: c.border, true: c.primary }}
              />
            }
            last
          />
        </SettingsCard>
      </ScrollView>
    </SafeAreaView>
  );
}
