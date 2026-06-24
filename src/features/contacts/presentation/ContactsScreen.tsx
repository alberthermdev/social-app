import { useState, useEffect, useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FirestoreContactRepository } from '@/features/contacts/infrastructure/FirestoreContactRepository';
import { FirestoreChatRepository } from '@/features/chats/infrastructure/FirestoreChatRepository';
import { ContactUser } from '@/features/contacts/domain/entities';
import { useAuthStore } from '@/app/stores/authStore';
import { useTheme } from '@/shared/hooks/useTheme';
import { Avatar } from '@/shared/components/ui/Avatar';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { LoadingScreen } from '@/shared/components/feedback/LoadingScreen';
import { Input } from '@/shared/components/ui/Input';
import { spacing, fontSize, fontFamily } from '@/shared/theme/spacing';
import { MainStackParamList } from '@/app/navigation/types';

export function ContactsScreen() {
  const { t } = useTranslation();
  const c = useTheme();
  const { user } = useAuthStore();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [contacts, setContacts] = useState<ContactUser[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: c.background },
        searchContainer: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
        contactItem: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          borderBottomWidth: 0.5,
          borderBottomColor: c.border,
        },
        contactInfo: { flex: 1, marginLeft: spacing.md },
        contactName: {
          fontSize: fontSize.md,
          fontFamily: fontFamily.semiBold,
          color: c.text,
          marginBottom: spacing.xs,
        },
        contactStatus: { fontSize: fontSize.sm, color: c.textSecondary },
        emptyList: { flexGrow: 1 },
      }),
    [c],
  );

  const loadContacts = useCallback(async () => {
    if (!user) return;
    const allUsers = await FirestoreContactRepository.getAllUsers(user.id);
    setContacts(allUsers);
    setLoading(false);
    setRefreshing(false);
  }, [user]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const handleContactPress = async (contactId: string) => {
    if (!user) return;
    try {
      const chatId = await FirestoreChatRepository.getOrCreateChat(user.id, contactId);
      navigation.navigate('ChatDetail', { chatId });
    } catch (e) {
      Alert.alert('Error', (e as Error).message);
    }
  };

  const filteredContacts = search
    ? contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()),
      )
    : contacts;

  if (loading) return <LoadingScreen />;

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <View style={styles.searchContainer}>
        <Input placeholder={t('contacts.search')} value={search} onChangeText={setSearch} />
      </View>
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.contactItem} onPress={() => handleContactPress(item.id)} activeOpacity={0.7}>
            <Avatar photoURL={item.photoURL} name={item.name} size="lg" online={item.online} showStatus />
            <View style={styles.contactInfo}>
              <AppText style={styles.contactName} maxFontSizeMultiplier={1.3}>
                {item.name}
              </AppText>
              <AppText style={styles.contactStatus} maxFontSizeMultiplier={1.3}>
                {item.online ? t('contacts.online') : item.about || t('contacts.defaultAbout')}
              </AppText>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="people"
            title={t('contacts.noContacts')}
            description={search ? t('contacts.noContactsSearch') : t('contacts.noUsers')}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadContacts();
            }}
            tintColor={c.primary}
          />
        }
        contentContainerStyle={filteredContacts.length === 0 ? styles.emptyList : undefined}
      />
    </SafeAreaView>
  );
}
