import { useMemo } from 'react';
import { Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import { SettingsCard, SettingsRow } from '@/shared/components/profile/SettingsCard';

interface NotificationSettingsSectionProps {
  messages: boolean;
  sound: boolean;
  vibration: boolean;
  popup: boolean;
  groupNotifications: boolean;
  onMessagesChange: (v: boolean) => void;
  onSoundChange: (v: boolean) => void;
  onVibrationChange: (v: boolean) => void;
  onPopupChange: (v: boolean) => void;
  onGroupChange: (v: boolean) => void;
}

export function NotificationSettingsSection({
  messages,
  sound,
  vibration,
  popup,
  groupNotifications,
  onMessagesChange,
  onSoundChange,
  onVibrationChange,
  onPopupChange,
  onGroupChange,
}: NotificationSettingsSectionProps) {
  const { t } = useTranslation();
  const c = useTheme();
  const trackColor = useMemo(() => ({ false: c.border, true: c.primary }), [c]);

  return (
    <SettingsCard title={t('profile.notifications')}>
      <SettingsRow
        label={t('profile.notifMessages')}
        right={<Switch value={messages} onValueChange={onMessagesChange} trackColor={trackColor} />}
      />
      <SettingsRow
        label={t('profile.notifSound')}
        right={<Switch value={sound} onValueChange={onSoundChange} trackColor={trackColor} />}
      />
      <SettingsRow
        label={t('profile.notifVibration')}
        right={<Switch value={vibration} onValueChange={onVibrationChange} trackColor={trackColor} />}
      />
      <SettingsRow
        label={t('profile.notifPopup')}
        right={<Switch value={popup} onValueChange={onPopupChange} trackColor={trackColor} />}
      />
      <SettingsRow
        label={t('profile.notifGroups')}
        right={<Switch value={groupNotifications} onValueChange={onGroupChange} trackColor={trackColor} />}
        last
      />
    </SettingsCard>
  );
}
