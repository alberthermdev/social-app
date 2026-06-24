import { StyleSheet } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { spacing, fontSize, borderRadius } from '@/shared/theme/spacing';

type ThemeColors = (typeof colors)[keyof typeof colors];

export const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
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
