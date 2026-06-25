const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { Expo } = require('expo-server-sdk');

initializeApp();
const expo = new Expo();

exports.onMessageCreated = onDocumentCreated(
  {
    document: 'messages/{messageId}',
    region: 'us-central1',
  },
  async (event) => {
    const message = event.data?.data();
    if (!message) return;

    const { chatId, senderId, content } = message;
    if (!chatId || !senderId || !content) return;

    const db = getFirestore();

    // Fetch chat to get participants
    const chatSnap = await db.collection('chats').doc(chatId).get();
    if (!chatSnap.exists) return;
    const chatData = chatSnap.data();
    if (!chatData) return;

    const participants = chatData.participants || [];
    const recipientId = participants.find((p) => p !== senderId);
    if (!recipientId) return;

    // Fetch sender info
    const senderSnap = await db.collection('users').doc(senderId).get();
    const senderName = senderSnap.data()?.name || 'Someone';

    // Fetch recipient's push token
    const tokenSnap = await db.collection('user_push_tokens').doc(recipientId).get();
    const pushToken = tokenSnap.data()?.token;
    if (!pushToken) return;

    // Validate Expo push token (already stored as "ExponentPushToken[...]")
    if (!Expo.isExpoPushToken(pushToken)) return;

    // Create notification document for in-app display
    const notifRef = db.collection('notifications').doc();
    await notifRef.set({
      targetUserId: recipientId,
      type: 'message',
      title: senderName,
      body: content,
      senderId,
      senderName,
      senderPhoto: senderSnap.data()?.photoURL || null,
      chatId,
      read: false,
      createdAt: new Date(),
    });

    // Send push notification via Expo
    const messages = [
      {
        to: pushToken,
        sound: 'default',
        title: senderName,
        body: content,
        data: {
          chatId,
          senderId,
          type: 'message',
        },
        priority: 'high',
      },
    ];

    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(messages);
      console.log('Push sent:', JSON.stringify(ticketChunk));
    } catch (error) {
      console.error('Push send error:', error);
    }
  },
);
