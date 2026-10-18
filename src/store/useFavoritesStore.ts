import { create } from 'zustand';

interface FavoritesState {
  favoriteIds: string[];
  toggleFavorite: (roomId: string) => void;
  isFavorite: (roomId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteIds: ['room-1', 'room-2'], // default bookmarked rooms

  toggleFavorite: (roomId: string) =>
    set((state) => {
      const exists = state.favoriteIds.includes(roomId);
      return {
        favoriteIds: exists
          ? state.favoriteIds.filter((id) => id !== roomId)
          : [...state.favoriteIds, roomId],
      };
    }),

  isFavorite: (roomId: string) => get().favoriteIds.includes(roomId),
}));
