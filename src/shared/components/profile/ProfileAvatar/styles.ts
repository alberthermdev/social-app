import { StyleSheet } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { spacing, fontSize, borderRadius } from '@/shared/theme/spacing';

type ThemeColors = (typeof colors)[keyof typeof colors];

export const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: c.overlay,
      justifyContent: 'flex-end',
      zIndex: 100,
    },
    sheet: {
      backgroundColor: c.surface,
      borderTopLeftRadius: borderRadius.xl,
      borderTopRightRadius: borderRadius.xl,
      paddingBottom: spacing.xxxl,
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: c.textTertiary,
      alignSelf: 'center',
      marginTop: spacing.md,
      marginBottom: spacing.md,
    },
    title: { fontSize: fontSize.lg, color: c.text, textAlign: 'center', marginBottom: spacing.md },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xxl,
    },
    optionText: { fontSize: fontSize.md, color: c.text, marginLeft: spacing.lg },
    destructive: { color: c.error },
    cancelBtn: {
      marginTop: spacing.md,
      paddingVertical: spacing.md,
      alignItems: 'center',
      borderTopWidth: 0.5,
      borderTopColor: c.border,
    },
    cancelText: { fontSize: fontSize.md, color: c.textSecondary },
  });
