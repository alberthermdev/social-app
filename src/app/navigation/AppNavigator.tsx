import { useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/app/stores/authStore';
import { useSettingsStore } from '@/app/stores/settingsStore';
import { useTheme } from '@/shared/hooks/useTheme';
import { LoginScreen } from '@/features/auth/presentation/LoginScreen';
import { RegisterScreen } from '@/features/auth/presentation/RegisterScreen';
import { ForgotPasswordScreen } from '@/features/auth/presentation/ForgotPasswordScreen';
import { ChatsListScreen } from '@/features/chats/presentation/ChatsListScreen';
import { ChatScreen } from '@/features/messages/presentation/ChatScreen';
import { ContactsScreen } from '@/features/contacts/presentation/ContactsScreen';
import { ProfileScreen } from '@/features/profile/presentation/profile';
import { EditProfileScreen } from '@/features/profile/presentation/edit-profile';
import { AppearanceScreen } from '@/features/profile/presentation/appearance';
import { PrivacyScreen } from '@/features/profile/presentation/privacy';
import { NotificationsScreen } from '@/features/profile/presentation/notifications';
import { ChatPreferencesScreen } from '@/features/profile/presentation/chat-preferences';
import { SecurityScreen } from '@/features/profile/presentation/security';
import { DataStorageScreen } from '@/features/profile/presentation/data-storage';
import { HelpScreen } from '@/features/profile/presentation/help';
import {
  AuthStackParamList,
  ProfileStackParamList,
  MainTabParamList,
  MainStackParamList,
} from '@/app/navigation/types';
import { colors } from '@/shared/theme/colors';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

function useIsDark(): boolean {
  const theme = useSettingsStore((s) => s.theme);
  const systemScheme = useColorScheme();
  return useMemo(() => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return systemScheme === 'dark';
  }, [theme, systemScheme]);
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

function ProfileNavigator() {
  const { t } = useTranslation();
  const palette = useTheme();

  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: palette.primary },
        headerTintColor: '#FFFFFF',
      }}
    >
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: t('profile.title') }} />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: t('profile.editProfile') }}
      />
      <ProfileStack.Screen
        name="Appearance"
        component={AppearanceScreen}
        options={{ title: t('profile.appearance') }}
      />
      <ProfileStack.Screen name="Privacy" component={PrivacyScreen} options={{ title: t('profile.privacy') }} />
      <ProfileStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: t('profile.notifications') }}
      />
      <ProfileStack.Screen
        name="ChatPreferences"
        component={ChatPreferencesScreen}
        options={{ title: t('profile.chatPrefs') }}
      />
      <ProfileStack.Screen name="Security" component={SecurityScreen} options={{ title: t('profile.security') }} />
      <ProfileStack.Screen
        name="DataStorage"
        component={DataStorageScreen}
        options={{ title: t('profile.dataManagement') }}
      />
      <ProfileStack.Screen name="Help" component={HelpScreen} options={{ title: t('profile.help') }} />
    </ProfileStack.Navigator>
  );
}

function MainTabs() {
  const { t } = useTranslation();
  const palette = useTheme();

  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Chats: 'chatbubbles',
            Contacts: 'people',
            Profile: 'person',
          };
          return <Ionicons name={icons[route.name] || 'ellipse'} size={size} color={color} />;
        },
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.textSecondary,
        headerStyle: { backgroundColor: palette.primary },
        headerTintColor: '#FFFFFF',
        tabBarStyle: { backgroundColor: palette.tabBar, borderTopColor: palette.border },
      })}
    >
      <MainTab.Screen name="Chats" component={ChatsListScreen} options={{ title: t('chats.title') }} />
      <MainTab.Screen name="Contacts" component={ContactsScreen} options={{ title: t('contacts.title') }} />
      <MainTab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{ title: t('profile.title'), headerShown: false }}
      />
    </MainTab.Navigator>
  );
}

function MainNavigator() {
  const { t } = useTranslation();
  const palette = useTheme();

  return (
    <MainStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: palette.primary },
        headerTintColor: '#FFFFFF',
      }}
    >
      <MainStack.Screen name="ChatList" component={MainTabs} options={{ headerShown: false }} />
      <MainStack.Screen name="ChatDetail" component={ChatScreen} options={{ title: t('chat.title') }} />
    </MainStack.Navigator>
  );
}

export function AppNavigator() {
  const { user, loading, useCases, setUser } = useAuthStore();
  const isDark = useIsDark();

  useEffect(() => {
    const unsubscribe = useCases.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });
    return unsubscribe;
  }, [useCases, setUser]);

  const navTheme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: colors.dark.primary,
          background: colors.dark.background,
          card: colors.dark.surface,
          text: colors.dark.text,
          border: colors.dark.border,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: colors.light.primary,
          background: colors.light.background,
          card: colors.light.surface,
          text: colors.light.text,
          border: colors.light.border,
        },
      };

  if (loading) return null;

  return <NavigationContainer theme={navTheme}>{user ? <MainNavigator /> : <AuthNavigator />}</NavigationContainer>;
}
