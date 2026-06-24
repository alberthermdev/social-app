import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/shared/theme/colors';
import { spacing, fontSize, borderRadius } from '@/shared/theme/spacing';

export const createStyles = (c: { [K in keyof ThemeColors]: string }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xxl,
    },
    message: {
      fontSize: fontSize.md,
      color: c.textSecondary,
      textAlign: 'center',
      marginTop: spacing.lg,
      marginBottom: spacing.xl,
    },
    retryButton: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xxl,
      backgroundColor: c.primary,
      borderRadius: borderRadius.md,
    },
    retryText: { color: '#FFFFFF', fontSize: fontSize.md },
  });
