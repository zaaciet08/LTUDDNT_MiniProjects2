import { CampusRoom, TimeSlot, BookingRecord } from '../types';

export const INITIAL_ROOMS: CampusRoom[] = [
  {
    id: 'room-1',
    name: 'AI & Data Science Lab',
    code: 'LAB-A301',
    building: 'Innovation Hub',
    floor: 3,
    type: 'computer_lab',
    capacity: 35,
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80',
    description: 'Equipped with RTX 4090 GPUs, dual 4K monitors, high-speed fiber network, and deep learning workstation clusters. Ideal for AI model training and data analysis workshops.',
    amenities: ['high_spec_pc', 'dual_monitors', 'projector', 'ac', 'whiteboard'],
    rating: 4.9,
    reviewCount: 42,
    isAvailableNow: true,
    department: 'Computer Science & Software Engineering',
    rules: [
      'No food or sweet beverages permitted',
      'Log off workstation before leaving',
      'Maximum 4 consecutive booking slots per student',
    ],
  },
  {
    id: 'room-2',
    name: 'Collaborative Pod Alpha',
    code: 'POD-L204',
    building: 'Library',
    floor: 2,
    type: 'study',
    capacity: 6,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
    description: 'Acoustic glass soundproof study booth equipped with 55" 4K TV presentation screen, write-on glass whiteboard, and ergonomic Herman Miller chairs.',
    amenities: ['soundproof', 'tv_screen', 'whiteboard', 'ac'],
    rating: 4.8,
    reviewCount: 78,
    isAvailableNow: false,
    department: 'Central University Library',
    rules: [
      'Keep voice within conversational volume',
      'Clean whiteboard after session',
      'Automatic slot release after 15 min no-show',
    ],
  },
  {
    id: 'room-3',
    name: 'XR & Metaverse Studio',
    code: 'VR-B105',
    building: 'Innovation Hub',
    floor: 1,
    type: 'media_lab',
    capacity: 12,
    image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1000&q=80',
    description: 'Dedicated Virtual Reality & Augmented Reality sandbox with Meta Quest 3 & HTC Vive Pro headsets, optical tracking grids, and green screen backdrop.',
    amenities: ['vr_kit', 'high_spec_pc', 'projector', 'soundproof', 'ac'],
    rating: 4.9,
    reviewCount: 31,
    isAvailableNow: true,
    department: 'Digital Media & Game Design',
    rules: [
      'Wear safety straps at all times',
      'Sanitize headsets with provided UV wipes',
      'Instructor endorsement required for freshman',
    ],
  },
  {
    id: 'room-4',
    name: 'Executive Seminar Hall',
    code: 'SEM-A101',
    building: 'Building A',
    floor: 1,
    type: 'seminar',
    capacity: 60,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
    description: 'Tiered auditorium seating with dual laser projectors, wireless mic audio system, and automated lecture recording cameras.',
    amenities: ['projector', 'soundproof', 'ac', 'whiteboard'],
    rating: 4.7,
    reviewCount: 19,
    isAvailableNow: true,
    department: 'Campus Administration & Events',
    rules: [
      'Return AV equipment to podium after event',
      'Minimum attendee count: 15 persons',
      'Booking requires 24h advance request',
    ],
  },
  {
    id: 'room-5',
    name: 'Rapid Prototyping & MakerLab',
    code: 'FAB-B202',
    building: 'Building B',
    floor: 2,
    type: 'media_lab',
    capacity: 16,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    description: 'Equipped with industrial FDM & Resin 3D printers, laser cutters, soldering benches, and CAD modeling terminals.',
    amenities: ['3d_printer', 'high_spec_pc', 'whiteboard', 'ac'],
    rating: 4.85,
    reviewCount: 54,
    isAvailableNow: false,
    department: 'Robotics & Mechanical Systems',
    rules: [
      'Safety goggles mandatory around machines',
      'Only approved filament and materials',
      'Supervised by lab assistant on duty',
    ],
  },
  {
    id: 'room-6',
    name: 'Quiet Focus Pod Beta',
    code: 'STU-L308',
    building: 'Library',
    floor: 3,
    type: 'study',
    capacity: 4,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
    description: 'Intimate group study lounge overlooking campus courtyard. Features dimmable lighting, ample power sockets, and whiteboard wall.',
    amenities: ['whiteboard', 'ac', 'soundproof'],
    rating: 4.6,
    reviewCount: 65,
    isAvailableNow: true,
    department: 'Central University Library',
    rules: [
      'Zero loud music policy',
      'Food not allowed, water bottles only',
    ],
  },
  {
    id: 'room-7',
    name: 'Cybersecurity & Networks Lab',
    code: 'NET-B304',
    building: 'Building B',
    floor: 3,
    type: 'computer_lab',
    capacity: 28,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
    description: 'Isolated testbed network racks, Cisco switches, Kali Linux and pfSense sandboxes for ethical hacking and network security labs.',
    amenities: ['high_spec_pc', 'dual_monitors', 'projector', 'ac'],
    rating: 4.75,
    reviewCount: 38,
    isAvailableNow: true,
    department: 'Cybersecurity Institute',
    rules: [
      'Do not bridge isolated lab LAN with campus Wi-Fi',
      'Follow campus ethical hacking code of conduct',
    ],
  },
  {
    id: 'room-8',
    name: 'Design Thinking & UX Studio',
    code: 'UX-A205',
    building: 'Building A',
    floor: 2,
    type: 'study',
    capacity: 14,
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1000&q=80',
    description: 'Modular mobile tables, full-wall writable whiteboard panels, sticky note walls, and 65" interactive touch display.',
    amenities: ['whiteboard', 'tv_screen', 'ac', 'projector'],
    rating: 4.88,
    reviewCount: 47,
    isAvailableNow: true,
    department: 'Faculty of Information Technology',
    rules: [
      'Rearrange mobile furniture to original layout',
      'Cap markers when done',
    ],
  },
];

