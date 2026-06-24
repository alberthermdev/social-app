import { StyleSheet } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { spacing, fontSize, borderRadius } from '@/shared/theme/spacing';

type ThemeColors = (typeof colors)[keyof typeof colors];

export const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    section: { marginBottom: spacing.lg },
    sectionTitle: {
      fontSize: fontSize.sm,
      color: c.primary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: spacing.sm,
      marginHorizontal: spacing.lg,
    },
    card: {
      backgroundColor: c.surface,
      borderRadius: borderRadius.lg,
      marginHorizontal: spacing.lg,
      overflow: 'hidden',
    },
  });

export const createRowStyles = (c: ThemeColors, last: boolean) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderBottomWidth: last ? 0 : 0.5,
      borderBottomColor: c.border,
      minHeight: 48,
    },
    left: { flex: 1, marginRight: spacing.md },
    label: { fontSize: fontSize.md, color: c.text },
    description: { fontSize: fontSize.xs, color: c.textSecondary, marginTop: 2 },
  });
