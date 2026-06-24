import { StyleSheet } from 'react-native';
import { spacing, fontSize, borderRadius } from '@/shared/theme/spacing';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  label: {
    fontSize: fontSize.sm,
  },
});
