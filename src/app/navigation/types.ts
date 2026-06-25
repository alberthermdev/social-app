export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  Appearance: undefined;
  Privacy: undefined;
  Notifications: undefined;
  ChatPreferences: undefined;
  Security: undefined;
  DataStorage: undefined;
  Help: undefined;
};

export type MainTabParamList = {
  Chats: undefined;
  Contacts: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  ChatList: undefined;
  ChatDetail: { chatId: string; otherUserName?: string; otherUserPhoto?: string | null; otherUserOnline?: boolean };
  NotificationsList: undefined;
};
