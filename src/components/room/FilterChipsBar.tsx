import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFilterStore } from '../../store/useFilterStore';
import { Chip } from '../common/Chip';
import { RoomType, RoomBuilding, Amenity } from '../../types';
import { colors, borderRadius } from '../../theme/colors';

const ROOM_TYPES: { label: string; value: RoomType | 'all' }[] = [
  { label: 'All Types', value: 'all' },
  { label: '💻 Computer Labs', value: 'computer_lab' },
  { label: '📚 Study Rooms', value: 'study' },
  { label: '🎙️ Seminar Halls', value: 'seminar' },
  { label: '🔬 Media & VR Labs', value: 'media_lab' },
];

const BUILDINGS: { label: string; value: RoomBuilding | 'all' }[] = [
  { label: 'All Campus', value: 'all' },
  { label: 'Innovation Hub', value: 'Innovation Hub' },
  { label: 'Library', value: 'Library' },
  { label: 'Building A', value: 'Building A' },
  { label: 'Building B', value: 'Building B' },
];

const CAPACITIES: { label: string; value: number }[] = [
  { label: 'Any Capacity', value: 0 },
  { label: '4+ People', value: 4 },
  { label: '10+ People', value: 10 },
  { label: '25+ People', value: 25 },
];

const AMENITIES: { label: string; value: Amenity }[] = [
  { label: '⚡ RTX GPUs / PC', value: 'high_spec_pc' },
  { label: '📽️ Projector', value: 'projector' },
  { label: '🥽 VR Headsets', value: 'vr_kit' },
  { label: '🔇 Soundproof', value: 'soundproof' },
  { label: '🧊 3D Printer', value: '3d_printer' },
  { label: '📋 Whiteboard', value: 'whiteboard' },
];

export const FilterChipsBar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    roomType,
    setRoomType,
    building,
    setBuilding,
    capacityMin,
    setCapacityMin,
    amenities,
    toggleAmenity,
    onlyAvailableNow,
    setOnlyAvailableNow,
    resetFilters,
    activeFilterCount,
  } = useFilterStore();

  const count = activeFilterCount();

  return (
    <View style={styles.container}>
      {/* Primary Row: Type chips + Quick Toggle + Filter Expander */}
      <View style={styles.topRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Availability Quick Chip */}
          <Chip
            label="🟢 Available Now"
            selected={onlyAvailableNow}
            onPress={() => setOnlyAvailableNow(!onlyAvailableNow)}
          />

          {/* Room Type Chips */}
          {ROOM_TYPES.map((t) => (
            <Chip
              key={t.value}
              label={t.label}
              selected={roomType === t.value}
              onPress={() => setRoomType(t.value)}
            />
          ))}
        </ScrollView>

        {/* Filter Drawer Toggle & Reset Button */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.filterToggleBtn, isExpanded && styles.filterToggleBtnActive]}
            onPress={() => setIsExpanded(!isExpanded)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'options-outline'}
              size={16}
              color={isExpanded ? colors.primary : colors.textSecondary}
            />
            <Text
              style={[
                styles.filterToggleText,
                isExpanded && styles.filterToggleTextActive,
              ]}
            >
              Filters
            </Text>
            {count > 0 && (
              <View style={styles.badgeCount}>
                <Text style={styles.badgeCountText}>{count}</Text>
              </View>
            )}
          </TouchableOpacity>

          {count > 0 && (
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={resetFilters}
              activeOpacity={0.7}
            >
              <Text style={styles.resetBtnText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Expanded Multi-Parameter Filter Panel */}
      {isExpanded && (
        <View style={styles.expandedPanel}>
          {/* Section: Building */}
          <Text style={styles.sectionHeader}>Campus Building</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subScrollContent}
          >
            {BUILDINGS.map((b) => (
              <Chip
                key={b.value}
                label={b.label}
                selected={building === b.value}
                onPress={() => setBuilding(b.value)}
              />
            ))}
          </ScrollView>

          {/* Section: Capacity */}
          <Text style={styles.sectionHeader}>Group Size / Capacity</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subScrollContent}
          >
            {CAPACITIES.map((c) => (
              <Chip
                key={c.value}
                label={c.label}
                selected={capacityMin === c.value}
                onPress={() => setCapacityMin(c.value)}
              />
            ))}
          </ScrollView>

          {/* Section: Equipment & Amenities */}
          <Text style={styles.sectionHeader}>Equipment & Facilities</Text>
          <View style={styles.amenitiesWrap}>
            {AMENITIES.map((a) => {
              const selected = amenities.includes(a.value);
              return (
                <Chip
                  key={a.value}
                  label={a.label}
                  selected={selected}
                  onPress={() => toggleAmenity(a.value)}
                  style={{ marginBottom: 8 }}
                />
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingTop: 8,
    paddingBottom: 4,
  },
  topRow: {
    marginBottom: 6,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  subScrollContent: {
    paddingVertical: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 6,
  },
  filterToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterToggleBtnActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  filterToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 5,
  },
  filterToggleTextActive: {
    color: colors.primary,
  },
  badgeCount: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  badgeCountText: {
    color: colors.textWhite,
    fontSize: 10,
    fontWeight: '800',
  },
  resetBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.booked,
  },
  expandedPanel: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginTop: 8,
    padding: 14,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: colors.textMuted,
    marginTop: 8,
    marginBottom: 6,
  },
  amenitiesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 2,
  },
});
