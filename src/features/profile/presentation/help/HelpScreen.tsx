import { useState } from 'react';
import { ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/shared/hooks/useTheme';
import { SettingsCard, SettingsRow } from '@/shared/components/profile';
import { ConfirmModal } from '@/shared/components/feedback';
import { spacing } from '@/shared/theme/spacing';

export function HelpScreen() {
  const { t } = useTranslation();
  const c = useTheme();
  const [alert, setAlert] = useState<{ title: string; message: string } | null>(null);

  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      setAlert({ title: 'Error', message: 'Cannot open this link' });
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView contentContainerStyle={{ paddingTop: spacing.lg, paddingBottom: spacing.xxxl }}>
        <SettingsCard title={t('profile.help')}>
          <SettingsRow
            label={t('profile.helpCenter')}
            onPress={() => openLink('https://centri-social.com/help')}
            right={<Ionicons name="chevron-forward" size={18} color={c.textTertiary} />}
          />
          <SettingsRow
            label={t('profile.faq')}
            onPress={() => openLink('https://centri-social.com/faq')}
            right={<Ionicons name="chevron-forward" size={18} color={c.textTertiary} />}
          />
          <SettingsRow
            label={t('profile.reportBug')}
            onPress={() => openLink('https://centri-social.com/report')}
            right={<Ionicons name="chevron-forward" size={18} color={c.textTertiary} />}
          />
          <SettingsRow
            label={t('profile.contactSupport')}
            onPress={() => openLink('https://centri-social.com/support')}
            right={<Ionicons name="chevron-forward" size={18} color={c.textTertiary} />}
          />
          <SettingsRow
            label={t('profile.privacyPolicy')}
            onPress={() => openLink('https://centri-social.com/privacy')}
            right={<Ionicons name="chevron-forward" size={18} color={c.textTertiary} />}
          />
          <SettingsRow
            label={t('profile.terms')}
            onPress={() => openLink('https://centri-social.com/terms')}
            right={<Ionicons name="chevron-forward" size={18} color={c.textTertiary} />}
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
