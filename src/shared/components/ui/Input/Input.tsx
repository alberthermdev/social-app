import { useState, useMemo } from 'react';
import { View, TextInput, TouchableOpacity, ViewStyle } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/shared/hooks/useTheme';
import { createStyles } from './styles';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  multiline?: boolean;
  maxLength?: number;
  style?: ViewStyle;
  editable?: boolean;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  secureTextEntry,
  autoCapitalize = 'none',
  keyboardType = 'default',
  multiline = false,
  maxLength,
  style,
  editable = true,
}: InputProps) {
  const c = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const isPassword = secureTextEntry !== undefined;

  const styles = useMemo(() => createStyles(c), [c]);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <AppText style={styles.label} maxFontSizeMultiplier={1.3}>
          {label}
        </AppText>
      )}
      <View
        style={[
          styles.inputContainer,
          focused && styles.inputFocused,
          error && styles.inputError,
          !editable && styles.inputDisabled,
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={c.textTertiary}
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          multiline={multiline}
          maxLength={maxLength}
          editable={editable}
          style={[styles.input, multiline && styles.multiline]}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxFontSizeMultiplier={1.3}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={c.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <AppText style={styles.error} maxFontSizeMultiplier={1.3}>
          {error}
        </AppText>
      )}
    </View>
  );
}
