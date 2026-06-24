import { useMemo } from 'react';
import { View } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import { createStyles } from './styles';

interface StatItem {
  label: string;
  value: string | number;
  icon: string;
}

interface UserStatisticsProps {
  stats: StatItem[];
}

export function UserStatistics({ stats }: UserStatisticsProps) {
  const { t } = useTranslation();
  const c = useTheme();
  const styles = useMemo(() => createStyles(c), [c]);

  return (
    <View style={styles.section}>
      <AppText style={styles.sectionTitle} maxFontSizeMultiplier={1.3} weight="bold">
        {t('profile.stats')}
      </AppText>
      <View style={styles.grid}>
        {stats.map((stat, i) => (
          <View key={i} style={styles.card}>
            <AppText style={styles.label} maxFontSizeMultiplier={1.3}>
              {stat.label}
            </AppText>
            <AppText style={styles.value} maxFontSizeMultiplier={1.3} weight="bold">
              {stat.value}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}
