export type RoomType = 'study' | 'computer_lab' | 'seminar' | 'media_lab';

export type RoomBuilding = 'Building A' | 'Building B' | 'Library' | 'Innovation Hub';

export type Amenity = 
  | 'projector' 
  | 'whiteboard' 
  | 'high_spec_pc' 
  | 'soundproof' 
  | 'vr_kit' 
  | 'tv_screen' 
  | 'ac' 
  | '3d_printer'
  | 'dual_monitors';

export interface CampusRoom {
  id: string;
  name: string;
  code: string; // e.g. "LAB-A302"
  building: RoomBuilding;
  floor: number;
  type: RoomType;
  capacity: number;
  image: string;
  description: string;
  amenities: Amenity[];
  rating: number;
  reviewCount: number;
  isAvailableNow: boolean;
  rules: string[];
  department: string;
}

export interface TimeSlot {
  id: string;
  roomId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // "08:00"
  endTime: string; // "09:30"
  label: string; // "08:00 - 09:30"
  period: 'morning' | 'afternoon' | 'evening';
  isBooked: boolean;
  bookedByStudentId?: string;
  bookedByName?: string;
  purpose?: string;
}

export interface BookingRecord {
  id: string;
  bookingCode: string; // "CS-2026-X89"
  roomId: string;
  roomName: string;
  roomCode: string;
  roomBuilding: RoomBuilding;
  roomImage: string;
  date: string;
  startTime: string;
  endTime: string;
  slotLabel: string;
  studentId: string;
  studentName: string;
  purpose: string;
  attendeesCount: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface RoomFilters {
  search: string;
  roomType: RoomType | 'all';
  building: RoomBuilding | 'all';
  capacityMin: number;
  amenities: Amenity[];
  onlyAvailableNow: boolean;
}

export interface StudentProfile {
  studentId: string;
  fullName: string;
  email: string;
  department: string;
  avatarUrl: string;
  bookedHoursThisSemester: number;
}
