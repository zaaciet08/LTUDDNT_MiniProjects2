# CampusSpace - Campus Study Room & Lab Booking App
### Mini-Project 2: Requirements & Implementation

> **Interactive mobile booking application for campus study rooms and research laboratories.**  
> Built with **React Native**, **Expo (Managed)**, **TypeScript (Strict Mode)**, **React Navigation 7**, **Zustand**, and **TanStack Query**.

---

## 📌 1. Requirements Compliance Matrix

| Requirement | Implementation Details | Status |
| :--- | :--- | :---: |
| **Framework: React Native + Expo (Managed)** | Initialized with Expo SDK 58 managed workflow, Expo vector icons, Safe Area Context, and linear gradients. | ✅ Complete |
| **Language: TypeScript (strict mode)** | TypeScript `strict: true` with strict typing on all models (`CampusRoom`, `TimeSlot`, `BookingRecord`, `RoomFilters`), zero `any` shortcuts, verified with `npx tsc --noEmit`. | ✅ Complete |
| **Navigation: React Navigation 7 (Stack + Tabs)** | Bottom Tabs (`@react-navigation/bottom-tabs` v7) with active booking badges + Native Stack (`@react-navigation/native-stack` v7) for Detail, Confirmation, and Pass screens. | ✅ Complete |
| **State: Zustand (client) + TanStack Query (server)** | **Zustand**: User profile, multi-parameter filter state, favorites bookmarks.<br>**TanStack Query**: Room queries, slot queries, mutations with cache invalidation & optimistic updates. | ✅ Complete |
| **Key Feature 1: Room search & multi-parameter filter chips** | Instant search bar + interactive filter chips for Room Types, Campus Buildings, Capacity thresholds, Equipment (GPUs, Projectors, VR, 3D Printers), and Live Availability toggle. | ✅ Complete |
| **Key Feature 2: 60fps FlatList feed with room cards** | Fully memoized `RoomCard` with `React.memo`, fixed item height with `getItemLayout`, `initialNumToRender: 5`, `maxToRenderPerBatch: 6`, `windowSize: 5`, `removeClippedSubviews: true`. | ✅ Complete |
| **Key Feature 3: Time-slot selector with conflict prevention** | 7-day horizontal date strip, 3-session time-slot grid, disabled locked slots with reservation attribution, and multi-layer conflict prevention against concurrent double-bookings. | ✅ Complete |

---

## 🏗️ 2. Project Architecture

```
Mini-Projects2/
├── App.tsx                      # App root with QueryClientProvider & SafeAreaProvider
├── app.json                     # Expo configuration
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript strict config
└── src/
    ├── api/
    │   ├── mockData.ts          # Campus rooms, amenities & 7-day time slot generator
    │   └── roomApi.ts           # Async API with conflict detection & slot allocation
    ├── components/
    │   ├── common/              # Badge, Chip, SearchInput
    │   ├── room/                # RoomCard (60fps memoized), FilterChipsBar, AmenityTag
    │   └── booking/             # DateStrip, TimeSlotGrid
    ├── navigation/
    │   ├── types.ts             # Navigation type definitions
    │   ├── TabNavigator.tsx     # 4 Bottom tabs (Explore, Passes, Saved, Profile)
    │   └── RootNavigator.tsx    # Native Stack (MainTabs -> RoomDetail -> Confirm -> Pass)
    ├── screens/
    │   ├── ExploreScreen.tsx    # 60fps feed, search, filter chips, pull-to-refresh
    │   ├── RoomDetailScreen.tsx # High-res specs, amenities, live time-slot selector
    │   ├── BookingConfirmScreen.tsx # Purpose selector, attendees stepper, conflict guard
    │   ├── BookingPassScreen.tsx    # Digital pass with QR code and check-in info
    │   ├── MyBookingsScreen.tsx # Active & past reservations with slot release action
    │   ├── FavoritesScreen.tsx  # Quick access to bookmarked spaces
    │   └── ProfileScreen.tsx    # Student info, study stats & preferences
    ├── store/
    │   ├── useFilterStore.ts    # Zustand: active filters & search query
    │   ├── useFavoritesStore.ts # Zustand: saved favorite rooms
    │   └── useUserStore.ts      # Zustand: student profile & notifications
    ├── services/
    │   └── queryClient.ts       # TanStack QueryClient configuration
    ├── hooks/
    │   ├── useRoomsQuery.ts     # Room feed & detail query hooks
    │   ├── useSlotsQuery.ts     # Time slots query hook
    │   └── useBookings.ts       # Booking creation & slot cancellation mutations
    ├── theme/
    │   └── colors.ts            # Design tokens & color system
    └── types/
        └── index.ts             # Strict TypeScript domain interfaces
```

---

## 🔒 3. Conflict Prevention Engine

The application enforces a **two-tier conflict prevention strategy**:

1. **Pre-Selection UI Guard**:
   - Time slots already reserved by other students are visually marked with a lock icon (`🔒 Reserved by [Student]`), greyed out, and strikethrough.
   - Tapping an occupied slot triggers an informative modal stating who holds the slot and the academic purpose, preventing accidental submission.

2. **Server-Side Mutation Guard**:
   - When a booking is submitted, the API atomically validates:
     - **Slot availability**: Ensures no other process claimed the slot in the interim.
     - **Student overlap guard**: Validates that the student does not already hold an active booking in another room during the same time window.
   - Upon confirmation, TanStack Query invalidates cache keys `['room-slots']`, `['rooms']`, and `['user-bookings']`, instantly updating all screens.
   - When a booking is cancelled, the slot is immediately released back to the available pool.

---

## ⚡ 4. 60fps FlatList Performance Optimization

To achieve a silky smooth 60fps scrolling experience:
- **`React.memo` Component Isolation**: `RoomCard` only re-renders when its specific room data or bookmark state changes.
- **Fixed Layout Calculation (`getItemLayout`)**: Eliminates on-the-fly layout measurements.
- **Batched Rendering**: `initialNumToRender={5}`, `maxToRenderPerBatch={6}`, `windowSize={5}`.
- **Memory Optimization**: `removeClippedSubviews={true}` unmounts offscreen cards from native memory.

---

## 🚀 5. Getting Started

### Prerequisites
- Node.js (>= 20.x or 22.x)
- npm or bun

### Installation
```bash
# Clone or navigate to the project directory
cd Mini-Projects2

# Install dependencies
npm install
```

### Running the App
```bash
# Start the Expo interactive development server
npx expo start

# Run in Web browser directly
npm run web

# Run on Android emulator / device
npm run android

# Run on iOS simulator (macOS)
npm run ios
```

### Type Checking
```bash
# Run strict TypeScript verification
npx tsc --noEmit
```
