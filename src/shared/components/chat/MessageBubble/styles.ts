import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/shared/theme/colors';
import { spacing, fontSize, borderRadius } from '@/shared/theme/spacing';

export const createStyles = (c: ThemeColors, isOwn: boolean) =>
  StyleSheet.create({
    container: {
      marginVertical: spacing.xs,
      flexDirection: 'row',
    },
    ownContainer: { justifyContent: 'flex-end' },
    otherContainer: { justifyContent: 'flex-start' },
    bubble: {
      maxWidth: '80%',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
    },
    ownBubble: {
      backgroundColor: c.outgoingBubble,
      borderBottomRightRadius: borderRadius.sm,
    },
    otherBubble: {
      backgroundColor: c.incomingBubble,
      borderBottomLeftRadius: borderRadius.sm,
    },
    text: { fontSize: fontSize.md, lineHeight: 20, color: isOwn ? '#FFFFFF' : c.text },
    time: {
      fontSize: fontSize.xs,
      marginTop: spacing.xs,
      alignSelf: 'flex-end',
      color: isOwn ? 'rgba(255,255,255,0.7)' : c.textSecondary,
    },
  });
