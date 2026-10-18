import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Amenity } from '../../types';
import { colors, borderRadius } from '../../theme/colors';

interface AmenityTagProps {
  amenity: Amenity;
  compact?: boolean;
}

export const getAmenityMeta = (amenity: Amenity): { label: string; icon: keyof typeof Ionicons.glyphMap } => {
  switch (amenity) {
    case 'high_spec_pc':
      return { label: 'RTX GPUs / PC', icon: 'hardware-chip-outline' };
    case 'dual_monitors':
      return { label: 'Dual 4K Screens', icon: 'desktop-outline' };
    case 'projector':
      return { label: 'Laser Projector', icon: 'videocam-outline' };
    case 'soundproof':
      return { label: 'Soundproof', icon: 'volume-mute-outline' };
    case 'vr_kit':
      return { label: 'VR Headsets', icon: 'glasses-outline' };
    case 'tv_screen':
      return { label: '55" Presentation TV', icon: 'tv-outline' };
    case 'ac':
      return { label: 'Climate Control AC', icon: 'snow-outline' };
    case '3d_printer':
      return { label: '3D Printer', icon: 'cube-outline' };
    case 'whiteboard':
      return { label: 'Glass Whiteboard', icon: 'easel-outline' };
    default:
      return { label: amenity, icon: 'checkmark-circle-outline' };
  }
};

export const AmenityTag: React.FC<AmenityTagProps> = ({ amenity, compact = false }) => {
  const meta = getAmenityMeta(amenity);

  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      <Ionicons name={meta.icon} size={compact ? 12 : 15} color={colors.primary} style={styles.icon} />
      <Text style={[styles.text, compact && styles.compactText]}>{meta.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: borderRadius.md,
    marginRight: 6,
    marginBottom: 6,
  },
  compactContainer: {
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: borderRadius.sm,
    marginRight: 4,
    marginBottom: 4,
  },
  icon: {
    marginRight: 5,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  compactText: {
    fontSize: 11,
  },
});
