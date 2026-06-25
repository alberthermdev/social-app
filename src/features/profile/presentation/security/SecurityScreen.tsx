import { useState } from 'react';
import { ScrollView, View, Switch } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/shared/hooks/useTheme';
import { useAuthStore } from '@/app/stores/authStore';
import { SettingsCard, SettingsRow } from '@/shared/components/profile';
import { ConfirmModal } from '@/shared/components/feedback';
import { spacing, fontSize } from '@/shared/theme/spacing';

export function SecurityScreen() {
  const { t } = useTranslation();
  const c = useTheme();
  const authUseCases = useAuthStore((s) => s.useCases);
  const [biometric, setBiometric] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [alert, setAlert] = useState<{ title: string; message: string } | null>(null);

  const handleLogout = async () => {
    try {
      await authUseCases.logout();
      useAuthStore.getState().reset();
    } catch {
      setAlert({ title: t('profile.error'), message: t('profile.logoutFailed') });
    }
  };

  const handleChangePassword = () => {
    setAlert({ title: t('profile.changePassword'), message: 'Feature coming soon' });
  };

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView contentContainerStyle={{ paddingTop: spacing.lg, paddingBottom: spacing.xxxl }}>
        <SettingsCard title={t('profile.security')}>
          <SettingsRow
            label={t('profile.changePassword')}
            onPress={handleChangePassword}
            right={<Ionicons name="chevron-forward" size={18} color={c.textTertiary} />}
          />
          <SettingsRow
            label={t('profile.biometric')}
            right={
              <Switch
                value={biometric}
                onValueChange={setBiometric}
                trackColor={{ false: c.border, true: c.primary }}
              />
            }
          />
          <SettingsRow
            label={t('profile.twoFactor')}
            right={
              <Switch
                value={twoFactor}
                onValueChange={setTwoFactor}
                trackColor={{ false: c.border, true: c.primary }}
              />
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

        <ConfirmModal
          visible={!!alert}
          title={alert?.title}
          message={alert?.message}
          onDismiss={() => setAlert(null)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
