import { StyleSheet } from 'react-native';
import { spacing } from '@/shared/theme/spacing';

export const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.md,
  },
  lines: {
    flex: 1,
    gap: spacing.sm,
  },
  line1: {
    width: '60%',
    height: 14,
    borderRadius: 4,
  },
  line2: {
    width: '40%',
    height: 12,
    borderRadius: 4,
  },
});
