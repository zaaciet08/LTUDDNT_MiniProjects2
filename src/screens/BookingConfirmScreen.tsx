import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../store/useUserStore';
import { useCreateBookingMutation } from '../hooks/useBookings';
import { colors, borderRadius } from '../theme/colors';
import { RootStackParamList } from '../navigation/types';

const PURPOSE_PRESETS = [
  'Group Study & Exam Prep',
  'Capstone Project Sprint',
  'AI / ML Workstation Training',
  'Academic Club Meeting',
  'Research Presentation Practice',
];

export const BookingConfirmScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'BookingConfirm'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useUserStore((state) => state.profile);

  const {
    roomId,
    roomName,
    roomCode,
    building,
    roomImage,
    date,
    startTime,
    endTime,
    slotLabel,
  } = route.params;

  const [purpose, setPurpose] = useState<string>(PURPOSE_PRESETS[0]);
  const [attendeesCount, setAttendeesCount] = useState<number>(3);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createBookingMutation = useCreateBookingMutation();

  const handleConfirm = () => {
    if (!purpose.trim()) {
      Alert.alert('Required Information', 'Please provide a purpose for your room booking.');
      return;
    }

    setErrorMessage(null);

    createBookingMutation.mutate(
      {
        roomId,
        date,
        startTime,
        endTime,
        studentId: user.studentId,
        studentName: user.fullName,
        purpose: purpose.trim(),
        attendeesCount,
      },
      {
        onSuccess: (booking) => {
          navigation.replace('BookingPass', { booking });
        },
        onError: (err: any) => {
          setErrorMessage(err.message || 'Booking conflict encountered. Please try another slot.');
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Booking</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Error / Conflict Alert Banner */}
        {errorMessage && (
          <View style={styles.conflictErrorBox}>
            <Ionicons name="alert-circle" size={20} color={colors.booked} style={{ marginRight: 8, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.conflictErrorTitle}>Booking Conflict Detected</Text>
              <Text style={styles.conflictErrorText}>{errorMessage}</Text>
            </View>
          </View>
        )}

        {/* Room & Slot Summary Card */}
        <View style={styles.summaryCard}>
          <Image source={{ uri: roomImage }} style={styles.summaryImage} resizeMode="cover" />
          <View style={styles.summaryInfo}>
            <View style={styles.codeTag}>
              <Text style={styles.codeTagText}>{roomCode}</Text>
            </View>
            <Text style={styles.summaryName} numberOfLines={1}>{roomName}</Text>
            <Text style={styles.summaryBuilding}>{building}</Text>
          </View>
        </View>

        {/* Selected Slot Time Strip */}
        <View style={styles.timeStripCard}>
          <View style={styles.timeCol}>
            <Text style={styles.timeLabel}>DATE</Text>
            <Text style={styles.timeVal}>{date}</Text>
          </View>
          <View style={styles.timeDivider} />
          <View style={styles.timeCol}>
            <Text style={styles.timeLabel}>SESSION WINDOW</Text>
            <Text style={styles.timeVal}>{slotLabel}</Text>
          </View>
        </View>

        {/* Student Verification */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Student Details</Text>
          <View style={styles.studentCard}>
            <View style={styles.studentAvatar}>
              <Ionicons name="person" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.studentName}>{user.fullName}</Text>
              <Text style={styles.studentMeta}>{user.studentId} • {user.department}</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={14} color={colors.available} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>
        </View>

        {/* Purpose Presets & Custom Input */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Purpose of Reservation</Text>
          <View style={styles.presetsWrap}>
            {PURPOSE_PRESETS.map((preset) => {
              const isSelected = purpose === preset;
              return (
                <TouchableOpacity
                  key={preset}
                  onPress={() => setPurpose(preset)}
                  style={[styles.presetChip, isSelected && styles.presetChipSelected]}
                >
                  <Text style={[styles.presetChipText, isSelected && styles.presetChipTextSelected]}>
                    {preset}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TextInput
            style={styles.customPurposeInput}
            value={purpose}
            onChangeText={setPurpose}
            placeholder="Or write custom purpose/project name..."
            placeholderTextColor={colors.textMuted}
            multiline
          />
        </View>

        {/* Attendees Count Stepper */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Estimated Attendees</Text>
          <View style={styles.stepperContainer}>
            <Text style={styles.stepperLabel}>Number of students:</Text>
            <View style={styles.stepperRow}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setAttendeesCount(Math.max(1, attendeesCount - 1))}
              >
                <Ionicons name="remove" size={18} color={colors.textPrimary} />
              </TouchableOpacity>

              <Text style={styles.stepValue}>{attendeesCount}</Text>

              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setAttendeesCount(attendeesCount + 1)}
              >
                <Ionicons name="add" size={18} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Terms notice */}
        <View style={styles.termsBox}>
          <Ionicons name="information-circle-outline" size={18} color={colors.textSecondary} style={{ marginRight: 6 }} />
          <Text style={styles.termsText}>
            By confirming, you agree to comply with all campus laboratory safety protocols and adhere to checkout procedures.
          </Text>
        </View>
      </ScrollView>

      {/* Footer Confirm Action */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmBtn, createBookingMutation.isPending && styles.confirmBtnDisabled]}
          disabled={createBookingMutation.isPending}
          onPress={handleConfirm}
          activeOpacity={0.8}
        >
          {createBookingMutation.isPending ? (
            <ActivityIndicator size="small" color={colors.textWhite} />
          ) : (
            <>
              <Text style={styles.confirmBtnText}>Confirm & Generate Pass</Text>
              <Ionicons name="qr-code-outline" size={18} color={colors.textWhite} style={{ marginLeft: 6 }} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 45,
    paddingBottom: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  conflictErrorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.bookedLight,
    padding: 12,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.bookedBorder,
    marginBottom: 16,
  },
  conflictErrorTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.booked,
  },
  conflictErrorText: {
    fontSize: 12,
    color: colors.booked,
    marginTop: 2,
    lineHeight: 17,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  summaryImage: {
    width: 68,
    height: 68,
    borderRadius: borderRadius.md,
  },
  summaryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  codeTag: {
    backgroundColor: colors.primaryLight,
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginBottom: 4,
  },
  codeTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  summaryName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  summaryBuilding: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  timeStripCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  timeCol: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  timeVal: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  timeDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
  sectionBox: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  studentMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.availableLight,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: borderRadius.full,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.available,
    marginLeft: 3,
  },
  presetsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  presetChip: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: borderRadius.full,
    marginRight: 6,
    marginBottom: 6,
  },
  presetChipSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  presetChipText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  presetChipTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  customPurposeInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: 10,
    fontSize: 13,
    color: colors.textPrimary,
    minHeight: 50,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginHorizontal: 16,
  },
  termsBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 4,
  },
  termsText: {
    flex: 1,
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  confirmBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: borderRadius.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  confirmBtnDisabled: {
    opacity: 0.7,
  },
  confirmBtnText: {
    color: colors.textWhite,
    fontSize: 15,
    fontWeight: '700',
  },
});
