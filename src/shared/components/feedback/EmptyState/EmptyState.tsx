import { useMemo } from 'react';
import { View } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/shared/hooks/useTheme';
import { createStyles } from './styles';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
}

export function EmptyState({ icon = 'mail-outline', title, description }: EmptyStateProps) {
  const c = useTheme();
  const styles = useMemo(() => createStyles(c), [c]);

  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={56} color={c.textTertiary} />
      <AppText style={styles.title} weight="bold">
        {title}
      </AppText>
      {description && <AppText style={styles.description}>{description}</AppText>}
    </View>
  );
}
