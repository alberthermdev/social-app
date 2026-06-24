import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/shared/theme/colors';
import { spacing, fontSize, borderRadius } from '@/shared/theme/spacing';

export const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderBottomWidth: 0.5,
      borderBottomColor: c.border,
    },
    info: { flex: 1, marginLeft: spacing.md },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    nameRow: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: spacing.sm },
    icon: { marginRight: 4 },
    name: { fontSize: fontSize.md, color: c.text, flexShrink: 1 },
    time: { fontSize: fontSize.xs, color: c.textSecondary },
    bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    message: { fontSize: fontSize.sm, color: c.textSecondary, flex: 1 },
    messageUnread: { color: c.text },
    badge: {
      backgroundColor: c.primary,
      borderRadius: borderRadius.full,
      minWidth: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 6,
      marginLeft: 8,
    },
    badgeText: { color: '#FFFFFF', fontSize: 11 },
  });
