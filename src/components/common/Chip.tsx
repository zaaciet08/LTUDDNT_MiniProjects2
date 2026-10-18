import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius } from '../../theme/colors';

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
  count?: number;
  style?: ViewStyle;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected,
  onPress,
  icon,
  count,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.chip,
        selected ? styles.chipSelected : styles.chipUnselected,
        style,
      ]}
    >
      {icon && <>{icon}</>}
      <Text
        style={[
          styles.label,
          selected ? styles.labelSelected : styles.labelUnselected,
          icon ? { marginLeft: 5 } : null,
        ]}
      >
        {label}
      </Text>
      {typeof count === 'number' && count > 0 && (
        <Text
          style={[
            styles.countBadge,
            selected ? styles.countBadgeSelected : styles.countBadgeUnselected,
          ]}
        >
          {count}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: borderRadius.full,
    borderWidth: 1.2,
    marginRight: 8,
  },
  chipUnselected: {
    backgroundColor: colors.card,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  labelUnselected: {
    color: colors.textSecondary,
  },
  labelSelected: {
    color: colors.primary,
  },
  countBadge: {
    marginLeft: 6,
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  countBadgeUnselected: {
    backgroundColor: colors.cardAlt,
    color: colors.textMuted,
  },
  countBadgeSelected: {
    backgroundColor: colors.primary,
    color: colors.textWhite,
  },
});
