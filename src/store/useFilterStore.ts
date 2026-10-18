import { create } from 'zustand';
import { RoomFilters, RoomType, RoomBuilding, Amenity } from '../types';

interface FilterState extends RoomFilters {
  setSearch: (search: string) => void;
  setRoomType: (type: RoomType | 'all') => void;
  setBuilding: (building: RoomBuilding | 'all') => void;
  setCapacityMin: (capacity: number) => void;
  toggleAmenity: (amenity: Amenity) => void;
  setOnlyAvailableNow: (onlyAvailable: boolean) => void;
  resetFilters: () => void;
  activeFilterCount: () => number;
}

const initialFilters: RoomFilters = {
  search: '',
  roomType: 'all',
  building: 'all',
  capacityMin: 0,
  amenities: [],
  onlyAvailableNow: false,
};

export const useFilterStore = create<FilterState>((set, get) => ({
  ...initialFilters,

  setSearch: (search: string) => set({ search }),

  setRoomType: (roomType: RoomType | 'all') => set({ roomType }),

  setBuilding: (building: RoomBuilding | 'all') => set({ building }),

  setCapacityMin: (capacityMin: number) => set({ capacityMin }),

  toggleAmenity: (amenity: Amenity) =>
    set((state) => {
      const exists = state.amenities.includes(amenity);
      return {
        amenities: exists
          ? state.amenities.filter((a) => a !== amenity)
          : [...state.amenities, amenity],
      };
    }),

  setOnlyAvailableNow: (onlyAvailableNow: boolean) => set({ onlyAvailableNow }),

  resetFilters: () => set({ ...initialFilters }),

  activeFilterCount: () => {
    const s = get();
    let count = 0;
    if (s.roomType !== 'all') count++;
    if (s.building !== 'all') count++;
    if (s.capacityMin > 0) count++;
    if (s.amenities.length > 0) count += s.amenities.length;
    if (s.onlyAvailableNow) count++;
    return count;
  },
}));
