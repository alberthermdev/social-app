import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/shared/theme/colors';
import { spacing, fontSize, borderRadius } from '@/shared/theme/spacing';

export const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: c.inputBar,
      borderTopWidth: 0.5,
      borderTopColor: c.border,
    },
    input: {
      flex: 1,
      backgroundColor: c.background,
      borderRadius: borderRadius.xl,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      maxHeight: 100,
      fontSize: fontSize.md,
      color: c.text,
      marginRight: spacing.sm,
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendButtonDisabled: { opacity: 0.4 },
  });
