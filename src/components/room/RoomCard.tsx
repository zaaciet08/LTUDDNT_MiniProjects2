import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CampusRoom } from '../../types';
import { colors, borderRadius } from '../../theme/colors';
import { Badge } from '../common/Badge';
import { AmenityTag } from './AmenityTag';
import { useFavoritesStore } from '../../store/useFavoritesStore';

interface RoomCardProps {
  room: CampusRoom;
  onPress: (room: CampusRoom) => void;
  onBookPress?: (room: CampusRoom) => void;
}

export const ROOM_CARD_HEIGHT = 385; // Fixed estimated height for FlatList getItemLayout

const RoomCardComponent: React.FC<RoomCardProps> = ({ room, onPress, onBookPress }) => {
  const isFavorite = useFavoritesStore((state) => state.favoriteIds.includes(room.id));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const handleCardPress = useCallback(() => {
    onPress(room);
  }, [onPress, room]);

  const handleBookPress = useCallback(() => {
    if (onBookPress) {
      onBookPress(room);
    } else {
      onPress(room);
    }
  }, [onBookPress, onPress, room]);

  const handleToggleFav = useCallback(() => {
    toggleFavorite(room.id);
  }, [toggleFavorite, room.id]);

  const displayedAmenities = room.amenities.slice(0, 3);
  const remainingCount = room.amenities.length - displayedAmenities.length;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handleCardPress}
      style={styles.card}
    >
      {/* Room Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: room.image }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Top Badges: Availability Status & Bookmark */}
        <View style={styles.imageHeader}>
          <Badge
            label={room.isAvailableNow ? 'Available Now' : 'Occupied'}
            variant={room.isAvailableNow ? 'success' : 'danger'}
            size="sm"
          />

          <TouchableOpacity
            style={styles.favBtn}
            onPress={handleToggleFav}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? colors.booked : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Bottom overlay: Location badge */}
        <View style={styles.imageFooter}>
          <View style={styles.locationTag}>
            <Ionicons name="business-outline" size={12} color={colors.textWhite} />
            <Text style={styles.locationText}>
              {room.building} • Floor {room.floor}
            </Text>
          </View>
          <View style={styles.codeTag}>
            <Text style={styles.codeText}>{room.code}</Text>
          </View>
        </View>
      </View>

      {/* Card Content Details */}
      <View style={styles.content}>
        {/* Title and Rating */}
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {room.name}
          </Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={13} color="#F59E0B" />
            <Text style={styles.ratingText}>{room.rating.toFixed(1)}</Text>
            <Text style={styles.reviewCount}>({room.reviewCount})</Text>
          </View>
        </View>

        {/* Department subtitle */}
        <Text style={styles.departmentText} numberOfLines={1}>
          {room.department}
        </Text>

        {/* Capacity spec info */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>Max {room.capacity} students</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Ionicons name="checkmark-circle-outline" size={14} color={colors.available} />
            <Text style={styles.metaText}>Free Student Access</Text>
          </View>
        </View>

        {/* Amenities Preview */}
        <View style={styles.amenitiesContainer}>
          {displayedAmenities.map((amenity) => (
            <AmenityTag key={amenity} amenity={amenity} compact />
          ))}
          {remainingCount > 0 && (
            <View style={styles.moreBadge}>
              <Text style={styles.moreText}>+{remainingCount} more</Text>
            </View>
          )}
        </View>

        {/* Footer: Action button */}
        <View style={styles.footerRow}>
          <View>
            <Text style={styles.priceLabel}>Reservation</Text>
            <Text style={styles.priceValue}>Instant Pass</Text>
          </View>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleBookPress}
            activeOpacity={0.8}
          >
            <Text style={styles.bookButtonText}>Select Slot</Text>
            <Ionicons name="calendar-outline" size={15} color={colors.textWhite} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const RoomCard = memo(RoomCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    height: 175,
    width: '100%',
    position: 'relative',
    backgroundColor: colors.cardAlt,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageHeader: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    padding: 7,
    borderRadius: borderRadius.full,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  imageFooter: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: borderRadius.sm,
  },
  locationText: {
    color: colors.textWhite,
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  codeTag: {
    backgroundColor: 'rgba(79, 70, 229, 0.9)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: borderRadius.sm,
  },
  codeText: {
    color: colors.textWhite,
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginLeft: 3,
  },
  reviewCount: {
    fontSize: 11,
    color: colors.textMuted,
    marginLeft: 2,
  },
  departmentText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginLeft: 4,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 12,
  },
  moreBadge: {
    backgroundColor: colors.cardAlt,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: borderRadius.sm,
    marginBottom: 4,
  },
  moreText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 10,
  },
  priceLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  bookButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: borderRadius.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  bookButtonText: {
    color: colors.textWhite,
    fontSize: 13,
    fontWeight: '700',
  },
});
