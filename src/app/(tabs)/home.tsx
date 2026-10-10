/**
 * Home screen - Green header with greeting, week selector, stats cards, task list, floating add button
 */
import { AddTaskModal } from '@/components/add-task-modal';
import { TaskItem } from '@/components/task-item';
import { ThemedText } from '@/components/themed-text';
import { WeekDateSelector } from '@/components/week-date-selector';
import { BottomTabInset, GreenTheme, Spacing } from '@/constants/theme';
import { useTasks } from '@/hooks/use-tasks';
import type { Task } from '@/types/task';
import { useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const { tasks, stats, addTask, updateTask, deleteTask, toggleComplete } = useTasks();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddTask = () => {
    setEditingTask(null);
    setModalVisible(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setModalVisible(true);
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
        {/* Green Header */}
        <View style={styles.header}>
          <ThemedText style={styles.greeting}>
            Good day, Van! One small task at a time is still progress
          </ThemedText>
          <WeekDateSelector />
        </View>

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
    backgroundColor: GreenTheme.gradientStart,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.four,
    paddingHorizontal: Spacing.three,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: GreenTheme.white,
    lineHeight: 26,
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
