import { create } from 'zustand';
import { StudentProfile } from '../types';

interface UserState {
  profile: StudentProfile;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  updateProfile: (updates: Partial<StudentProfile>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: {
    studentId: 'SV2026-8899',
    fullName: 'Nguyen Van A',
    email: 'a.nguyen@campus.edu.vn',
    department: 'Software Engineering & AI',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bookedHoursThisSemester: 18.5,
  },
  notificationsEnabled: true,
  setNotificationsEnabled: (notificationsEnabled: boolean) => set({ notificationsEnabled }),
  updateProfile: (updates) =>
    set((state) => ({ profile: { ...state.profile, ...updates } })),
}));
