import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import { styles } from './styles';

interface ChatsHeaderProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  showArchived: boolean;
  onToggleArchived: () => void;
  showFavorites: boolean;
  onToggleFavorites: () => void;
}

export function ChatsHeader({
  searchQuery,
  onSearchChange,
  showArchived,
  onToggleArchived,
  showFavorites,
  onToggleFavorites,
}: ChatsHeaderProps) {
  const { t } = useTranslation();
  const c = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: c.surface }]}>
      <View style={[styles.searchBar, { backgroundColor: c.background }]}>
        <Ionicons name="search" size={18} color={c.textTertiary} />
        <TextInput
          style={[styles.input, { color: c.text }]}
          placeholder={t('common.search')}
          placeholderTextColor={c.textTertiary}
          value={searchQuery}
          onChangeText={onSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
          maxFontSizeMultiplier={1.3}
        />
      </View>
      <TouchableOpacity onPress={onToggleFavorites} style={styles.iconBtn}>
        <Ionicons
          name={showFavorites ? 'star' : 'star-outline'}
          size={22}
          color={showFavorites ? c.warning : c.textSecondary}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onToggleArchived} style={styles.iconBtn}>
        <Ionicons
          name={showArchived ? 'archive' : 'archive-outline'}
          size={22}
          color={showArchived ? c.primary : c.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
}
