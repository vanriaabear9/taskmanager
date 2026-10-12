import { AddTaskModal } from '@/components/add-task-modal';
import { NotificationPanel, getTaskNotifications } from '@/components/notification-panel';
import { TaskItem } from '@/components/task-item';
import { ThemedText } from '@/components/themed-text';
import { WeekDateSelector } from '@/components/week-date-selector';
import { BottomTabInset, GreenTheme, Spacing } from '@/constants/theme';
import { useTasks } from '@/hooks/use-tasks';
import type { Task } from '@/types/task';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { tasks, stats, addTask, updateTask, deleteTask, toggleComplete, refreshTasks } = useTasks();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [notificationPanelVisible, setNotificationPanelVisible] = useState(false);
  const [readNotificationKeys, setReadNotificationKeys] = useState<Set<string>>(() => new Set());
  const notifications = useMemo(() => getTaskNotifications(tasks), [tasks]);
  const hasUnreadNotifications = notifications.some(
    (notification) => !readNotificationKeys.has(notification.key)
  );

  useFocusEffect(
    useCallback(() => {
      void refreshTasks();
    }, [refreshTasks])
  );

  const handleAddTask = () => {
    setEditingTask(null);
    setModalVisible(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const openNotifications = () => {
    setReadNotificationKeys((previous) => {
      const next = new Set(previous);
      notifications.forEach((notification) => next.add(notification.key));
      return next;
    });
    setNotificationPanelVisible(true);
  };

  const handleSubmitTask = (taskData: {
    title: string;
    category: 'personal' | 'school';
    deadline: string;
    isPriority: boolean;
  }) => {
    if (editingTask) {
      // Update existing task
      updateTask(editingTask.id, taskData);
    } else {
      // Add new task
      addTask(taskData);
    }
    setModalVisible(false);
    setEditingTask(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Green Gradient Header */}
        <LinearGradient
          colors={[GreenTheme.gradientStart, GreenTheme.gradientMid, GreenTheme.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Notifications${notifications.length ? `, ${notifications.length} available` : ''}`}
            accessibilityState={{ expanded: notificationPanelVisible }}
            onPress={openNotifications}
            style={styles.notificationButton}
          >
            <ThemedText style={styles.bellIcon}>🔔</ThemedText>
            {hasUnreadNotifications && <View style={styles.unreadIndicator} />}
          </Pressable>
          <ThemedText style={styles.greeting}>
            Good day, Van! One small task at a time is still progress
          </ThemedText>
          <WeekDateSelector />
        </LinearGradient>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>{stats.totalCount}</ThemedText>
            <ThemedText style={styles.statLabel}>Total Tasks</ThemedText>
          </View>

          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>{stats.completedThisWeek}</ThemedText>
            <ThemedText style={styles.statLabel}>Completed</ThemedText>
          </View>

          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>{stats.pendingCount}</ThemedText>
            <ThemedText style={styles.statLabel}>Pending</ThemedText>
          </View>
        </View>

        {/* Task List */}
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={toggleComplete}
              onEdit={handleEditTask}
              onDelete={deleteTask}
            />
          )}
          contentContainerStyle={styles.taskList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>
                No tasks yet. Tap the + button to add one!
              </ThemedText>
            </View>
          }
        />

        {/* Floating Add Button */}
        <Pressable 
          onPress={handleAddTask} 
          style={[styles.floatingButton, { bottom: BottomTabInset + 20 }]}
        >
          <ThemedText style={styles.floatingButtonText}>+</ThemedText>
        </Pressable>

        {/* Add/Edit Task Modal */}
        <AddTaskModal
          key={editingTask?.id ?? 'new'}
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setEditingTask(null);
          }}
          onSubmit={handleSubmitTask}
          editTask={editingTask}
        />

        <NotificationPanel
          visible={notificationPanelVisible}
          notifications={notifications}
          onClose={() => setNotificationPanelVisible(false)}
          onSelectNotification={(task) => {
            setNotificationPanelVisible(false);
            handleEditTask(task);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: GreenTheme.gradientStart,
  },
  container: {
    flex: 1,
    backgroundColor: GreenTheme.white,
  },
  header: {
    paddingTop: Spacing.six,
    paddingBottom: Spacing.five,
    paddingHorizontal: Spacing.three,
    minHeight: 220,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: GreenTheme.white,
    lineHeight: 28,
    marginTop: Spacing.three,
    marginBottom: Spacing.four,
    paddingRight: 56,
  },
  notificationButton: {
    position: 'absolute',
    top: Spacing.two,
    right: Spacing.three,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  bellIcon: {
    fontSize: 21,
    lineHeight: 28,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: GreenTheme.pale,
    borderWidth: 1,
    borderColor: GreenTheme.dark,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    gap: Spacing.two,
  },
  statCard: {
    flex: 1,
    backgroundColor: GreenTheme.pale,
    borderRadius: 12,
    padding: Spacing.three,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: GreenTheme.primary,
    marginBottom: Spacing.one,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: GreenTheme.gray,
    textAlign: 'center',
  },
  taskList: {
    paddingTop: Spacing.two,
    paddingBottom: BottomTabInset + 80,
  },
  emptyContainer: {
    padding: Spacing.six,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: GreenTheme.gray,
    textAlign: 'center',
  },
  floatingButton: {
    position: 'absolute',
    right: Spacing.four,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: GreenTheme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonText: {
    fontSize: 32,
    fontWeight: '700',
    color: GreenTheme.white,
    lineHeight: 32,
  },
});
