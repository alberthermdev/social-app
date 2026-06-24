import { StyleSheet } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { spacing, fontSize } from '@/shared/theme/spacing';

type ThemeColors = (typeof colors)[keyof typeof colors];

export const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { alignItems: 'center', paddingVertical: spacing.xxl, paddingHorizontal: spacing.lg },
    appName: { fontSize: fontSize.lg, color: c.text, marginBottom: spacing.xs },
    version: { fontSize: fontSize.sm, color: c.textSecondary, marginBottom: spacing.xs },
    techs: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
    tech: {
      fontSize: fontSize.xs,
      color: c.textTertiary,
      backgroundColor: c.surface,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: 4,
      overflow: 'hidden',
    },
  });
