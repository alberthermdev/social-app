import { useMemo } from 'react';
import { ActivityIndicator } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/shared/hooks/useTheme';
import { createStyles } from './styles';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message }: LoadingScreenProps) {
  const { t } = useTranslation();
  const c = useTheme();
  const styles = useMemo(() => createStyles(c), [c]);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <ActivityIndicator size="large" color={c.primary} />
      {message && (
        <AppText style={styles.message} maxFontSizeMultiplier={1.3}>
          {message}
        </AppText>
      )}
      {!message && (
        <AppText style={styles.message} maxFontSizeMultiplier={1.3}>
          {t('common.loading')}
        </AppText>
      )}
    </SafeAreaView>
  );
}
