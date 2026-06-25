import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/shared/theme/colors';
import { spacing, fontSize, borderRadius } from '@/shared/theme/spacing';

export const createStyles = (c: ThemeColors, isOwn: boolean) =>
  StyleSheet.create({
    container: {
      marginVertical: 2,
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
    senderName: {
      fontSize: fontSize.xs,
      color: c.primary,
      marginBottom: 2,
    },
    text: { fontSize: fontSize.md, lineHeight: 20, color: isOwn ? '#FFFFFF' : c.text },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginTop: spacing.xs,
    },
    time: {
      fontSize: fontSize.xs,
      color: isOwn ? 'rgba(255,255,255,0.7)' : c.textSecondary,
    },
  });
