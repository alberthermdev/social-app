import { useMemo } from 'react';
import { Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import { SettingsCard, SettingsRow } from '@/shared/components/profile/SettingsCard';

interface ChatPreferencesSectionProps {
  enterToSend: boolean;
  autoDownloadImages: boolean;
  autoDownloadVideos: boolean;
  showTypingIndicators: boolean;
  showReadReceipts: boolean;
  autoSaveMedia: boolean;
  onEnterToSendChange: (v: boolean) => void;
  onAutoDownloadImagesChange: (v: boolean) => void;
  onAutoDownloadVideosChange: (v: boolean) => void;
  onShowTypingIndicatorsChange: (v: boolean) => void;
  onShowReadReceiptsChange: (v: boolean) => void;
  onAutoSaveMediaChange: (v: boolean) => void;
}

export function ChatPreferencesSection({
  enterToSend,
  autoDownloadImages,
  autoDownloadVideos,
  showTypingIndicators,
  showReadReceipts,
  autoSaveMedia,
  onEnterToSendChange,
  onAutoDownloadImagesChange,
  onAutoDownloadVideosChange,
  onShowTypingIndicatorsChange,
  onShowReadReceiptsChange,
  onAutoSaveMediaChange,
}: ChatPreferencesSectionProps) {
  const { t } = useTranslation();
  const c = useTheme();
  const trackColor = useMemo(() => ({ false: c.border, true: c.primary }), [c]);

  return (
    <SettingsCard title={t('profile.chatPrefs')}>
      <SettingsRow
        label={t('profile.enterToSend')}
        right={<Switch value={enterToSend} onValueChange={onEnterToSendChange} trackColor={trackColor} />}
      />
      <SettingsRow
        label={t('profile.autoDownloadImages')}
        right={<Switch value={autoDownloadImages} onValueChange={onAutoDownloadImagesChange} trackColor={trackColor} />}
      />
      <SettingsRow
        label={t('profile.autoDownloadVideos')}
        right={<Switch value={autoDownloadVideos} onValueChange={onAutoDownloadVideosChange} trackColor={trackColor} />}
      />
      <SettingsRow
        label={t('profile.showTyping')}
        right={
          <Switch value={showTypingIndicators} onValueChange={onShowTypingIndicatorsChange} trackColor={trackColor} />
        }
      />
      <SettingsRow
        label={t('profile.showReadReceipts')}
        right={<Switch value={showReadReceipts} onValueChange={onShowReadReceiptsChange} trackColor={trackColor} />}
      />
      <SettingsRow
        label={t('profile.autoSaveMedia')}
        right={<Switch value={autoSaveMedia} onValueChange={onAutoSaveMediaChange} trackColor={trackColor} />}
        last
      />
    </SettingsCard>
  );
}
