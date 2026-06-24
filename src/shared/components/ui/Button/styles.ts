import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { borderRadius, spacing, fontSize } from '@/shared/theme/spacing';
import { ThemeColors } from '@/shared/theme/colors';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {},
});

export const sizeStyles: Record<Size, ViewStyle> = {
  sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
  md: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
  lg: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xxl },
};

export const sizeTextStyles: Record<Size, TextStyle> = {
  sm: { fontSize: fontSize.sm },
  md: { fontSize: fontSize.md },
  lg: { fontSize: fontSize.lg },
};

export function createStyles(c: ThemeColors) {
  return {
    variantStyles: {
      primary: { backgroundColor: c.primary },
      secondary: { backgroundColor: c.secondary },
      outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: c.primary },
      ghost: { backgroundColor: 'transparent' },
      danger: { backgroundColor: c.error },
    } as Record<Variant, ViewStyle>,
    variantTextStyles: {
      primary: { color: '#FFFFFF' },
      secondary: { color: '#FFFFFF' },
      outline: { color: c.primary },
      ghost: { color: c.primary },
      danger: { color: '#FFFFFF' },
    } as Record<Variant, TextStyle>,
  };
}
