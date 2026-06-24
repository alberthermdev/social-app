import { useState, useMemo } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import { createStyles } from './styles';

interface InputBarProps {
  onSend: (text: string) => void;
  sending?: boolean;
}

export function InputBar({ onSend, sending }: InputBarProps) {
  const { t } = useTranslation();
  const c = useTheme();
  const [text, setText] = useState('');

  const styles = useMemo(() => createStyles(c), [c]);

  const handleSend = () => {
    if (text.trim() && !sending) {
      onSend(text);
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={t('chat.messagePlaceholder')}
        placeholderTextColor={c.textTertiary}
        value={text}
        onChangeText={setText}
        multiline
        maxLength={1000}
        maxFontSizeMultiplier={1.3}
      />
      <TouchableOpacity
        style={[styles.sendButton, (!text.trim() || sending) && styles.sendButtonDisabled]}
        onPress={handleSend}
        disabled={!text.trim() || sending}
      >
        <Ionicons name="send" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
