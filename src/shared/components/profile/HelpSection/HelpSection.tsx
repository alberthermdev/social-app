import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import { SettingsCard, SettingsRow } from '@/shared/components/profile/SettingsCard';

export function HelpSection() {
  const { t } = useTranslation();
  const c = useTheme();

  return (
    <SettingsCard title={t('profile.help')}>
      <SettingsRow
        label={t('profile.helpCenter')}
        right={<Ionicons name="chevron-forward" size={18} color={c.textTertiary} />}
      />
      <SettingsRow
        label={t('profile.faq')}
        right={<Ionicons name="chevron-forward" size={18} color={c.textTertiary} />}
      />
      <SettingsRow
        label={t('profile.reportBug')}
        right={<Ionicons name="chevron-forward" size={18} color={c.textTertiary} />}
      />
      <SettingsRow
        label={t('profile.contactSupport')}
        right={<Ionicons name="chevron-forward" size={18} color={c.textTertiary} />}
      />
      <SettingsRow
        label={t('profile.privacyPolicy')}
        right={<Ionicons name="chevron-forward" size={18} color={c.textTertiary} />}
      />
      <SettingsRow
        label={t('profile.terms')}
        right={<Ionicons name="chevron-forward" size={18} color={c.textTertiary} />}
        last
      />
    </SettingsCard>
  );
}
