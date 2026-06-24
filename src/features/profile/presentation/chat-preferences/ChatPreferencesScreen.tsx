import { useMemo } from 'react';
import { ScrollView, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import { useSettingsStore } from '@/app/stores/settingsStore';
import { SettingsCard, SettingsRow } from '@/shared/components/profile';

export function ChatPreferencesScreen() {
  const { t } = useTranslation();
  const c = useTheme();
  const {
    enterToSend,
    autoDownloadImages,
    autoDownloadVideos,
    showTypingIndicators,
    showReadReceipts,
    autoSaveMedia,
    setEnterToSend,
    setAutoDownloadImages,
    setAutoDownloadVideos,
    setShowTypingIndicators,
    setShowReadReceipts,
    setAutoSaveMedia,
  } = useSettingsStore();
  const trackColor = useMemo(() => ({ false: c.border, true: c.primary }), [c]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.background }} contentContainerStyle={{ paddingBottom: 32 }}>
      <SettingsCard title={t('profile.chatPrefs')}>
        <SettingsRow
          label={t('profile.enterToSend')}
          right={<Switch value={enterToSend} onValueChange={setEnterToSend} trackColor={trackColor} />}
        />
        <SettingsRow
          label={t('profile.autoDownloadImages')}
          right={<Switch value={autoDownloadImages} onValueChange={setAutoDownloadImages} trackColor={trackColor} />}
        />
        <SettingsRow
          label={t('profile.autoDownloadVideos')}
          right={<Switch value={autoDownloadVideos} onValueChange={setAutoDownloadVideos} trackColor={trackColor} />}
        />
        <SettingsRow
          label={t('profile.showTyping')}
          right={
            <Switch value={showTypingIndicators} onValueChange={setShowTypingIndicators} trackColor={trackColor} />
          }
        />
        <SettingsRow
          label={t('profile.showReadReceiptsPref')}
          right={<Switch value={showReadReceipts} onValueChange={setShowReadReceipts} trackColor={trackColor} />}
        />
        <SettingsRow
          label={t('profile.autoSaveMedia')}
          right={<Switch value={autoSaveMedia} onValueChange={setAutoSaveMedia} trackColor={trackColor} />}
          last
        />
      </SettingsCard>
    </ScrollView>
  );
}
