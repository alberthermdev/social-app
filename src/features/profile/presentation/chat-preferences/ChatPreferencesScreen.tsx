import { useMemo } from 'react';
import { ScrollView, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/shared/hooks/useTheme';
import { useSettingsStore } from '@/app/stores/settingsStore';
import { SettingsCard, SettingsRow } from '@/shared/components/profile';
import { spacing } from '@/shared/theme/spacing';

export function ChatPreferencesScreen() {
  const { t } = useTranslation();
  const c = useTheme();
  const enterToSend = useSettingsStore((s) => s.enterToSend);
  const autoDownloadImages = useSettingsStore((s) => s.autoDownloadImages);
  const autoDownloadVideos = useSettingsStore((s) => s.autoDownloadVideos);
  const showTypingIndicators = useSettingsStore((s) => s.showTypingIndicators);
  const showReadReceipts = useSettingsStore((s) => s.showReadReceipts);
  const autoSaveMedia = useSettingsStore((s) => s.autoSaveMedia);
  const setEnterToSend = useSettingsStore((s) => s.setEnterToSend);
  const setAutoDownloadImages = useSettingsStore((s) => s.setAutoDownloadImages);
  const setAutoDownloadVideos = useSettingsStore((s) => s.setAutoDownloadVideos);
  const setShowTypingIndicators = useSettingsStore((s) => s.setShowTypingIndicators);
  const setShowReadReceipts = useSettingsStore((s) => s.setShowReadReceipts);
  const setAutoSaveMedia = useSettingsStore((s) => s.setAutoSaveMedia);
  const trackColor = useMemo(() => ({ false: c.border, true: c.primary }), [c]);

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView contentContainerStyle={{ paddingTop: spacing.lg, paddingBottom: spacing.xxxl }}>
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
    </SafeAreaView>
  );
}
