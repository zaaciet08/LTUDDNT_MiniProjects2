import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { roomApi } from '../api/roomApi';
import { BookingRecord } from '../types';
import { SLOTS_QUERY_KEY } from './useSlotsQuery';
import { ROOMS_QUERY_KEY } from './useRoomsQuery';

export const USER_BOOKINGS_QUERY_KEY = 'user-bookings';

export function useUserBookingsQuery(studentId: string) {
  return useQuery<BookingRecord[]>({
    queryKey: [USER_BOOKINGS_QUERY_KEY, studentId],
    queryFn: () => roomApi.getUserBookings(studentId),
    enabled: !!studentId,
  });
}

export function useCreateBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      roomId: string;
      date: string;
      startTime: string;
      endTime: string;
      studentId: string;
      studentName: string;
      purpose: string;
      attendeesCount: number;
    }) => roomApi.createBooking(payload),

    onSuccess: (newBooking) => {
      // Invalidate relevant queries so UI immediately updates
      queryClient.invalidateQueries({
        queryKey: [SLOTS_QUERY_KEY, newBooking.roomId, newBooking.date],
      });
      queryClient.invalidateQueries({ queryKey: [USER_BOOKINGS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ROOMS_QUERY_KEY] });
    },
  });
}

export function useCancelBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => roomApi.cancelBooking(bookingId),

    onSuccess: (cancelledBooking) => {
      // Release slot in queries
      queryClient.invalidateQueries({
        queryKey: [SLOTS_QUERY_KEY, cancelledBooking.roomId, cancelledBooking.date],
      });
      queryClient.invalidateQueries({ queryKey: [USER_BOOKINGS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ROOMS_QUERY_KEY] });
    },
  });
}
