import { useState } from 'react';
import { ScrollView, View, Switch, Alert } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import { useAuthStore } from '@/app/stores/authStore';
import { SettingsCard, SettingsRow } from '@/shared/components/profile';
import { spacing, fontSize } from '@/shared/theme/spacing';

export function SecurityScreen() {
  const { t } = useTranslation();
  const c = useTheme();
  const { useCases: authUseCases } = useAuthStore();
  const [biometric, setBiometric] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  const handleLogout = async () => {
    try {
      await authUseCases.logout();
      useAuthStore.getState().reset();
    } catch {
      Alert.alert(t('profile.error'), t('profile.logoutFailed'));
    }
  };

  const handleChangePassword = () => {
    Alert.alert(t('profile.changePassword'), 'Feature coming soon');
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.background }}
      contentContainerStyle={{ paddingBottom: spacing.xxxl }}
    >
      <SettingsCard title={t('profile.security')}>
        <SettingsRow
          label={t('profile.changePassword')}
          onPress={handleChangePassword}
          right={<Ionicons name="chevron-forward" size={18} color={c.textTertiary} />}
        />
        <SettingsRow
          label={t('profile.biometric')}
          right={
            <Switch value={biometric} onValueChange={setBiometric} trackColor={{ false: c.border, true: c.primary }} />
          }
        />
        <SettingsRow
          label={t('profile.twoFactor')}
          right={
            <Switch value={twoFactor} onValueChange={setTwoFactor} trackColor={{ false: c.border, true: c.primary }} />
          }
          last
        />
      </SettingsCard>

      <SettingsCard title={t('profile.activeSessions')}>
        <View style={{ padding: spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
            <View
              style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.success, marginRight: spacing.sm }}
            />
            <AppText style={{ fontSize: fontSize.md, color: c.text, flex: 1 }}>This device</AppText>
            <AppText style={{ fontSize: fontSize.xs, color: c.textSecondary }}>Active now</AppText>
          </View>
          <AppText style={{ fontSize: fontSize.xs, color: c.textTertiary, marginBottom: spacing.sm }}>
            Windows · Chrome
          </AppText>
        </View>
      </SettingsCard>

      <SettingsCard title={t('profile.dataManagement')}>
        <SettingsRow
          label={t('profile.logout')}
          onPress={handleLogout}
          right={<Ionicons name="log-out-outline" size={20} color={c.error} />}
          last
        />
      </SettingsCard>
    </ScrollView>
  );
}
