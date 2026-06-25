import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/shared/theme/colors';
import { spacing } from '@/shared/theme/spacing';

const MIN_TOUCH_TARGET = 44;

export const createStyles = (c: ThemeColors, screenWidth: number) => {
  const isLarge = screenWidth >= 400;
  const padH = isLarge ? spacing.lg : spacing.md;
  const padV = isLarge ? spacing.sm : spacing.xs;

  return StyleSheet.create({
    container: {
      paddingHorizontal: padH,
      paddingBottom: padV,
      backgroundColor: c.background,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: MIN_TOUCH_TARGET,
    },
    avatarWrap: {
      width: isLarge ? 40 : 36,
      height: isLarge ? 40 : 36,
      justifyContent: 'center',
      alignItems: 'center',
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: isLarge ? 6 : 2,
    },
    iconBtn: {
      width: MIN_TOUCH_TARGET,
      height: MIN_TOUCH_TARGET,
      alignItems: 'center',
      justifyContent: 'center',
    },
    notifDot: {
      position: 'absolute',
      top: -2,
      right: -4,
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
  });
};
