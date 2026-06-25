import { useMemo, PropsWithChildren } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { useTheme } from '@/shared/hooks/useTheme';
import { createStyles, createRowStyles } from './styles';

interface SettingsCardProps {
  title: string;
  icon?: string;
}

export function SettingsCard({ title, children }: PropsWithChildren<SettingsCardProps>) {
  const c = useTheme();
  const styles = useMemo(() => createStyles(c), [c]);

  return (
    <View style={styles.section}>
      <AppText style={styles.sectionTitle} maxFontSizeMultiplier={1.3} weight="bold">
        {title}
      </AppText>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

interface SettingsRowProps {
  label: string;
  description?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  last?: boolean;
}

export function SettingsRow({ label, description, right, onPress, last }: SettingsRowProps) {
  const c = useTheme();
  const styles = useMemo(() => createRowStyles(c, !!last), [c, last]);

  const content = (
    <View style={styles.row}>
      <View style={styles.left}>
        <AppText style={styles.label} maxFontSizeMultiplier={1.3}>
          {label}
        </AppText>
        {description && (
          <AppText style={styles.description} maxFontSizeMultiplier={1.3}>
            {description}
          </AppText>
        )}
      </View>
      {right}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}
