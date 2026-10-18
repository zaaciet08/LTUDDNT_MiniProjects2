import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../store/useUserStore';
import { useUserBookingsQuery } from '../hooks/useBookings';
import { colors, borderRadius } from '../theme/colors';

export const ProfileScreen: React.FC = () => {
  const { profile, notificationsEnabled, setNotificationsEnabled } = useUserStore();
  const { data: bookings = [] } = useUserBookingsQuery(profile.studentId);

  const activeCount = bookings.filter((b) => b.status === 'confirmed').length;

  const showGuidelines = () => {
    Alert.alert(
      'Campus Lab Guidelines',
      '1. Arrive within 15 minutes of your booked slot.\n2. Keep your digital QR pass ready at the door scanner.\n3. Return all cables, VR gear, and peripherals to their docks.\n4. Clean the whiteboard and log out of workstations.'
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
          <Text style={styles.name}>{profile.fullName}</Text>
          <Text style={styles.department}>{profile.department}</Text>
          
          <View style={styles.idBadge}>
            <Ionicons name="card-outline" size={14} color={colors.primary} style={{ marginRight: 4 }} />
            <Text style={styles.idBadgeText}>Student ID: {profile.studentId}</Text>
          </View>
        </View>

        {/* Academic Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{activeCount}</Text>
            <Text style={styles.statLabel}>Active Passes</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statVal}>{profile.bookedHoursThisSemester}h</Text>
            <Text style={styles.statLabel}>Study Hours</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statVal}>100%</Text>
            <Text style={styles.statLabel}>Check-in Rate</Text>
          </View>
        </View>

        {/* Settings & Info Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Campus Preferences</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={20} color={colors.primary} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.settingTitle}>Slot Reminders</Text>
                <Text style={styles.settingSubtitle}>15 minutes before session begins</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.textWhite}
            />
          </View>

          <TouchableOpacity style={styles.menuItem} onPress={showGuidelines}>
            <View style={styles.menuLeft}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
              <Text style={styles.menuTitle}>Lab Safety & Policies</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Support Desk', 'Contact Campus IT Helpdesk:\nsupport@campus.edu.vn | Hotline: ext 108')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="help-buoy-outline" size={20} color={colors.primary} />
              <Text style={styles.menuTitle}>Help & Lab Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Tech Stack Info */}
        <View style={styles.techStackCard}>
          <Text style={styles.techHeader}>System & Architecture</Text>
          <Text style={styles.techItem}>• Mini-Project 2: Campus Booking App</Text>
          <Text style={styles.techItem}>• Framework: React Native + Expo Managed</Text>
          <Text style={styles.techItem}>• Navigation: React Navigation 7 (Stack + Tabs)</Text>
          <Text style={styles.techItem}>• State: Zustand (Client) + TanStack Query (Server)</Text>
          <Text style={styles.techItem}>• Language: TypeScript (Strict Mode)</Text>
        </View>
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
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  department: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 10,
  },
  idBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: borderRadius.full,
  },
  idBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: 14,
    alignItems: 'center',
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  settingSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 12,
  },
  techStackCard: {
    backgroundColor: colors.cardAlt,
    borderRadius: borderRadius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  techHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  techItem: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
