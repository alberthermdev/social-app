import { useRef, useState, useEffect, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import { useChatsStore, getFilteredChats } from '@/app/stores/chatsStore';
import { useAuthStore } from '@/app/stores/authStore';
import { Avatar } from '@/shared/components/ui/Avatar';
import { AppText } from '@/shared/components/ui/AppText';
import type { ChatWithUser } from '@/features/chats/domain/entities';
import { spacing } from '@/shared/theme/spacing';
import { DEBOUNCE_MS } from '@/shared/constants';
import { styles } from './styles';

interface SearchBarProps {
  onChatPress: (chat: ChatWithUser) => void;
}

export function SearchBar({ onChatPress }: SearchBarProps) {
  const c = useTheme();
  const { t } = useTranslation();
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const [localQuery, setLocalQuery] = useState('');

  const setSearchQuery = useChatsStore((s) => s.setSearchQuery);
  const recentSearches = useChatsStore((s) => s.recentSearches);
  const addRecentSearch = useChatsStore((s) => s.addRecentSearch);
  const clearRecentSearches = useChatsStore((s) => s.clearRecentSearches);
  const chats = useChatsStore((s) => s.chats);
  const user = useAuthStore((s) => s.user);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchQuery(localQuery);
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [localQuery, setSearchQuery]);

  const searchResults = localQuery.trim() ? getFilteredChats(chats, 'all', user?.id || '', localQuery) : [];

  const handleSelect = useCallback(
    (chat: ChatWithUser) => {
      if (localQuery.trim()) addRecentSearch(localQuery.trim());
      setLocalQuery('');
      setSearchQuery('');
      setFocused(false);
      inputRef.current?.blur();
      onChatPress(chat);
    },
    [localQuery, addRecentSearch, setSearchQuery, onChatPress],
  );

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <View style={[styles.inputWrap, { backgroundColor: c.surface, borderColor: focused ? c.primary : c.border }]}>
        <Ionicons name="search" size={18} color={c.textSecondary} style={styles.searchIcon} />
        <TextInput
          ref={inputRef}
          value={localQuery}
          onChangeText={setLocalQuery}
          placeholder={t('chats.searchHint')}
          placeholderTextColor={c.textTertiary}
          style={[styles.input, { color: c.text }]}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          returnKeyType="search"
          autoCorrect={false}
        />
        {localQuery.length > 0 && (
          <TouchableOpacity onPress={() => setLocalQuery('')} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={18} color={c.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {focused && !localQuery.trim() && recentSearches.length > 0 && (
        <View style={[styles.dropdown, { backgroundColor: c.surface, borderColor: c.border }]}>
          <View style={styles.recentHeader}>
            <AppText style={[styles.recentTitle, { color: c.textSecondary }]}>Recientes</AppText>
            <TouchableOpacity onPress={clearRecentSearches}>
              <AppText style={[styles.clearAll, { color: c.primary }]}>Limpiar</AppText>
            </TouchableOpacity>
          </View>
          {recentSearches.map((q) => (
            <TouchableOpacity key={q} style={styles.recentItem} onPress={() => setLocalQuery(q)}>
              <Ionicons name="time-outline" size={18} color={c.textSecondary} />
              <AppText style={[styles.recentText, { color: c.text }]}>{q}</AppText>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {focused && localQuery.trim() && searchResults.length > 0 && (
        <View style={[styles.dropdown, { backgroundColor: c.surface, borderColor: c.border }]}>
          <AppText
            style={[
              styles.recentTitle,
              { color: c.textSecondary, paddingHorizontal: spacing.md, marginBottom: spacing.xs },
            ]}
          >
            Resultados
          </AppText>
          <FlatList
            data={searchResults.slice(0, 5)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.resultItem} onPress={() => handleSelect(item)}>
                <Avatar photoURL={item.otherUserPhoto} name={item.otherUserName} size="sm" />
                <View style={styles.resultInfo}>
                  <AppText style={[styles.resultName, { color: c.text }]} numberOfLines={1}>
                    {item.otherUserName}
                  </AppText>
                  <AppText style={[styles.resultMsg, { color: c.textSecondary }]} numberOfLines={1}>
                    {item.lastMessage}
                  </AppText>
                </View>
              </TouchableOpacity>
            )}
            style={{ maxHeight: 260 }}
          />
        </View>
      )}
    </View>
  );
}
