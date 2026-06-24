import { StyleSheet } from 'react-native';
import { ThemeColors } from '@/shared/theme/colors';
import { borderRadius, spacing, fontSize, fontFamily } from '@/shared/theme/spacing';

export function createStyles(c: ThemeColors) {
  return StyleSheet.create({
    container: { marginBottom: spacing.lg },
    label: {
      fontSize: fontSize.sm,
      fontFamily: fontFamily.medium,
      color: c.textSecondary,
      marginBottom: spacing.xs,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: borderRadius.md,
      backgroundColor: c.surface,
    },
    inputFocused: { borderColor: c.primary, borderWidth: 2 },
    inputError: { borderColor: c.error },
    inputDisabled: { opacity: 0.6 },
    input: {
      flex: 1,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      fontSize: fontSize.md,
      color: c.text,
    },
    multiline: { minHeight: 80, textAlignVertical: 'top' },
    eyeButton: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
    error: {
      color: c.error,
      fontSize: fontSize.xs,
      marginTop: spacing.xs,
    },
  });
}
