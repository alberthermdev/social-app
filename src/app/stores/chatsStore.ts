import { create } from 'zustand';
import { FirestoreChatRepository } from '@/features/chats/infrastructure/FirestoreChatRepository';
import { FirestoreContactRepository } from '@/features/contacts/infrastructure/FirestoreContactRepository';
import { type Chat, type ChatWithUser } from '@/features/chats/domain/entities';

export type ChatFilter = 'all' | 'unread' | 'favorites' | 'groups' | 'archived' | 'muted';

interface ChatsState {
  chats: ChatWithUser[];
  activeFilter: ChatFilter;
  searchQuery: string;
  recentSearches: string[];
  loading: boolean;
  error: string | null;
  archivedCount: number;
  unreadTotal: number;

  subscribe: (userId: string) => () => void;
  setActiveFilter: (filter: ChatFilter) => void;
  setSearchQuery: (query: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  togglePin: (chatId: string, userId: string) => Promise<void>;
  toggleArchive: (chatId: string, userId: string) => Promise<void>;
  toggleFavorite: (chatId: string, userId: string) => Promise<void>;
  toggleMute: (chatId: string, userId: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  markAsRead: (chatId: string, userId: string) => Promise<void>;
  clearError: () => void;
}

export const useChatsStore = create<ChatsState>((set, get) => ({
  chats: [],
  activeFilter: 'all',
  searchQuery: '',
  recentSearches: [],
  loading: true,
  error: null,
  archivedCount: 0,
  unreadTotal: 0,

  subscribe: (userId: string) => {
    const loadingTimeout = setTimeout(() => {
      set((s) => {
        if (s.loading)
          return { loading: false, error: 'Tiempo de espera agotado. Verifica tu conexión e índice de Firestore.' };
        return {};
      });
    }, 15000);

    const unsubscribe = FirestoreChatRepository.subscribeToChats(
      userId,
      async (chats) => {
        clearTimeout(loadingTimeout);
        try {
          const enriched = await Promise.all(
            chats.map(async (chat: Chat): Promise<ChatWithUser> => {
              if (chat.isGroup) {
                return {
                  ...chat,
                  otherUserName: chat.groupName || 'Grupo',
                  otherUserPhoto: chat.groupPhoto || null,
                  otherUserOnline: false,
                  otherUserLastSeen: 0,
                };
              }
              const otherId = chat.participants.find((p) => p !== userId) || '';
              try {
                const user = await FirestoreContactRepository.getUserById(otherId);
                return {
                  ...chat,
                  otherUserName: user?.name || 'Usuario',
                  otherUserPhoto: user?.photoURL || null,
                  otherUserOnline: user?.online || false,
                  otherUserLastSeen: user?.lastSeen || 0,
                };
              } catch {
                return {
                  ...chat,
                  otherUserName: 'Usuario',
                  otherUserPhoto: null,
                  otherUserOnline: false,
                  otherUserLastSeen: 0,
                };
              }
            }),
          );

          set({
            chats: enriched,
            loading: false,
            error: null,
            archivedCount: enriched.filter((c) => c.archivedBy.includes(userId)).length,
            unreadTotal: enriched.reduce((acc, c) => {
              if (c.archivedBy.includes(userId)) return acc;
              return acc + (c.unreadCount[userId] || 0);
            }, 0),
          });
        } catch {
          set({ error: 'Error al cargar chats', loading: false });
        }
      },
      (error) => {
        clearTimeout(loadingTimeout);
        set({
          error: `Error de conexión: ${error.message}. Asegúrate de haber desplegado el índice compuesto de Firestore.`,
          loading: false,
        });
      },
    );

    return () => {
      clearTimeout(loadingTimeout);
      unsubscribe();
    };
  },

  setActiveFilter: (filter) => set({ activeFilter: filter }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  addRecentSearch: (query) => {
    const { recentSearches } = get();
    const filtered = recentSearches.filter((s) => s !== query);
    set({ recentSearches: [query, ...filtered].slice(0, 10) });
  },

  clearRecentSearches: () => set({ recentSearches: [] }),

  togglePin: async (chatId, userId) => {
    const { chats } = get();
    const idx = chats.findIndex((c) => c.id === chatId);
    if (idx === -1) return;
    const chat = chats[idx];
    const isPinned = chat.pinnedBy.includes(userId);
    const updated = {
      ...chat,
      pinnedBy: isPinned ? chat.pinnedBy.filter((id) => id !== userId) : [...chat.pinnedBy, userId],
    };
    const newChats = [...chats];
    newChats[idx] = updated;
    set({ chats: newChats });
    try {
      await FirestoreChatRepository.togglePinned(chatId, userId);
    } catch {
      set({ chats });
    }
  },

  toggleArchive: async (chatId, userId) => {
    const { chats } = get();
    const idx = chats.findIndex((c) => c.id === chatId);
    if (idx === -1) return;
    const chat = chats[idx];
    const isArchived = chat.archivedBy.includes(userId);
    const updated = {
      ...chat,
      archivedBy: isArchived ? chat.archivedBy.filter((id) => id !== userId) : [...chat.archivedBy, userId],
    };
    const newChats = [...chats];
    newChats[idx] = updated;
    const archivedCount = newChats.filter((c) => c.archivedBy.includes(userId)).length;
    set({ chats: newChats, archivedCount });
    try {
      await FirestoreChatRepository.toggleArchived(chatId, userId);
    } catch {
      const reverted = get().chats;
      const revertedArchived = reverted.filter((c) => c.archivedBy.includes(userId)).length;
      set({ chats: reverted, archivedCount: revertedArchived });
    }
  },

  toggleFavorite: async (chatId, userId) => {
    const { chats } = get();
    const idx = chats.findIndex((c) => c.id === chatId);
    if (idx === -1) return;
    const chat = chats[idx];
    const isFavorite = chat.favoriteBy.includes(userId);
    const updated = {
      ...chat,
      favoriteBy: isFavorite ? chat.favoriteBy.filter((id) => id !== userId) : [...chat.favoriteBy, userId],
    };
    const newChats = [...chats];
    newChats[idx] = updated;
    set({ chats: newChats });
    try {
      await FirestoreChatRepository.toggleFavorite(chatId, userId);
    } catch {
      set({ chats });
    }
  },

  toggleMute: async (chatId, userId) => {
    const { chats } = get();
    const idx = chats.findIndex((c) => c.id === chatId);
    if (idx === -1) return;
    const chat = chats[idx];
    const isMuted = chat.mutedBy.includes(userId);
    const updated = {
      ...chat,
      mutedBy: isMuted ? chat.mutedBy.filter((id) => id !== userId) : [...chat.mutedBy, userId],
    };
    const newChats = [...chats];
    newChats[idx] = updated;
    set({ chats: newChats });
    try {
      await FirestoreChatRepository.toggleMuted(chatId, userId);
    } catch {
      set({ chats });
    }
  },

  deleteChat: async (chatId) => {
    const { chats } = get();
    const newChats = chats.filter((c) => c.id !== chatId);
    set({ chats: newChats });
  },

  markAsRead: async (chatId, userId) => {
    const { chats } = get();
    const idx = chats.findIndex((c) => c.id === chatId);
    if (idx === -1) return;
    const chat = chats[idx];
    const updated = { ...chat, unreadCount: { ...chat.unreadCount, [userId]: 0 } };
    const newChats = [...chats];
    newChats[idx] = updated;
    const unreadTotal = newChats.reduce((acc, c) => acc + (c.unreadCount[userId] || 0), 0);
    set({ chats: newChats, unreadTotal });
    try {
      await FirestoreChatRepository.markAsRead(chatId, userId);
    } catch {
      set({ chats });
    }
  },

  clearError: () => set({ error: null }),
}));

export function getFilteredChats(
  chats: ChatWithUser[],
  filter: ChatFilter,
  userId: string,
  searchQuery: string,
): ChatWithUser[] {
  let filtered =
    filter === 'archived'
      ? chats.filter((c) => c.archivedBy.includes(userId))
      : chats.filter((c) => !c.archivedBy.includes(userId));

  switch (filter) {
    case 'unread':
      filtered = filtered.filter((c) => (c.unreadCount[userId] || 0) > 0);
      break;
    case 'favorites':
      filtered = filtered.filter((c) => c.favoriteBy.includes(userId));
      break;
    case 'groups':
      filtered = filtered.filter((c) => c.isGroup);
      break;
    case 'muted':
      filtered = filtered.filter((c) => c.mutedBy.includes(userId));
      break;
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.otherUserName.toLowerCase().includes(q) ||
        c.groupName?.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q),
    );
  }

  filtered.sort((a, b) => {
    if (a.pinnedBy.includes(userId) && !b.pinnedBy.includes(userId)) return -1;
    if (!a.pinnedBy.includes(userId) && b.pinnedBy.includes(userId)) return 1;
    return b.lastMessageAt - a.lastMessageAt;
  });

  return filtered;
}
