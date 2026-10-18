import { useQuery } from '@tanstack/react-query';
import { roomApi } from '../api/roomApi';
import { RoomFilters, CampusRoom } from '../types';

export const ROOMS_QUERY_KEY = 'rooms';

export function useRoomsQuery(filters: RoomFilters) {
  return useQuery<CampusRoom[]>({
    queryKey: [ROOMS_QUERY_KEY, filters],
    queryFn: () => roomApi.getRooms(filters),
  });
}

export function useRoomDetailQuery(roomId: string) {
  return useQuery<CampusRoom | null>({
    queryKey: ['room', roomId],
    queryFn: () => roomApi.getRoomById(roomId),
    enabled: !!roomId,
  });
}
