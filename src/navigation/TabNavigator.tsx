import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TabParamList } from './types';
import { ExploreScreen } from '../screens/ExploreScreen';
import { MyBookingsScreen } from '../screens/MyBookingsScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme/colors';
import { useUserStore } from '../store/useUserStore';
import { useUserBookingsQuery } from '../hooks/useBookings';

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator: React.FC = () => {
  const user = useUserStore((state) => state.profile);
  const { data: bookings = [] } = useUserBookingsQuery(user.studentId);
  const activeBookingsCount = bookings.filter((b) => b.status === 'confirmed').length;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarLabel: 'Rooms & Labs',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'grid' : 'grid-outline'}
              size={size - 1}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{
          tabBarLabel: 'My Passes',
          tabBarBadge: activeBookingsCount > 0 ? activeBookingsCount : undefined,
          tabBarBadgeStyle: styles.badge,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={size - 1}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Saved',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'heart' : 'heart-outline'}
              size={size - 1}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={size - 1}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.card,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 86 : 64,
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: colors.primary,
    fontSize: 10,
    fontWeight: '800',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
  },
});
