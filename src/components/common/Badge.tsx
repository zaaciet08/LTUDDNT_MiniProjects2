import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, borderRadius } from '../../theme/colors';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'danger' | 'warning' | 'primary' | 'neutral';
  size?: 'sm' | 'md';
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'md',
  style,
  textStyle,
  icon,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          bg: colors.availableLight,
          border: colors.availableBorder,
          text: colors.available,
        };
      case 'danger':
        return {
          bg: colors.bookedLight,
          border: colors.bookedBorder,
          text: colors.booked,
        };
      case 'warning':
        return {
          bg: colors.warningLight,
          border: '#FDE68A',
          text: '#D97706',
        };
      case 'primary':
        return {
          bg: colors.primaryLight,
          border: '#C7D2FE',
          text: colors.primary,
        };
      case 'neutral':
      default:
        return {
          bg: colors.cardAlt,
          border: colors.border,
          text: colors.textSecondary,
        };
    }
  };

  const v = getVariantStyles();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          paddingVertical: size === 'sm' ? 2 : 4,
          paddingHorizontal: size === 'sm' ? 8 : 10,
        },
        style,
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text
        style={[
          styles.text,
          {
            color: v.text,
            fontSize: size === 'sm' ? 11 : 12,
            fontWeight: size === 'sm' ? '600' : '700',
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  iconContainer: {
    marginRight: 4,
  },
  text: {
    letterSpacing: 0.2,
  },
});
