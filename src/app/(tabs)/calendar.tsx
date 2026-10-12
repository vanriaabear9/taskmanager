import { AddTaskModal } from '@/components/add-task-modal';
import { TaskItem } from '@/components/task-item';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, GreenTheme, Spacing } from '@/constants/theme';
import { useTasks } from '@/hooks/use-tasks';
import type { Task } from '@/types/task';
import { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDateKey(value: Date | string): string {
  if (typeof value === 'string') {
    const dateOnly = value.match(/^\d{4}-\d{2}-\d{2}$/);
    if (dateOnly) {
      return dateOnly[0];
    }
  }

  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export default function CalendarScreen() {
  const { tasks, addTask, updateTask, deleteTask, toggleComplete, isLoading, loadError } = useTasks();
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()));
  const [displayedMonth, setDisplayedMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const taskDates = useMemo(() => new Set(tasks.map((task) => getDateKey(task.deadline))), [tasks]);
  const selectedDateKey = getDateKey(selectedDate);
  const selectedTasks = tasks.filter((task) => getDateKey(task.deadline) === selectedDateKey);
  const calendarDays = useMemo(() => {
    const firstWeekday = new Date(
      displayedMonth.getFullYear(),
      displayedMonth.getMonth(),
      1
    ).getDay();
    const daysInMonth = new Date(
      displayedMonth.getFullYear(),
      displayedMonth.getMonth() + 1,
      0
    ).getDate();
    const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

    return Array.from({ length: cellCount }, (_, index) => {
      const day = index - firstWeekday + 1;
      return day > 0 && day <= daysInMonth
        ? new Date(displayedMonth.getFullYear(), displayedMonth.getMonth(), day)
        : null;
    });
  }, [displayedMonth]);

  const openAddTask = () => {
    setEditingTask(null);
    setModalVisible(true);
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const submitTask = (taskData: {
    title: string;
    category: 'personal' | 'school';
    deadline: string;
    isPriority: boolean;
  }) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setModalVisible(false);
    setEditingTask(null);
  };

  const changeMonth = (offset: number) => {
    const nextMonth = new Date(
      displayedMonth.getFullYear(),
      displayedMonth.getMonth() + offset,
      1
    );
    setDisplayedMonth(nextMonth);
    setSelectedDate(nextMonth);
  };

  const todayKey = getDateKey(new Date());

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText style={styles.pageTitle}>Calendar</ThemedText>

          <View style={styles.calendarCard}>
            <View style={styles.monthHeader}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Previous month"
                onPress={() => changeMonth(-1)}
                style={styles.monthArrow}
              >
                <ThemedText style={styles.monthArrowText}>‹</ThemedText>
              </Pressable>
              <ThemedText style={styles.monthTitle}>
                {displayedMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </ThemedText>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Next month"
                onPress={() => changeMonth(1)}
                style={styles.monthArrow}
              >
                <ThemedText style={styles.monthArrowText}>›</ThemedText>
              </Pressable>
            </View>

            <View style={styles.weekdayRow}>
              {WEEKDAYS.map((weekday) => (
                <ThemedText key={weekday} style={styles.weekdayLabel}>
                  {weekday}
                </ThemedText>
              ))}
            </View>

            <View style={styles.daysGrid}>
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <View key={`empty-${index}`} style={styles.dayCell} />;
                }

                const dateKey = getDateKey(date);
                const isSelected = dateKey === selectedDateKey;
                const isToday = dateKey === todayKey;

                return (
                  <Pressable
                    key={dateKey}
                    accessibilityRole="button"
                    accessibilityLabel={date.toLocaleDateString(undefined, {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => setSelectedDate(date)}
                    style={styles.dayCell}
                  >
                    <View
                      style={[
                        styles.dayNumberWrap,
                        isSelected && styles.dayNumberSelected,
                        isToday && !isSelected && styles.dayNumberToday,
                      ]}
                    >
                      <ThemedText
                        style={[
                          styles.dayNumber,
                          isSelected && styles.dayNumberTextSelected,
                          isToday && !isSelected && styles.dayNumberTextToday,
                        ]}
                      >
                        {date.getDate()}
                      </ThemedText>
                    </View>
                    <View style={[styles.taskDot, taskDates.has(dateKey) && styles.taskDotVisible]} />
                  </Pressable>
                );
              })}
            </View>
          </View>

          <ThemedText style={styles.sectionTitle}>
            Tasks for {selectedDate.toLocaleDateString(undefined, {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </ThemedText>

          {isLoading ? (
            <ActivityIndicator color={GreenTheme.primary} style={styles.status} />
          ) : loadError ? (
            <ThemedText style={styles.statusMessage}>
              Could not load tasks. Check your connection and try again.
            </ThemedText>
          ) : selectedTasks.length ? (
            selectedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleComplete}
                onEdit={openEditTask}
                onPress={openEditTask}
                onDelete={deleteTask}
              />
            ))
          ) : (
            <ThemedText style={styles.statusMessage}>No tasks for this day</ThemedText>
          )}
        </ScrollView>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add task for selected date"
          onPress={openAddTask}
          style={[styles.floatingButton, { bottom: BottomTabInset + Spacing.three }]}
        >
          <ThemedText style={styles.floatingButtonText}>+</ThemedText>
        </Pressable>

        <AddTaskModal
          key={editingTask?.id ?? `new-${selectedDateKey}`}
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setEditingTask(null);
          }}
          onSubmit={submitTask}
          editTask={editingTask}
          initialDate={selectedDate}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: GreenTheme.white,
  },
  container: {
    flex: 1,
    backgroundColor: GreenTheme.white,
  },
  scrollContent: {
    paddingBottom: BottomTabInset + 96,
  },
  pageTitle: {
    marginHorizontal: Spacing.three,
    marginTop: Spacing.three,
    marginBottom: Spacing.two,
    fontSize: 28,
    fontWeight: '700',
    color: GreenTheme.text,
  },
  calendarCard: {
    marginHorizontal: Spacing.three,
    paddingHorizontal: Spacing.two,
    paddingBottom: Spacing.two,
    borderRadius: 12,
    backgroundColor: GreenTheme.pale,
  },
  monthHeader: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthArrow: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: GreenTheme.white,
  },
  monthArrowText: {
    color: GreenTheme.primary,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '600',
  },
  monthTitle: {
    color: GreenTheme.text,
    fontSize: 18,
    fontWeight: '700',
  },
  weekdayRow: {
    flexDirection: 'row',
    paddingTop: Spacing.one,
    paddingBottom: Spacing.two,
  },
  weekdayLabel: {
    width: '14.2857%',
    textAlign: 'center',
    color: GreenTheme.gray,
    fontSize: 12,
    fontWeight: '700',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.2857%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  dayNumberWrap: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
  },
  dayNumberSelected: {
    backgroundColor: GreenTheme.primary,
  },
  dayNumberToday: {
    borderWidth: 1.5,
    borderColor: GreenTheme.primary,
  },
  dayNumber: {
    color: GreenTheme.text,
    fontSize: 14,
    fontWeight: '500',
  },
  dayNumberTextSelected: {
    color: GreenTheme.white,
    fontWeight: '700',
  },
  dayNumberTextToday: {
    color: GreenTheme.primary,
    fontWeight: '700',
  },
  taskDot: {
    width: 4,
    height: 4,
    marginTop: Spacing.half,
    borderRadius: 2,
  },
  taskDotVisible: {
    backgroundColor: GreenTheme.primary,
  },
  sectionTitle: {
    marginHorizontal: Spacing.three,
    marginTop: Spacing.four,
    marginBottom: Spacing.two,
    color: GreenTheme.text,
    fontSize: 18,
    fontWeight: '700',
  },
  status: {
    marginTop: Spacing.four,
  },
  statusMessage: {
    marginHorizontal: Spacing.three,
    marginTop: Spacing.four,
    color: GreenTheme.gray,
    textAlign: 'center',
  },
  floatingButton: {
    position: 'absolute',
    right: Spacing.four,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: GreenTheme.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonText: {
    color: GreenTheme.white,
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 32,
  },
});
