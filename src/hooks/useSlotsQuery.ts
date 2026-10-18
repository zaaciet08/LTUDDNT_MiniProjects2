import { useQuery } from '@tanstack/react-query';
import { roomApi } from '../api/roomApi';
import { TimeSlot } from '../types';

export const SLOTS_QUERY_KEY = 'room-slots';

export function useRoomSlotsQuery(roomId: string, date: string) {
  return useQuery<TimeSlot[]>({
    queryKey: [SLOTS_QUERY_KEY, roomId, date],
    queryFn: () => roomApi.getRoomSlots(roomId, date),
    enabled: !!roomId && !!date,
  });
}
