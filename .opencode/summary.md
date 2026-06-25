# Summary

## Goal
- Hacer funcional toda la app: builds APK, OTA updates, carga de chats, navegación, perfil, notificaciones, skeletons, persistencia de sesión, y chat UX/UI optimizado.

## Constraints & Preferences
- Builds preview deben producir `.apk` standalone.
- Login sin textos de marca ("Centri Social").
- Header del home compacto sin franja de saludo.
- Secciones de perfil no deben pegarse al header.
- Cerrar sesión visible en perfil.
- Todos los alerts deben usar modales personalizados con theme del proyecto, no `Alert.alert()` nativa.

## Progress
### Done
- Agregado perfil `development-apk` en `eas.json` para APK standalone.
- Creados canales y branches de EAS Update: `development`, `preview`, `production`.
- Corregida navegación a Profile tab desde `ChatsListScreen`.
- Corregido `QuickProfileHeader` que navegaba a `'ProfileTab'` inexistente → `'Profile'`.
- Agregado `onError` handler a `onSnapshot` en `FirestoreChatRepository`.
- Agregado timeout de 15s en `chatsStore.subscribe`.
- Agregados skeletons de stats en `ProfileScreen`.
- Conectado `NotificationsScreen` a `FirestoreProfileRepository`.
- Eliminada franja de saludo del `HomeHeader`.
- Eliminado texto de marca del `LoginScreen` y `RegisterScreen`.
- Agregado `persist` middleware de Zustand al `authStore`, `settingsStore`, `privacyStore` con `partialize`.
- Eliminado `themeStore.ts` (código muerto).
- Agregado botón de cerrar sesión (rojo) en `ProfileScreen` con confirmación.
- Corregido `SettingsRow` para que `onPress` funcione (envuelto en `TouchableOpacity`).
- Agregado `paddingTop: spacing.lg` y `SafeAreaView edges={['bottom']}` a las 8 sub-páginas de perfil.
- Convertidos todos los `useAuthStore()`, `useSettingsStore()`, `usePrivacyStore()` a selectores individuales.
- Creado componente `ConfirmModal` y reemplazados los 21 `Alert.alert()` nativos.
- Actualizada navegación a `ChatDetail` con `otherUserName`, `otherUserPhoto`, `otherUserOnline`.
- Actualizados `ChatCard`, `SearchBar`, `PinnedChatsSection` para pasar `ChatWithUser` completo.
- **ChatScreen mejorado**: header con datos del otro usuario, fecha separadora, scroll automático, KeyboardAvoidingView, botón de adjuntar en InputBar.
- **MessageBubble mejorado**: soporte para `showSenderName`, colores de burbuja propios/otros, icono de estado del mensaje (enviado/entregado/leído).

### In Progress
- (none)

### Blocked
- (none)

## Key Decisions
- Usar `development-apk` en vez de modificar `development` para no romper flujo de desarrollo.
- `ConfirmModal` usa `Modal` nativo con overlay touch para dismiss, sigue patrón de `PickerModal` y `ProfileAvatarMenu`.
- Selectores individuales de Zustand en vez de destructuring para aislar re-renders por propiedad.
- `partialize` en todos los stores persistidos para guardar solo datos, no funciones.
- Pasar `ChatWithUser` completo desde ChatsListScreen a ChatDetail para evitar fetch extra.
- Scroll automático solo cuando aumentan los mensajes (no en contentSizeChange inicial).

## Next Steps
- Conectar pantalla de contacto al chat: `handleContactPress` debe pasar user data al navegar.
- Agregar gestión de fotos/archivos en InputBar (attachment real).
- Implementar `showSenderName` en grupos.

## Critical Context
- Los builds de EAS tardan ~5-20 min; timeout del CLI local es 5 min.
- Índice compuesto de Firestore (`chats` con `participants` array-contains + `lastMessageAt` desc) definido en `firestore.indexes.json` pero no desplegado.
- `onSnapshot` sin error handler causa carga infinita: ya corregido.
- Warnings pre-existentes de `@typescript-eslint/no-explicit-any` en `QuickProfileHeader` y `SearchUsersModal`.
- No queda ningún `Alert.alert()` nativo en el proyecto.
- `typecheck` y `lint` pasan sin errores.

## Relevant Files
- `src/features/messages/presentation/ChatScreen.tsx`: rewrite completo con header de usuario, date separators, scroll automático, KeyboardAvoidingView.
- `src/shared/components/chat/MessageBubble/MessageBubble.tsx`: agregado `showSenderName`, status icon, estilos own/other.
- `src/shared/components/chat/MessageBubble/styles.ts`: creado con `createStyles`.
- `src/shared/components/chat/InputBar/InputBar.tsx`: agregado botón de adjuntar.
- `src/shared/components/chat/InputBar/styles.ts`: creado con `createStyles`.
- `src/features/chats/presentation/ChatsListScreen.tsx`: import `ChatWithUser` para `handleChatPress`.
- `src/shared/components/chat/SearchBar/SearchBar.tsx`: `onChatPress` recibe `ChatWithUser`.
- `src/shared/components/chat/PinnedChatsSection/PinnedChatsSection.tsx`: `onChatPress` recibe `ChatWithUser`.
