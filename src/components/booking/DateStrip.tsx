import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../../theme/colors';

interface DateStripProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  daysCount?: number;
}

interface DayItem {
  dateStr: string;
  dayName: string;
  dayNumber: number;
  monthName: string;
  isToday: boolean;
}

export const DateStrip: React.FC<DateStripProps> = ({
  selectedDate,
  onSelectDate,
  daysCount = 7,
}) => {
  const days: DayItem[] = [];
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  for (let i = 0; i < daysCount; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    days.push({
      dateStr,
      dayName: i === 0 ? 'TODAY' : dayNames[d.getDay()],
      dayNumber: d.getDate(),
      monthName: monthNames[d.getMonth()],
      isToday: i === 0,
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Booking Date</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {days.map((item) => {
          const isSelected = item.dateStr === selectedDate;

          return (
            <TouchableOpacity
              key={item.dateStr}
              activeOpacity={0.75}
              onPress={() => onSelectDate(item.dateStr)}
              style={[
                styles.dayCard,
                isSelected ? styles.dayCardSelected : styles.dayCardUnselected,
              ]}
            >
              <Text
                style={[
                  styles.dayName,
                  isSelected ? styles.dayNameSelected : styles.dayNameUnselected,
                  item.isToday && !isSelected ? styles.todayHighlight : null,
                ]}
              >
                {item.dayName}
              </Text>

              <Text
                style={[
                  styles.dayNumber,
                  isSelected ? styles.dayNumberSelected : styles.dayNumberUnselected,
                ]}
              >
                {item.dayNumber}
              </Text>

              <Text
                style={[
                  styles.monthName,
                  isSelected ? styles.monthNameSelected : styles.monthNameUnselected,
                ]}
              >
                {item.monthName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  dayCard: {
    width: 68,
    height: 80,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1.5,
  },
  dayCardUnselected: {
    backgroundColor: colors.card,
    borderColor: colors.border,
  },
  dayCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  dayName: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  dayNameUnselected: {
    color: colors.textMuted,
  },
  dayNameSelected: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  todayHighlight: {
    color: colors.primary,
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: '800',
  },
  dayNumberUnselected: {
    color: colors.textPrimary,
  },
  dayNumberSelected: {
    color: colors.textWhite,
  },
  monthName: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  monthNameUnselected: {
    color: colors.textSecondary,
  },
  monthNameSelected: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
});
