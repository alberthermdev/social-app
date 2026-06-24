import { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import { createStyles } from './styles';

interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  const { t } = useTranslation();
  const c = useTheme();
  const styles = useMemo(() => createStyles(c), [c]);

  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={56} color={c.error} />
      <AppText style={styles.message}>{message}</AppText>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <AppText style={styles.retryText} weight="bold">
            {t('common.retry')}
          </AppText>
        </TouchableOpacity>
      )}
    </View>
  );
}
