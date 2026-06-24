import { useMemo } from 'react';
import { TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { useTheme } from '@/shared/hooks/useTheme';
import { styles, sizeStyles, sizeTextStyles, createStyles } from './styles';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const c = useTheme();
  const isDisabled = disabled || loading;

  const { variantStyles, variantTextStyles } = useMemo(() => createStyles(c), [c]);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.base, variantStyles[variant], sizeStyles[size], isDisabled && styles.disabled, style]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? c.primary : '#FFFFFF'} size="small" />
      ) : (
        <AppText
          weight="semiBold"
          style={[styles.text, variantTextStyles[variant], sizeTextStyles[size], textStyle]}
          maxFontSizeMultiplier={1.3}
        >
          {title}
        </AppText>
      )}
    </TouchableOpacity>
  );
}
