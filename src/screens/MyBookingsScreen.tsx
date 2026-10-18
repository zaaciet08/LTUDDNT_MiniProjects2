import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUserStore } from '../store/useUserStore';
import { useUserBookingsQuery, useCancelBookingMutation } from '../hooks/useBookings';
import { BookingRecord } from '../types';
import { colors, borderRadius } from '../theme/colors';
import { RootStackParamList } from '../navigation/types';

export const MyBookingsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useUserStore((state) => state.profile);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');

  const { data: bookings = [], isLoading, refetch, isRefetching } = useUserBookingsQuery(user.studentId);
  const cancelMutation = useCancelBookingMutation();

  const upcomingBookings = bookings.filter((b) => b.status === 'confirmed');
  const pastBookings = bookings.filter((b) => b.status !== 'confirmed');

  const displayedList = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  const handleCancelBooking = (booking: BookingRecord) => {
    Alert.alert(
      'Cancel Room Booking?',
      `Are you sure you want to cancel your reservation for ${booking.roomName} on ${booking.date} (${booking.slotLabel})? The slot will immediately become available to other students.`,
      [
        { text: 'Keep Booking', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            cancelMutation.mutate(booking.id, {
              onSuccess: () => {
                Alert.alert('Booking Cancelled', 'The slot has been released back to campus availability.');
              },
            });
          },
        },
      ]
    );
  };

  const handleViewPass = (booking: BookingRecord) => {
    navigation.navigate('BookingPass', { booking });
  };

  const renderBookingCard = ({ item }: { item: BookingRecord }) => {
    const isConfirmed = item.status === 'confirmed';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Image source={{ uri: item.roomImage }} style={styles.roomImage} resizeMode="cover" />
          <View style={styles.roomInfo}>
            <View style={styles.topMetaRow}>
              <View style={styles.codeTag}>
                <Text style={styles.codeText}>{item.roomCode}</Text>
              </View>
              <View
                style={[
                  styles.statusTag,
                  isConfirmed ? styles.statusConfirmed : styles.statusCancelled,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    isConfirmed ? styles.statusTextConfirmed : styles.statusTextCancelled,
                  ]}
                >
                  {isConfirmed ? 'Confirmed' : 'Cancelled'}
                </Text>
              </View>
            </View>

            <Text style={styles.roomName} numberOfLines={1}>{item.roomName}</Text>
            <Text style={styles.roomBuilding}>{item.roomBuilding}</Text>
          </View>
        </View>

        {/* Schedule & Pass Info */}
        <View style={styles.scheduleRow}>
          <View style={styles.scheduleItem}>
            <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.scheduleText}>{item.date}</Text>
          </View>
          <View style={styles.scheduleItem}>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.scheduleText}>{item.slotLabel}</Text>
          </View>
          <View style={styles.scheduleItem}>
            <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.scheduleText}>{item.attendeesCount} pax</Text>
          </View>
        </View>

        {/* Purpose */}
        <View style={styles.purposeBox}>
          <Text style={styles.purposeLabel}>Purpose: </Text>
          <Text style={styles.purposeText} numberOfLines={1}>{item.purpose}</Text>
        </View>

        {/* Card Actions */}
        <View style={styles.cardFooter}>
          <Text style={styles.bookingCodeText}>Pass ID: {item.bookingCode}</Text>

          <View style={styles.actionsGroup}>
            {isConfirmed && (
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => handleCancelBooking(item)}
                disabled={cancelMutation.isPending}
              >
                <Text style={styles.cancelBtnText}>Release Slot</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.passBtn}
              onPress={() => handleViewPass(item)}
            >
              <Ionicons name="qr-code-outline" size={14} color={colors.textWhite} style={{ marginRight: 4 }} />
              <Text style={styles.passBtnText}>QR Pass</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Screen Title */}
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>My Reservations</Text>
        <Text style={styles.screenSubtitle}>Manage your campus lab and study room passes</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'upcoming' && styles.tabBtnActive]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'upcoming' && styles.tabBtnTextActive]}>
            Active / Upcoming ({upcomingBookings.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'history' && styles.tabBtnActive]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'history' && styles.tabBtnTextActive]}>
            History ({pastBookings.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={displayedList}
          keyExtractor={(item) => item.id}
          renderItem={renderBookingCard}
          refreshing={isRefetching}
          onRefresh={() => {
            refetch();
          }}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="calendar-clear-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>
                {activeTab === 'upcoming' ? 'No active reservations' : 'No past history'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {activeTab === 'upcoming'
                  ? 'Reserve a study room or lab to receive a digital QR pass.'
                  : 'Your completed or cancelled bookings will appear here.'}
              </Text>
              {activeTab === 'upcoming' && (
                <TouchableOpacity
                  style={styles.exploreBtn}
                  onPress={() => navigation.navigate('MainTabs', { screen: 'Explore' } as any)}
                >
                  <Text style={styles.exploreBtnText}>Browse Rooms & Labs</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  screenSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: colors.cardAlt,
    borderRadius: borderRadius.md,
    padding: 3,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  tabBtnActive: {
    backgroundColor: colors.card,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabBtnTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  roomImage: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
  },
  roomInfo: {
    flex: 1,
    marginLeft: 10,
  },
  topMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  codeTag: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  codeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
  statusTag: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: borderRadius.full,
  },
  statusConfirmed: {
    backgroundColor: colors.availableLight,
  },
  statusCancelled: {
    backgroundColor: colors.cardAlt,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusTextConfirmed: {
    color: colors.available,
  },
  statusTextCancelled: {
    color: colors.textMuted,
  },
  roomName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  roomBuilding: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  scheduleRow: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    padding: 8,
    borderRadius: borderRadius.md,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    marginLeft: 4,
  },
  purposeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  purposeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  purposeText: {
    fontSize: 11,
    color: colors.textSecondary,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 8,
  },
  bookingCodeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 6,
  },
  cancelBtnText: {
    fontSize: 12,
    color: colors.booked,
    fontWeight: '600',
  },
  passBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
  },
  passBtnText: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: '700',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 20,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 17,
  },
  exploreBtn: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: borderRadius.md,
  },
  exploreBtnText: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: '700',
  },
});
