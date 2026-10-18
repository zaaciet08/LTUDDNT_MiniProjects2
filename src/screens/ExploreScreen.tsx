import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFilterStore } from '../store/useFilterStore';
import { useUserStore } from '../store/useUserStore';
import { useRoomsQuery } from '../hooks/useRoomsQuery';
import { SearchInput } from '../components/common/SearchInput';
import { FilterChipsBar } from '../components/room/FilterChipsBar';
import { RoomCard, ROOM_CARD_HEIGHT } from '../components/room/RoomCard';
import { CampusRoom } from '../types';
import { colors, borderRadius } from '../theme/colors';
import { RootStackParamList } from '../navigation/types';

export const ExploreScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useUserStore((state) => state.profile);

  const {
    search,
    setSearch,
    roomType,
    building,
    capacityMin,
    amenities,
    onlyAvailableNow,
    resetFilters,
  } = useFilterStore();

  const filterParams = useMemo(
    () => ({
      search,
      roomType,
      building,
      capacityMin,
      amenities,
      onlyAvailableNow,
    }),
    [search, roomType, building, capacityMin, amenities, onlyAvailableNow]
  );

  const { data: rooms, isLoading, isRefetching, refetch } = useRoomsQuery(filterParams);

  const handleRoomPress = useCallback(
    (room: CampusRoom) => {
      navigation.navigate('RoomDetail', { roomId: room.id });
    },
    [navigation]
  );

  const renderRoomItem = useCallback(
    ({ item }: { item: CampusRoom }) => {
      return (
        <RoomCard
          room={item}
          onPress={handleRoomPress}
          onBookPress={handleRoomPress}
        />
      );
    },
    [handleRoomPress]
  );

  const keyExtractor = useCallback((item: CampusRoom) => item.id, []);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ROOM_CARD_HEIGHT,
      offset: ROOM_CARD_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Campus Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user.fullName} 👋</Text>
        </View>

        <View style={styles.studentBadge}>
          <Text style={styles.studentIdText}>{user.studentId}</Text>
        </View>
      </View>

      {/* Instant Search Bar */}
      <View style={styles.searchWrapper}>
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search labs, study rooms, GPUs, VR..."
        />
      </View>

      {/* Multi-parameter Filter Chips */}
      <FilterChipsBar />

      {/* Results Header */}
      <View style={styles.resultsInfoRow}>
        <Text style={styles.resultsCount}>
          {rooms ? `${rooms.length} rooms & labs available` : 'Searching campus spaces...'}
        </Text>
      </View>

      {/* 60fps High-Performance FlatList */}
      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingFeedText}>Loading campus spaces...</Text>
        </View>
      ) : (
        <FlatList
          data={rooms || []}
          renderItem={renderRoomItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          initialNumToRender={5}
          maxToRenderPerBatch={6}
          windowSize={5}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => {
                refetch();
              }}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No matching rooms found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search keywords, capacity requirements, or selected equipment chips.
              </Text>
              <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                <Text style={styles.resetButtonText}>Reset All Filters</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  studentBadge: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  studentIdText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  resultsInfoRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  listContent: {
    paddingBottom: 24,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingFeedText: {
    marginTop: 10,
    fontSize: 13,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 36,
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  resetButton: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: borderRadius.md,
  },
  resetButtonText: {
    color: colors.textWhite,
    fontSize: 13,
    fontWeight: '700',
  },
});
