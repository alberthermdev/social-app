import { View } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { useTheme } from '@/shared/hooks/useTheme';
import { styles } from './styles';

interface UnreadBadgeProps {
  count: number;
  muted?: boolean;
}

export function UnreadBadge({ count, muted }: UnreadBadgeProps) {
  const c = useTheme();
  if (count <= 0) return null;

  const label = count > 99 ? '99+' : String(count);

  return (
    <View style={[styles.badge, { backgroundColor: muted ? c.textTertiary : c.primary }]}>
      <AppText style={styles.text} maxFontSizeMultiplier={1.1}>
        {label}
      </AppText>
    </View>
  );
}
