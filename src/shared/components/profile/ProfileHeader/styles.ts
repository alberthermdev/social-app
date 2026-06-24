import { StyleSheet } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { spacing, fontSize, borderRadius } from '@/shared/theme/spacing';

type ThemeColors = (typeof colors)[keyof typeof colors];

export const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { alignItems: 'center', paddingVertical: spacing.xxl, paddingHorizontal: spacing.lg },
    avatarWrapper: { marginBottom: spacing.lg },
    name: { fontSize: fontSize.xl, color: c.text, textAlign: 'center' },
    statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: c.online, marginRight: spacing.xs },
    status: { fontSize: fontSize.md, color: c.textSecondary },
    actions: { flexDirection: 'row', marginTop: spacing.xl, gap: spacing.lg },
    actionBtn: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 48,
      height: 48,
      borderRadius: borderRadius.full,
      backgroundColor: c.surface,
    },
  });
