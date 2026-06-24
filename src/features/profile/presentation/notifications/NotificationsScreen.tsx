import { useMemo, useState } from 'react';
import { ScrollView, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import { SettingsCard, SettingsRow } from '@/shared/components/profile';

export function NotificationsScreen() {
  const { t } = useTranslation();
  const c = useTheme();
  const [settings, setSettings] = useState({
    messages: true,
    sound: true,
    vibration: true,
    popup: true,
    groupNotifications: true,
  });
  const trackColor = useMemo(() => ({ false: c.border, true: c.primary }), [c]);

  const toggle = (key: keyof typeof settings) => (v: boolean) => setSettings((s) => ({ ...s, [key]: v }));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.background }} contentContainerStyle={{ paddingBottom: 32 }}>
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
  );
}