// Helper to generate consistent date strings (today, +1, +2...)
export const getFormattedDate = (offsetDays: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const TIME_SLOT_TEMPLATES = [
  { startTime: '08:00', endTime: '09:30', period: 'morning' as const },
  { startTime: '09:45', endTime: '11:15', period: 'morning' as const },
  { startTime: '11:30', endTime: '13:00', period: 'morning' as const },
  { startTime: '13:30', endTime: '15:00', period: 'afternoon' as const },
  { startTime: '15:15', endTime: '16:45', period: 'afternoon' as const },
  { startTime: '17:00', endTime: '18:30', period: 'afternoon' as const },
  { startTime: '18:45', endTime: '20:15', period: 'evening' as const },
  { startTime: '20:30', endTime: '22:00', period: 'evening' as const },
];

// Initial mock store for slots across rooms for 7 days
export const generateInitialSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const dateStr = getFormattedDate(dayOffset);

    for (const room of INITIAL_ROOMS) {
      TIME_SLOT_TEMPLATES.forEach((tmpl, idx) => {
        // Pre-book some slots to test conflict prevention
        // E.g. room-1 at 09:45 today, room-2 at 13:30 today
        const isPreBooked = 
          (room.id === 'room-1' && tmpl.startTime === '09:45' && dayOffset === 0) ||
          (room.id === 'room-1' && tmpl.startTime === '15:15' && dayOffset === 1) ||
          (room.id === 'room-2' && tmpl.startTime === '13:30' && dayOffset === 0) ||
          (room.id === 'room-2' && tmpl.startTime === '08:00' && dayOffset === 0) ||
          (room.id === 'room-3' && tmpl.startTime === '11:30' && dayOffset === 0) ||
          (room.id === 'room-5' && tmpl.startTime === '13:30' && dayOffset === 0);

        slots.push({
          id: `slot-${room.id}-${dateStr}-${tmpl.startTime}`,
          roomId: room.id,
          date: dateStr,
          startTime: tmpl.startTime,
          endTime: tmpl.endTime,
          label: `${tmpl.startTime} - ${tmpl.endTime}`,
          period: tmpl.period,
          isBooked: isPreBooked,
          bookedByStudentId: isPreBooked ? 'SV2024-9912' : undefined,
          bookedByName: isPreBooked ? 'Tran Minh Quan' : undefined,
          purpose: isPreBooked ? 'Robotics Capstone Sprint' : undefined,
        });
      });
    }
  }

  return slots;
};

// Initial booked records for the logged-in student
export const INITIAL_USER_BOOKINGS: BookingRecord[] = [
  {
    id: 'book-101',
    bookingCode: 'CS-2026-X41',
    roomId: 'room-1',
    roomName: 'AI & Data Science Lab',
    roomCode: 'LAB-A301',
    roomBuilding: 'Innovation Hub',
    roomImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80',
    date: getFormattedDate(0),
    startTime: '17:00',
    endTime: '18:30',
    slotLabel: '17:00 - 18:30',
    studentId: 'SV2026-8899',
    studentName: 'Nguyen Van A',
    purpose: 'Deep Learning Model Evaluation for Thesis',
    attendeesCount: 4,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'book-102',
    bookingCode: 'CS-2026-X19',
    roomId: 'room-6',
    roomName: 'Quiet Focus Pod Beta',
    roomCode: 'STU-L308',
    roomBuilding: 'Library',
    roomImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
    date: getFormattedDate(1),
    startTime: '09:45',
    endTime: '11:15',
    slotLabel: '09:45 - 11:15',
    studentId: 'SV2026-8899',
    studentName: 'Nguyen Van A',
    purpose: 'Algorithms Group Study',
    attendeesCount: 3,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  },
];
