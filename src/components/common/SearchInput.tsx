import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius } from '../../theme/colors';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Search rooms, labs, codes or equipment...',
  onClear,
}) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={colors.textMuted} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="never"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            onChangeText('');
            onClear?.();
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.clearBtn}
        >
          <Ionicons name="close-circle" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1.2,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
    paddingVertical: 0,
  },
  clearBtn: {
    marginLeft: 6,
  },
});
