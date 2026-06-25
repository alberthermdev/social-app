import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Switch, ActivityIndicator, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/shared/hooks/useTheme';
import { useAuthStore } from '@/app/stores/authStore';
import { FirestoreProfileRepository } from '@/features/profile/infrastructure/FirestoreProfileRepository';
import { SettingsCard, SettingsRow } from '@/shared/components/profile';
import { spacing } from '@/shared/theme/spacing';

export function NotificationsScreen() {
  const { t } = useTranslation();
  const c = useTheme();
  const user = useAuthStore((s) => s.user);
  const [settings, setSettings] = useState({
    messages: true,
    sound: true,
    vibration: true,
    popup: true,
    groupNotifications: true,
  });
  const [loading, setLoading] = useState(true);
  const trackColor = useMemo(() => ({ false: c.border, true: c.primary }), [c]);

  useEffect(() => {
    if (!user?.id) return;
    FirestoreProfileRepository.getNotificationSettings(user.id)
      .then((saved) => {
        if (saved) setSettings(saved);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id]);

  const toggle = (key: keyof typeof settings) => (v: boolean) => {
    const updated = { ...settings, [key]: v };
    setSettings(updated);
    if (user?.id) {
      FirestoreProfileRepository.updateNotificationSettings(user.id, { [key]: v }).catch(() => {});
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: c.background }}>
        <ActivityIndicator size="large" color={c.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView contentContainerStyle={{ paddingTop: spacing.lg, paddingBottom: spacing.xxxl }}>
        <SettingsCard title={t('profile.notifications')}>
          <SettingsRow
            label={t('profile.notifMessages')}
            right={<Switch value={settings.messages} onValueChange={toggle('messages')} trackColor={trackColor} />}
          />
          <SettingsRow
            label={t('profile.notifSound')}
            right={<Switch value={settings.sound} onValueChange={toggle('sound')} trackColor={trackColor} />}
          />
          <SettingsRow
            label={t('profile.notifVibration')}
            right={<Switch value={settings.vibration} onValueChange={toggle('vibration')} trackColor={trackColor} />}
          />
          <SettingsRow
            label={t('profile.notifPopup')}
            right={<Switch value={settings.popup} onValueChange={toggle('popup')} trackColor={trackColor} />}
          />
          <SettingsRow
            label={t('profile.notifGroups')}
            right={
              <Switch
                value={settings.groupNotifications}
                onValueChange={toggle('groupNotifications')}
                trackColor={trackColor}
              />
            }
            last
          />
        </SettingsCard>
      </ScrollView>
    </SafeAreaView>
  );
}
