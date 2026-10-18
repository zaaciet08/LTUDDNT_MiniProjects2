import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useRoomsQuery } from '../hooks/useRoomsQuery';
import { RoomCard } from '../components/room/RoomCard';
import { CampusRoom } from '../types';
import { colors, borderRadius } from '../theme/colors';
import { RootStackParamList } from '../navigation/types';

export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);

  const { data: allRooms = [] } = useRoomsQuery({
    search: '',
    roomType: 'all',
    building: 'all',
    capacityMin: 0,
    amenities: [],
    onlyAvailableNow: false,
  });

  const favoriteRooms = allRooms.filter((r) => favoriteIds.includes(r.id));

  const handleRoomPress = (room: CampusRoom) => {
    navigation.navigate('RoomDetail', { roomId: room.id });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Spaces</Text>
        <Text style={styles.subtitle}>
          Quick access to your preferred labs and study rooms
        </Text>
      </View>

      <FlatList
        data={favoriteRooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RoomCard
            room={item}
            onPress={handleRoomPress}
            onBookPress={handleRoomPress}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No saved spaces yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the heart icon on any room card to keep it handy for quick reservations.
            </Text>
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Explore' } as any)}
            >
              <Text style={styles.exploreBtnText}>Discover Campus Rooms</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 36,
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  exploreBtn: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: borderRadius.md,
  },
  exploreBtnText: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: '700',
  },
});
