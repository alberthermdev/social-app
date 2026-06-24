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
    grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.lg, gap: spacing.sm },
    card: {
      width: '47%',
      backgroundColor: c.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 90,
    },
    value: { fontSize: fontSize.xxl, color: c.text, marginTop: spacing.xs },
    label: { fontSize: fontSize.xs, color: c.textSecondary, textAlign: 'center', marginTop: spacing.xs },
  });
