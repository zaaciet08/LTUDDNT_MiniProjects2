import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius } from '../theme/colors';
import { RootStackParamList } from '../navigation/types';

export const BookingPassScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'BookingPass'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { booking } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Success Icon */}
        <View style={styles.successCircle}>
          <Ionicons name="checkmark" size={36} color={colors.textWhite} />
        </View>

        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>
          Your digital access pass has been issued and synchronized with campus door scanners.
        </Text>

        {/* Boarding Pass / Ticket Card */}
        <View style={styles.ticketCard}>
          {/* Ticket Header */}
          <View style={styles.ticketHeader}>
            <View>
              <Text style={styles.headerCampus}>CAMPUS SMART BOOKING</Text>
              <Text style={styles.headerCode}>{booking.bookingCode}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>ACTIVE PASS</Text>
            </View>
          </View>

          {/* Ticket Body */}
          <View style={styles.ticketBody}>
            <Text style={styles.roomName}>{booking.roomName}</Text>
            <Text style={styles.roomMeta}>
              {booking.roomCode} • {booking.roomBuilding}
            </Text>

            <View style={styles.infoGrid}>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>DATE</Text>
                <Text style={styles.infoVal}>{booking.date}</Text>
              </View>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>TIME WINDOW</Text>
                <Text style={styles.infoVal}>{booking.slotLabel}</Text>
              </View>
            </View>

            <View style={styles.infoGrid}>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>STUDENT ID</Text>
                <Text style={styles.infoVal}>{booking.studentId}</Text>
              </View>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>STUDENT NAME</Text>
                <Text style={styles.infoVal}>{booking.studentName}</Text>
              </View>
            </View>

            <View style={styles.purposeBox}>
              <Text style={styles.infoLabel}>PURPOSE</Text>
              <Text style={styles.purposeVal}>{booking.purpose}</Text>
            </View>
          </View>

          {/* Perforated ticket tear line */}
          <View style={styles.tearLineContainer}>
            <View style={[styles.cutout, styles.cutoutLeft]} />
            <View style={styles.dashedLine} />
            <View style={[styles.cutout, styles.cutoutRight]} />
          </View>

          {/* QR Code Section */}
          <View style={styles.ticketFooter}>
            <View style={styles.qrContainer}>
              <Ionicons name="qr-code" size={110} color={colors.textPrimary} />
            </View>
            <Text style={styles.scanInstruction}>
              Scan this QR code at {booking.roomCode} smart door reader for entry
            </Text>
          </View>
        </View>

        {/* Navigation Action Buttons */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => {
            navigation.navigate('MainTabs', { screen: 'MyBookings' } as any);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryBtnText}>View in My Bookings</Text>
          <Ionicons name="list" size={18} color={colors.textWhite} style={{ marginLeft: 6 }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => {
            navigation.navigate('MainTabs', { screen: 'Explore' } as any);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryBtnText}>Back to Campus Explore</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  successCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.available,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 14,
    shadowColor: colors.available,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  ticketCard: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 20,
  },
  ticketHeader: {
    backgroundColor: colors.primary,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerCampus: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: 0.5,
  },
  headerCode: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textWhite,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: borderRadius.full,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textWhite,
  },
  ticketBody: {
    padding: 16,
  },
  roomName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  roomMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 14,
  },
  infoGrid: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.3,
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  purposeBox: {
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: borderRadius.md,
    marginTop: 4,
  },
  purposeVal: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  tearLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    position: 'relative',
  },
  cutout: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.background,
    position: 'absolute',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cutoutLeft: {
    left: -10,
  },
  cutoutRight: {
    right: -10,
  },
  dashedLine: {
    flex: 1,
    marginHorizontal: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  ticketFooter: {
    padding: 16,
    alignItems: 'center',
  },
  qrContainer: {
    padding: 10,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 8,
  },
  scanInstruction: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 20,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: borderRadius.md,
    marginBottom: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  primaryBtnText: {
    color: colors.textWhite,
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryBtn: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: borderRadius.md,
    backgroundColor: colors.cardAlt,
  },
  secondaryBtnText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
});
