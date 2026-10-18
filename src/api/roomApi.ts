import { CampusRoom, TimeSlot, BookingRecord, RoomFilters } from '../types';
import { INITIAL_ROOMS, generateInitialSlots, INITIAL_USER_BOOKINGS } from './mockData';

// In-memory persistent database simulating server state
let inMemoryRooms: CampusRoom[] = [...INITIAL_ROOMS];
let inMemorySlots: TimeSlot[] = generateInitialSlots();
let inMemoryBookings: BookingRecord[] = [...INITIAL_USER_BOOKINGS];

// Synchronize initial bookings with slot status
INITIAL_USER_BOOKINGS.forEach((booking) => {
  const targetSlot = inMemorySlots.find(
    (s) => s.roomId === booking.roomId && s.date === booking.date && s.startTime === booking.startTime
  );
  if (targetSlot) {
    targetSlot.isBooked = true;
    targetSlot.bookedByStudentId = booking.studentId;
    targetSlot.bookedByName = booking.studentName;
    targetSlot.purpose = booking.purpose;
  }
});

const delay = (ms: number = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const roomApi = {
  // Fetch filtered campus rooms
  async getRooms(filters: RoomFilters): Promise<CampusRoom[]> {
    await delay(200);

    return inMemoryRooms.filter((room) => {
      // 1. Text Search
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchesName = room.name.toLowerCase().includes(query);
        const matchesCode = room.code.toLowerCase().includes(query);
        const matchesDept = room.department.toLowerCase().includes(query);
        const matchesDesc = room.description.toLowerCase().includes(query);
        if (!matchesName && !matchesCode && !matchesDept && !matchesDesc) {
          return false;
        }
      }

      // 2. Room Type filter
      if (filters.roomType !== 'all' && room.type !== filters.roomType) {
        return false;
      }

      // 3. Building filter
      if (filters.building !== 'all' && room.building !== filters.building) {
        return false;
      }

      // 4. Capacity filter
      if (room.capacity < filters.capacityMin) {
        return false;
      }

      // 5. Selected Amenities (Must possess all checked amenities)
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every((amenity) =>
          room.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }

      // 6. Only available now
      if (filters.onlyAvailableNow && !room.isAvailableNow) {
        return false;
      }

      return true;
    });
  },

  // Fetch single room details
  async getRoomById(id: string): Promise<CampusRoom | null> {
    await delay(150);
    const room = inMemoryRooms.find((r) => r.id === id);
    return room || null;
  },

  // Fetch slots for a given room and date
  async getRoomSlots(roomId: string, date: string): Promise<TimeSlot[]> {
    await delay(200);
    const slots = inMemorySlots.filter((s) => s.roomId === roomId && s.date === date);
    return [...slots];
  },

  // Create booking with strict conflict prevention
  async createBooking(payload: {
    roomId: string;
    date: string;
    startTime: string;
    endTime: string;
    studentId: string;
    studentName: string;
    purpose: string;
    attendeesCount: number;
  }): Promise<BookingRecord> {
    await delay(350);

    const room = inMemoryRooms.find((r) => r.id === payload.roomId);
    if (!room) {
      throw new Error('Room not found on campus directory.');
    }

    // 1. Conflict Prevention Check: Is this slot already reserved?
    const slot = inMemorySlots.find(
      (s) => s.roomId === payload.roomId && s.date === payload.date && s.startTime === payload.startTime
    );

    if (!slot) {
      throw new Error('The selected time slot does not exist.');
    }

    if (slot.isBooked) {
      throw new Error(
        `[CONFLICT] Slot ${slot.label} has already been reserved by ${slot.bookedByName || 'another student'}. Please choose an alternative slot.`
      );
    }

    // 2. Conflict Prevention Check: Does user have an overlapping active booking at this date/time?
    const userOverlap = inMemoryBookings.find(
      (b) =>
        b.studentId === payload.studentId &&
        b.date === payload.date &&
        b.startTime === payload.startTime &&
        b.status === 'confirmed'
    );

    if (userOverlap) {
      throw new Error(
        `[DOUBLE BOOKING CONFLICT] You already have an active booking for "${userOverlap.roomName}" (${userOverlap.roomCode}) during this time slot (${payload.startTime} - ${payload.endTime}). You cannot book two rooms simultaneously.`
      );
    }

    // 3. Mark the slot as reserved
    slot.isBooked = true;
    slot.bookedByStudentId = payload.studentId;
    slot.bookedByName = payload.studentName;
    slot.purpose = payload.purpose;

    // 4. Generate confirmed booking record
    const uniqueNumber = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `CS-${new Date().getFullYear()}-${uniqueNumber}`;

    const newBooking: BookingRecord = {
      id: `booking-${Date.now()}`,
      bookingCode,
      roomId: room.id,
      roomName: room.name,
      roomCode: room.code,
      roomBuilding: room.building,
      roomImage: room.image,
      date: payload.date,
      startTime: payload.startTime,
      endTime: payload.endTime,
      slotLabel: `${payload.startTime} - ${payload.endTime}`,
      studentId: payload.studentId,
      studentName: payload.studentName,
      purpose: payload.purpose,
      attendeesCount: payload.attendeesCount,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    inMemoryBookings.unshift(newBooking);
    return newBooking;
  },

  // Cancel booking and immediately release the slot back to available pool
  async cancelBooking(bookingId: string): Promise<BookingRecord> {
    await delay(300);

    const bookingIndex = inMemoryBookings.findIndex((b) => b.id === bookingId);
    if (bookingIndex === -1) {
      throw new Error('Booking record not found.');
    }

    const booking = inMemoryBookings[bookingIndex];
    booking.status = 'cancelled';

    // Release the time slot immediately
    const slot = inMemorySlots.find(
      (s) => s.roomId === booking.roomId && s.date === booking.date && s.startTime === booking.startTime
    );

    if (slot) {
      slot.isBooked = false;
      slot.bookedByStudentId = undefined;
      slot.bookedByName = undefined;
      slot.purpose = undefined;
    }

    return booking;
  },

  // Get student's bookings
  async getUserBookings(studentId: string): Promise<BookingRecord[]> {
    await delay(250);
    return inMemoryBookings.filter((b) => b.studentId === studentId);
  },
};
