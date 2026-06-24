import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/shared/theme/colors';
import { spacing, fontSize } from '@/shared/theme/spacing';

export const createStyles = (c: { [K in keyof ThemeColors]: string }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: c.background,
    },
    message: {
      marginTop: spacing.lg,
      fontSize: fontSize.md,
      color: c.textSecondary,
    },
  });
