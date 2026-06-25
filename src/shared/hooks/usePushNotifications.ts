import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { doc, setDoc } from 'firebase/firestore';
import { getFirestoreDb } from '@/core/firebase/config';
import { useAuthStore } from '@/app/stores/authStore';
import { getActiveChatId } from '@/shared/utils/activeChat';

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const chatId = notification.request.content.data?.chatId as string | undefined;
    const isInChat = chatId && chatId === getActiveChatId();

    return {
      shouldShowAlert: !isInChat,
      shouldPlaySound: !isInChat,
      shouldSetBadge: true,
      shouldShowBanner: !isInChat,
      shouldShowList: !isInChat,
    };
  },
});

const COLLECTION = 'user_push_tokens';

async function registerForPushNotificationsAsync(userId: string): Promise<string | null> {
  if (!Device.isDevice) {
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
  });
  const token = tokenData.data;

  const db = getFirestoreDb();
  await setDoc(doc(db, COLLECTION, userId), {
    token,
    platform: Platform.OS,
    updatedAt: Date.now(),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#5865F2',
    });
  }

  return token;
}

export function usePushNotifications() {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user?.id) return;

    registerForPushNotificationsAsync(user.id);

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(() => {});

    return () => {
      responseSubscription.remove();
    };
  }, [user?.id]);
}
