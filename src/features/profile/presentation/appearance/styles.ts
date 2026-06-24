import { StyleSheet } from 'react-native';
import { spacing, fontSize, borderRadius } from '@/shared/theme/spacing';

export const createStyles = (c: ReturnType<typeof import('@/shared/hooks/useTheme').useTheme>) =>
  StyleSheet.create({
    container: { flex: 1 },
    content: { paddingBottom: spacing.xxxl },
    chipRow: { flexDirection: 'row', padding: spacing.md, gap: spacing.sm },
    chip: {
      flex: 1,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: c.border,
    },
    chipActive: { backgroundColor: c.primary, borderColor: c.primary },
    chipText: { fontSize: fontSize.sm, color: c.textSecondary },
    chipTextActive: { color: '#FFFFFF' },
  });
