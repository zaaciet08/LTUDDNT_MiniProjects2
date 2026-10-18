import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useRoomDetailQuery } from '../hooks/useRoomsQuery';
import { useRoomSlotsQuery } from '../hooks/useSlotsQuery';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { DateStrip } from '../components/booking/DateStrip';
import { TimeSlotGrid } from '../components/booking/TimeSlotGrid';
import { AmenityTag } from '../components/room/AmenityTag';
import { Badge } from '../components/common/Badge';
import { getFormattedDate } from '../api/mockData';
import { TimeSlot } from '../types';
import { colors, borderRadius } from '../theme/colors';
import { RootStackParamList } from '../navigation/types';

export const RoomDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'RoomDetail'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { roomId } = route.params;

  const [selectedDate, setSelectedDate] = useState<string>(getFormattedDate(0));
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Conflict modal state for occupied slot attempt
  const [conflictModalVisible, setConflictModalVisible] = useState(false);
  const [conflictedSlot, setConflictedSlot] = useState<TimeSlot | null>(null);

  const { data: room, isLoading: isRoomLoading } = useRoomDetailQuery(roomId);
  const { data: slots = [], isLoading: isSlotsLoading } = useRoomSlotsQuery(roomId, selectedDate);

  const isFavorite = useFavoritesStore((state) => state.favoriteIds.includes(roomId));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const handleSelectSlot = (slot: TimeSlot) => {
    if (selectedSlot?.id === slot.id) {
      setSelectedSlot(null); // deselect
    } else {
      setSelectedSlot(slot);
    }
  };

  const handleAttemptBookedSlot = (slot: TimeSlot) => {
    setConflictedSlot(slot);
    setConflictModalVisible(true);
  };

  const handleProceedToBooking = () => {
    if (!selectedSlot || !room) {
      Alert.alert('Selection Required', 'Please choose an available time slot before continuing.');
      return;
    }

    navigation.navigate('BookingConfirm', {
      roomId: room.id,
      roomName: room.name,
      roomCode: room.code,
      building: room.building,
      roomImage: room.image,
      slotId: selectedSlot.id,
      date: selectedSlot.date,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      slotLabel: selectedSlot.label,
    });
  };

  if (isRoomLoading || !room) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading room details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Image Section */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: room.image }} style={styles.heroImage} resizeMode="cover" />

          {/* Top Floating Nav Bar */}
          <View style={styles.floatingHeader}>
            <TouchableOpacity
              style={styles.circleBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.circleBtn}
              onPress={() => toggleFavorite(room.id)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={22}
                color={isFavorite ? colors.booked : colors.textPrimary}
              />
            </TouchableOpacity>
          </View>

          {/* Bottom Floating Tag */}
          <View style={styles.heroFooter}>
            <Badge
              label={room.isAvailableNow ? 'Available Right Now' : 'Currently Occupied'}
              variant={room.isAvailableNow ? 'success' : 'danger'}
            />
            <View style={styles.codeBadge}>
              <Text style={styles.codeBadgeText}>{room.code}</Text>
            </View>
          </View>
        </View>

        {/* Room Header Info */}
        <View style={styles.bodySection}>
          <Text style={styles.roomTitle}>{room.name}</Text>
          <Text style={styles.departmentSubtitle}>{room.department}</Text>

          {/* Key Quick Badges */}
          <View style={styles.specsRow}>
            <View style={styles.specBox}>
              <Ionicons name="business-outline" size={18} color={colors.primary} />
              <Text style={styles.specVal}>{room.building}</Text>
              <Text style={styles.specSub}>Floor {room.floor}</Text>
            </View>

            <View style={styles.specBox}>
              <Ionicons name="people-outline" size={18} color={colors.primary} />
              <Text style={styles.specVal}>{room.capacity} Pax</Text>
              <Text style={styles.specSub}>Max Capacity</Text>
            </View>

            <View style={styles.specBox}>
              <Ionicons name="star" size={18} color="#F59E0B" />
              <Text style={styles.specVal}>{room.rating.toFixed(1)}</Text>
              <Text style={styles.specSub}>{room.reviewCount} Reviews</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.sectionHeading}>About this Space</Text>
          <Text style={styles.descriptionText}>{room.description}</Text>

          {/* Amenities & Equipment */}
          <Text style={styles.sectionHeading}>Included Equipment & Amenities</Text>
          <View style={styles.amenitiesWrap}>
            {room.amenities.map((amenity) => (
              <AmenityTag key={amenity} amenity={amenity} />
            ))}
          </View>

          {/* Usage Policies & Rules */}
          <Text style={styles.sectionHeading}>Room Guidelines & Safety Rules</Text>
          <View style={styles.rulesCard}>
            {room.rules.map((rule, idx) => (
              <View key={idx} style={styles.ruleItem}>
                <Ionicons name="shield-checkmark-outline" size={16} color={colors.primary} style={{ marginRight: 8, marginTop: 1 }} />
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Time-Slot Selector Section with Conflict Prevention */}
        <View style={styles.bookingSection}>
          <View style={styles.bookingHeaderRow}>
            <Text style={styles.sectionHeading}>Select Date & Time Slot</Text>
            <View style={styles.conflictGuaranteedBadge}>
              <Ionicons name="shield-outline" size={12} color={colors.available} />
              <Text style={styles.conflictGuaranteedText}>Live Conflict Guard</Text>
            </View>
          </View>

          {/* Date Picker Strip */}
          <DateStrip selectedDate={selectedDate} onSelectDate={(date) => {
            setSelectedDate(date);
            setSelectedSlot(null); // reset slot on date change
          }} />

          {/* Slot Grid with Real-time Status */}
          <TimeSlotGrid
            slots={slots}
            selectedSlotId={selectedSlot?.id || null}
            onSelectSlot={handleSelectSlot}
            onAttemptBookedSlot={handleAttemptBookedSlot}
            isLoading={isSlotsLoading}
          />
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomSlotInfo}>
          <Text style={styles.bottomSlotLabel}>
            {selectedSlot ? `Selected: ${selectedSlot.label}` : 'No slot chosen'}
          </Text>
          <Text style={styles.bottomDateLabel}>
            {selectedSlot ? `Date: ${selectedSlot.date}` : 'Tap an available green slot above'}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.proceedBtn,
            !selectedSlot && styles.proceedBtnDisabled,
          ]}
          disabled={!selectedSlot}
          onPress={handleProceedToBooking}
          activeOpacity={0.8}
        >
          <Text style={styles.proceedBtnText}>Continue</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textWhite} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>

      {/* Conflict Prevention Modal Alert */}
      <Modal
        visible={conflictModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConflictModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.conflictModalBox}>
            <View style={styles.conflictIconCircle}>
              <Ionicons name="alert-circle" size={32} color={colors.booked} />
            </View>

            <Text style={styles.conflictModalTitle}>Time Slot Unavailable</Text>
            
            <Text style={styles.conflictModalDescription}>
              The session <Text style={{ fontWeight: '700' }}>{conflictedSlot?.label}</Text> on {conflictedSlot?.date} is already reserved by another student
              {conflictedSlot?.bookedByName ? ` (${conflictedSlot.bookedByName})` : ''} for "{conflictedSlot?.purpose || 'Campus Academic Use'}".
            </Text>

            <View style={styles.conflictNoticeBox}>
              <Ionicons name="lock-closed-outline" size={16} color={colors.booked} style={{ marginRight: 6 }} />
              <Text style={styles.conflictNoticeText}>
                Double-booking is prevented by the campus booking engine. Please select an available green slot.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.conflictDismissBtn}
              onPress={() => setConflictModalVisible(false)}
            >
              <Text style={styles.conflictDismissBtnText}>Understood</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroContainer: {
    height: 250,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  floatingHeader: {
    position: 'absolute',
    top: 45,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  heroFooter: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: borderRadius.md,
  },
  codeBadgeText: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: '700',
  },
  bodySection: {
    padding: 16,
    backgroundColor: colors.card,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    marginTop: -16,
  },
  roomTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  departmentSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 16,
  },
  specsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  specBox: {
    flex: 1,
    backgroundColor: colors.cardAlt,
    borderRadius: borderRadius.md,
    padding: 10,
    marginHorizontal: 3,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  specVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 4,
  },
  specSub: {
    fontSize: 11,
    color: colors.textMuted,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 14,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  amenitiesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  rulesCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 4,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  ruleText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  divider: {
    height: 8,
    backgroundColor: colors.background,
  },
  bookingSection: {
    backgroundColor: colors.card,
    paddingTop: 16,
  },
  bookingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  conflictGuaranteedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.availableLight,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.availableBorder,
  },
  conflictGuaranteedText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.available,
    marginLeft: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  bottomSlotInfo: {
    flex: 1,
    marginRight: 12,
  },
  bottomSlotLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  bottomDateLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  proceedBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: borderRadius.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  proceedBtnDisabled: {
    backgroundColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  proceedBtnText: {
    color: colors.textWhite,
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  conflictModalBox: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: 20,
    alignItems: 'center',
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  conflictIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.bookedLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  conflictModalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  conflictModalDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 14,
  },
  conflictNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bookedLight,
    padding: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.bookedBorder,
    marginBottom: 16,
  },
  conflictNoticeText: {
    flex: 1,
    fontSize: 11,
    color: colors.booked,
    fontWeight: '600',
    lineHeight: 16,
  },
  conflictDismissBtn: {
    backgroundColor: colors.primary,
    width: '100%',
    paddingVertical: 11,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  conflictDismissBtnText: {
    color: colors.textWhite,
    fontSize: 14,
    fontWeight: '700',
  },
});
