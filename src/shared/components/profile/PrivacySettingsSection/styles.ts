import { StyleSheet } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { spacing, fontSize, borderRadius, fontFamily } from '@/shared/theme/spacing';

type ThemeColors = (typeof colors)[keyof typeof colors];

export const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    overlay: { flex: 1, backgroundColor: c.overlay, justifyContent: 'flex-end' },
    sheet: {
      backgroundColor: c.surface,
      borderTopLeftRadius: borderRadius.xl,
      borderTopRightRadius: borderRadius.xl,
      paddingBottom: spacing.xxxl,
      maxHeight: '60%',
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
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xxl,
    },
    optionText: { fontSize: fontSize.md, color: c.text },
    selected: { color: c.primary, fontFamily: fontFamily.semiBold },
    cancelBtn: {
      marginTop: spacing.md,
      paddingVertical: spacing.md,
      alignItems: 'center',
      borderTopWidth: 0.5,
      borderTopColor: c.border,
    },
    cancelText: { fontSize: fontSize.md, color: c.textSecondary },
  });
