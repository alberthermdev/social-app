export const APP_NAME = 'Centri Social';
export const DEFAULT_ABOUT = 'Hey there! I am using Centri Social';
export const MESSAGE_PAGE_SIZE = 30;
export const DEBOUNCE_MS = 300;
export const TYPING_TIMEOUT_MS = 3000;
export const MAX_IMAGE_SIZE_MB = 5;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const COLLECTIONS = {
  USERS: 'users',
  CHATS: 'chats',
  MESSAGES: 'messages',
  USER_SETTINGS: 'user_settings',
  USER_STATS: 'user_stats',
} as const;

export const PRIVACY_OPTIONS = ['everyone', 'contacts', 'nobody'] as const;

export const TEXT_SIZE_OPTIONS = ['small', 'normal', 'large'] as const;

export const STATUS_PRESETS = [
  'Disponible',
  'Trabajando',
  'Ocupado',
  'En una reunión',
  'De viaje',
  'Durmiendo',
  'Solo urgentes',
] as const;
