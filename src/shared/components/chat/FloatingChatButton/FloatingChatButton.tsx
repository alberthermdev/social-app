import { useState, useCallback } from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import { AppText } from '@/shared/components/ui/AppText';
import { styles } from './styles';

const options = [
  { key: 'newChat', icon: 'chatbubble-ellipses' as const, labelKey: 'chats.newChat' },
  { key: 'newGroup', icon: 'people' as const, labelKey: 'chats.newGroup' },
  { key: 'searchUser', icon: 'person-add' as const, labelKey: 'chats.searchUser' },
];

interface FloatingChatButtonProps {
  onNewChat?: () => void;
  onNewGroup?: () => void;
  onSearchUser?: () => void;
}

export function FloatingChatButton({ onNewChat, onNewGroup, onSearchUser }: FloatingChatButtonProps) {
  const c = useTheme();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleSelect = useCallback(
    (key: string) => {
      setOpen(false);
      if (key === 'newChat') onNewChat?.();
      else if (key === 'newGroup') onNewGroup?.();
      else if (key === 'searchUser') onSearchUser?.();
    },
    [onNewChat, onNewGroup, onSearchUser],
  );

  return (
    <>
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: c.primary }]}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
        accessibilityLabel={t('chats.newChat')}
        accessibilityRole="button"
      >
        <Ionicons name="chatbubble-ellipses" size={26} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={[styles.sheet, { backgroundColor: c.surface }]}>
            <View style={[styles.handle, { backgroundColor: c.textTertiary }]} />
            <AppText style={[styles.sheetTitle, { color: c.text }]} weight="bold">
              {t('chats.newChat')}
            </AppText>
            {options.map((opt) => (
              <TouchableOpacity key={opt.key} style={styles.option} onPress={() => handleSelect(opt.key)}>
                <View style={[styles.optionIcon, { backgroundColor: c.primary + '20' }]}>
                  <Ionicons name={opt.icon} size={22} color={c.primary} />
                </View>
                <AppText style={[styles.optionLabel, { color: c.text }]}>{t(opt.labelKey)}</AppText>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
