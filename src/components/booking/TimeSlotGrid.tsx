import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TimeSlot } from '../../types';
import { colors, borderRadius } from '../../theme/colors';

interface TimeSlotGridProps {
  slots: TimeSlot[];
  selectedSlotId: string | null;
  onSelectSlot: (slot: TimeSlot) => void;
  onAttemptBookedSlot: (slot: TimeSlot) => void;
  isLoading?: boolean;
}

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  slots,
  selectedSlotId,
  onSelectSlot,
  onAttemptBookedSlot,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.loadingText}>Checking real-time slot availability...</Text>
      </View>
    );
  }

  if (slots.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="calendar-clear-outline" size={32} color={colors.textMuted} />
        <Text style={styles.emptyText}>No available booking slots on this date.</Text>
      </View>
    );
  }

  const morningSlots = slots.filter((s) => s.period === 'morning');
  const afternoonSlots = slots.filter((s) => s.period === 'afternoon');
  const eveningSlots = slots.filter((s) => s.period === 'evening');

  const renderSlotItem = (slot: TimeSlot) => {
    const isSelected = slot.id === selectedSlotId;
    const isBooked = slot.isBooked;

    return (
      <TouchableOpacity
        key={slot.id}
        activeOpacity={isBooked ? 0.6 : 0.8}
        onPress={() => {
          if (isBooked) {
            onAttemptBookedSlot(slot);
          } else {
            onSelectSlot(slot);
          }
        }}
        style={[
          styles.slotButton,
          isBooked && styles.slotButtonBooked,
          isSelected && styles.slotButtonSelected,
        ]}
      >
        <View style={styles.slotHeader}>
          <Text
            style={[
              styles.slotTimeText,
              isBooked && styles.slotTimeTextBooked,
              isSelected && styles.slotTimeTextSelected,
            ]}
          >
            {slot.label}
          </Text>

          {isBooked ? (
            <Ionicons name="lock-closed" size={14} color={colors.textMuted} />
          ) : isSelected ? (
            <Ionicons name="checkmark-circle" size={16} color={colors.textWhite} />
          ) : (
            <View style={styles.availableDot} />
          )}
        </View>

        <Text
          style={[
            styles.slotStatusText,
            isBooked && styles.slotStatusTextBooked,
            isSelected && styles.slotStatusTextSelected,
          ]}
          numberOfLines={1}
        >
          {isBooked
            ? `Reserved (${slot.bookedByName ? slot.bookedByName.split(' ').pop() : 'Booked'})`
            : isSelected
            ? 'Selected'
            : 'Available'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Morning Section */}
      {morningSlots.length > 0 && (
        <View style={styles.periodGroup}>
          <View style={styles.periodHeader}>
            <Ionicons name="sunny-outline" size={16} color="#D97706" />
            <Text style={styles.periodTitle}>Morning Sessions (08:00 - 13:00)</Text>
          </View>
          <View style={styles.grid}>{morningSlots.map(renderSlotItem)}</View>
        </View>
      )}

      {/* Afternoon Section */}
      {afternoonSlots.length > 0 && (
        <View style={styles.periodGroup}>
          <View style={styles.periodHeader}>
            <Ionicons name="partly-sunny-outline" size={16} color="#0284C7" />
            <Text style={styles.periodTitle}>Afternoon Sessions (13:30 - 18:30)</Text>
          </View>
          <View style={styles.grid}>{afternoonSlots.map(renderSlotItem)}</View>
        </View>
      )}

      {/* Evening Section */}
      {eveningSlots.length > 0 && (
        <View style={styles.periodGroup}>
          <View style={styles.periodHeader}>
            <Ionicons name="moon-outline" size={16} color="#6366F1" />
            <Text style={styles.periodTitle}>Evening Sessions (18:45 - 22:00)</Text>
          </View>
          <View style={styles.grid}>{eveningSlots.map(renderSlotItem)}</View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  loadingContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 8,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 8,
  },
  periodGroup: {
    marginBottom: 16,
  },
  periodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  periodTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  slotButton: {
    width: '48.5%',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 10,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  slotButtonBooked: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    opacity: 0.65,
  },
  slotButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  slotTimeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  slotTimeTextBooked: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  slotTimeTextSelected: {
    color: colors.textWhite,
  },
  availableDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.available,
  },
  slotStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.available,
  },
  slotStatusTextBooked: {
    color: colors.booked,
  },
  slotStatusTextSelected: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
});
