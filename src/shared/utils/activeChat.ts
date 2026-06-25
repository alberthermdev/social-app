let activeChatId: string | null = null;

export function setActiveChatId(chatId: string | null) {
  activeChatId = chatId;
}

export function getActiveChatId(): string | null {
  return activeChatId;
}
