import { StyleSheet } from 'react-native';
import { spacing, fontSize, borderRadius } from '@/shared/theme/spacing';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: fontSize.lg,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  divider: {
    borderBottomWidth: 0.5,
    marginBottom: spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  itemLabel: {
    fontSize: fontSize.md,
    marginLeft: spacing.md,
  },
});
