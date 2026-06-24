import { useState, useEffect, useCallback } from 'react';
import { Modal, View, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { FirestoreContactRepository } from '@/features/contacts/infrastructure/FirestoreContactRepository';
import { FirestoreChatRepository } from '@/features/chats/infrastructure/FirestoreChatRepository';
import { useAuthStore } from '@/app/stores/authStore';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { Avatar } from '@/shared/components/ui/Avatar';
import { useTheme } from '@/shared/hooks/useTheme';
import { DEBOUNCE_MS } from '@/shared/constants';
import { styles } from './styles';

interface ContactUser {
  id: string;
  name: string;
  photoURL: string | null;
  online: boolean;
}

interface SearchUsersModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SearchUsersModal({ visible, onClose }: SearchUsersModalProps) {
  const { t } = useTranslation();
  const c = useTheme();
  const navigation = useNavigation<any>();
  const currentUser = useAuthStore((s) => s.user);
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<ContactUser[]>([]);
  const setLoading = useState(false)[1];
  const debouncedQuery = useDebounce(query, DEBOUNCE_MS);

  const searchUsers = useCallback(
    async (q: string) => {
      if (!q.trim()) {
        setUsers([]);
        return;
      }
      setLoading(true);
      try {
        const results = await FirestoreContactRepository.searchUsers(q.trim(), currentUser?.id || '');
        setUsers(results.filter((u) => u.id !== currentUser?.id));
      } catch {
        setUsers([]);
      }
      setLoading(false);
    },
    [currentUser?.id, setLoading],
  );

  useEffect(() => {
    searchUsers(debouncedQuery);
  }, [debouncedQuery, searchUsers]);

  const handleSelect = async (userId: string) => {
    if (!currentUser) return;
    try {
      const chatId = await FirestoreChatRepository.getOrCreateChat(currentUser.id, userId);
      onClose();
      setQuery('');
      navigation.navigate('ChatDetail', { chatId });
    } catch {}
  };

  const handleClose = () => {
    onClose();
    setQuery('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalContainer}>
        <View style={[styles.modal, { backgroundColor: c.background }]}>
          <View style={[styles.header, { backgroundColor: c.primary }]}>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder={t('contacts.search')}
              placeholderTextColor="#FFFFFF99"
              value={query}
              onChangeText={setQuery}
              autoFocus
              maxFontSizeMultiplier={1.3}
            />
          </View>

          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.userItem} onPress={() => handleSelect(item.id)}>
                <Avatar photoURL={item.photoURL} name={item.name} size="md" online={item.online} showStatus />
                <View style={styles.userInfo}>
                  <AppText style={[styles.userName, { color: c.text }]} weight="medium" maxFontSizeMultiplier={1.3}>
                    {item.name}
                  </AppText>
                </View>
                <Ionicons name="chatbubble-outline" size={20} color={c.textSecondary} />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Ionicons name="people-outline" size={48} color={c.textTertiary} />
                <AppText style={[styles.emptyText, { color: c.textSecondary }]} maxFontSizeMultiplier={1.3}>
                  {query ? t('contacts.noContactsSearch') : t('chats.searchHint')}
                </AppText>
              </View>
            }
            contentContainerStyle={users.length === 0 ? styles.emptyContainer : undefined}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
