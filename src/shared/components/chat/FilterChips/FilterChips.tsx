import { useRef } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import { useChatsStore, type ChatFilter } from '@/app/stores/chatsStore';
import { AppText } from '@/shared/components/ui/AppText';
import { spacing } from '@/shared/theme/spacing';
import { styles } from './styles';

const filters: { key: ChatFilter; labelKey: string }[] = [
  { key: 'all', labelKey: 'chats.all' },
  { key: 'unread', labelKey: 'chats.unread' },
  { key: 'favorites', labelKey: 'chats.favorites' },
  { key: 'groups', labelKey: 'chats.groups' },
  { key: 'archived', labelKey: 'chats.archived' },
  { key: 'muted', labelKey: 'chats.muted' },
];

export function FilterChips() {
  const c = useTheme();
  const { t } = useTranslation();
  const activeFilter = useChatsStore((s) => s.activeFilter);
  const setActiveFilter = useChatsStore((s) => s.setActiveFilter);
  const scrollRef = useRef<ScrollView>(null);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.container, { paddingLeft: spacing.lg }]}
      style={{ backgroundColor: c.background }}
    >
      {filters.map((f) => {
        const isActive = activeFilter === f.key;
        return (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.chip,
              {
                backgroundColor: isActive ? c.primary : c.surface,
                borderColor: isActive ? c.primary : c.border,
              },
            ]}
            onPress={() => setActiveFilter(f.key)}
            activeOpacity={0.7}
            accessibilityLabel={t(f.labelKey)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <AppText
              style={[styles.label, { color: isActive ? '#FFFFFF' : c.text }]}
              weight={isActive ? 'semiBold' : 'regular'}
            >
              {t(f.labelKey)}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
