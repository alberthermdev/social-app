import { create } from 'zustand';

interface ChatState {
  activeChatId: string | null;
  setActiveChatId: (chatId: string | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeChatId: null,
  setActiveChatId: (chatId) => set({ activeChatId: chatId }),
}));
