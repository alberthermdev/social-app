import { StyleSheet } from 'react-native';
import { spacing, fontSize } from '@/shared/theme/spacing';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarWrap: {
    width: 44,
    height: 44,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconBtn: {
    padding: spacing.sm,
  },
  notifDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  greeting: {
    marginTop: spacing.sm,
  },
  greetingText: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
  },
  subtext: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
});
