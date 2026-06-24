import i18n from 'i18next';

export function formatLastSeen(timestamp: number | null): string {
  if (!timestamp) return '';

  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return i18n.t('time.justNow');
  if (minutes < 60) return i18n.t('time.minutes', { count: minutes });
  if (hours < 24) return i18n.t('time.hours', { count: hours });
  if (days === 1) return i18n.t('time.yesterday');
  if (days < 7) return i18n.t('time.days', { count: days });

  const date = new Date(timestamp);
  return date.toLocaleDateString(i18n.language, { month: 'short', day: 'numeric' });
}

export function formatMessageTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' });
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return i18n.t('time.yesterday');

  return date.toLocaleDateString(i18n.language, { month: 'short', day: 'numeric' });
}

export function formatChatListTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' });
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return i18n.t('time.yesterday');

  return date.toLocaleDateString(i18n.language, { month: 'short', day: 'numeric' });
}
