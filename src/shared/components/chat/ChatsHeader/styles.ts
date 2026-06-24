import { StyleSheet } from 'react-native';
import { spacing, fontSize, borderRadius } from '@/shared/theme/spacing';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 38,
  },
  input: {
    flex: 1,
    fontSize: fontSize.sm,
    marginLeft: spacing.sm,
    padding: 0,
  },
  iconBtn: {
    padding: spacing.sm,
    marginLeft: spacing.xs,
  },
});
