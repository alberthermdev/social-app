import { StyleSheet } from 'react-native';
import { spacing, fontSize } from '@/shared/theme/spacing';

export const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.5,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
