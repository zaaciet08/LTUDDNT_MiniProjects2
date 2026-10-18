import { NavigatorScreenParams } from '@react-navigation/native';
import { BookingRecord, RoomBuilding } from '../types';

export type TabParamList = {
  Explore: undefined;
  MyBookings: undefined;
  Favorites: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList> | undefined;
  RoomDetail: {
    roomId: string;
  };
  BookingConfirm: {
    roomId: string;
    roomName: string;
    roomCode: string;
    building: RoomBuilding;
    roomImage: string;
    slotId: string;
    date: string;
    startTime: string;
    endTime: string;
    slotLabel: string;
  };
  BookingPass: {
    booking: BookingRecord;
  };
};
