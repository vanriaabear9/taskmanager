/**
 * WeekDateSelector - Horizontal scrollable week date picker
 * Displays Mon 20, Tue 21, etc. for the current week
 */
import { ThemedText } from '@/components/themed-text';
import { GreenTheme, Spacing } from '@/constants/theme';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

interface WeekDateSelectorProps {
  onDateSelect?: (date: Date) => void;
}

export function WeekDateSelector({ onDateSelect }: WeekDateSelectorProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const weekDates = getCurrentWeekDates();

  const handleDatePress = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
      style={styles.container}
    >
      {weekDates.map((date, index) => {
        const selected = isSelected(date);
        return (
          <Pressable
            key={index}
            onPress={() => handleDatePress(date)}
            style={[styles.dateButton, selected && styles.dateButtonSelected]}
          >
            <ThemedText style={[styles.dayText, selected && styles.dayTextSelected]}>
              {getDayLabel(date)}
            </ThemedText>
            <ThemedText style={[styles.dateText, selected && styles.dateTextSelected]}>
              {date.getDate()}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

/**
 * Get array of dates for the current week (Sun-Sat)
 */
function getCurrentWeekDates(): Date[] {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday
  const dates: Date[] = [];

  // Get Sunday of current week
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - currentDay);

  // Generate all 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    dates.push(date);
  }

  return dates;
}

/**
 * Get short day label (Mon, Tue, etc.)
 */
function getDayLabel(date: Date): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.three,
  },
  scrollContainer: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
  dateButton: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: 60,
    alignItems: 'center',
  },
  dateButtonSelected: {
    backgroundColor: GreenTheme.white,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: GreenTheme.white,
    marginBottom: Spacing.half,
  },
  dayTextSelected: {
    color: GreenTheme.primary,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '700',
    color: GreenTheme.white,
  },
  dateTextSelected: {
    color: GreenTheme.primary,
  },
});
