import { useMemo } from 'react';
import { View } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { useTheme } from '@/shared/hooks/useTheme';
import { createStyles } from './styles';

interface AboutSectionProps {
  version?: string;
  build?: string;
}

export function AboutSection({ version = '1.0.0', build = '1' }: AboutSectionProps) {
  const c = useTheme();
  const styles = useMemo(() => createStyles(c), [c]);

  return (
    <View style={styles.container}>
      <AppText style={styles.appName} maxFontSizeMultiplier={1.3} weight="bold">
        Centri Social
      </AppText>
      <AppText style={styles.version} maxFontSizeMultiplier={1.3}>{`${version} · Build ${build}`}</AppText>
      <View style={styles.techs}>
        <AppText style={styles.tech}>React Native</AppText>
        <AppText style={styles.tech}>Expo</AppText>
        <AppText style={styles.tech}>Firebase</AppText>
      </View>
    </View>
  );
}
