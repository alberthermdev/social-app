import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/shared/theme/colors';
import { spacing, fontSize } from '@/shared/theme/spacing';

export const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: c.background,
      borderBottomWidth: 0.5,
      borderBottomColor: c.border,
    },
    profile: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    info: { marginLeft: spacing.md },
    name: { fontSize: fontSize.md, color: c.text },
    status: { fontSize: fontSize.xs, color: c.textSecondary, marginTop: 2 },
    themeBtn: { padding: spacing.sm },
  });
