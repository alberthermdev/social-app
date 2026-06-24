import { StyleSheet } from 'react-native';
import { spacing, fontSize, borderRadius } from '@/shared/theme/spacing';

export const createStyles = (c: ReturnType<typeof import('@/shared/hooks/useTheme').useTheme>) =>
  StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: c.overlay, justifyContent: 'center', padding: spacing.xxl },
    modalContent: { backgroundColor: c.surface, borderRadius: borderRadius.xl, padding: spacing.xxl },
    modalTitle: { fontSize: fontSize.xl, color: c.text, textAlign: 'center', marginBottom: spacing.md },
    modalDesc: { fontSize: fontSize.md, color: c.textSecondary, textAlign: 'center', marginBottom: spacing.lg },
    input: {
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      fontSize: fontSize.md,
      color: c.text,
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    deleteBtn: {
      backgroundColor: c.error,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      alignItems: 'center',
    },
    deleteBtnDisabled: { opacity: 0.5 },
    deleteBtnText: { color: '#FFFFFF', fontSize: fontSize.md },
    cancelBtn: { paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.sm },
    cancelText: { color: c.textSecondary, fontSize: fontSize.md },
  });
