import { ScrollView, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import { SettingsCard, SettingsRow } from '@/shared/components/profile';

export function HelpScreen() {
  const { t } = useTranslation();
  const c = useTheme();

  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Cannot open this link');
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.background }} contentContainerStyle={{ paddingBottom: 32 }}>
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
    </ScrollView>
  );
}
