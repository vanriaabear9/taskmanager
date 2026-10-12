/**
 * Tasks screen - Search bar, filter buttons (All/Pending/Completed), filtered task list
 */
import { AddTaskModal } from '@/components/add-task-modal';
import { TaskItem } from '@/components/task-item';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, GreenTheme, Spacing } from '@/constants/theme';
import { useTasks } from '@/hooks/use-tasks';
import type { Task } from '@/types/task';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FilterType = 'all' | 'pending' | 'completed';

export default function TasksScreen() {
  const { tasks, addTask, updateTask, deleteTask, toggleComplete } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Compute filtered tasks based on search query and active filter
  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Apply search filter (case-insensitive title match)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((task) =>
        task.title.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (activeFilter === 'pending') {
      result = result.filter((task) => !task.isCompleted);
    } else if (activeFilter === 'completed') {
      result = result.filter((task) => task.isCompleted);
    }

    return result;
  }, [tasks, searchQuery, activeFilter]);

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
        <LinearGradient
          colors={[GreenTheme.gradientStart, GreenTheme.gradientMid, GreenTheme.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.taskHeader}
        >
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search tasks..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="rgba(255,255,255,0.8)"
            />
          </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <Pressable
            onPress={() => setActiveFilter('all')}
            style={[
              styles.filterButton,
              activeFilter === 'all' && styles.filterButtonActive
            ]}
          >
            <ThemedText
              style={[
                styles.filterButtonText,
                activeFilter === 'all' && styles.filterButtonTextActive
              ]}
            >
              All
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => setActiveFilter('pending')}
            style={[
              styles.filterButton,
              activeFilter === 'pending' && styles.filterButtonActive
            ]}
          >
            <ThemedText
              style={[
                styles.filterButtonText,
                activeFilter === 'pending' && styles.filterButtonTextActive
              ]}
            >
              Pending
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => setActiveFilter('completed')}
            style={[
              styles.filterButton,
              activeFilter === 'completed' && styles.filterButtonActive
            ]}
          >
            <ThemedText
              style={[
                styles.filterButtonText,
                activeFilter === 'completed' && styles.filterButtonTextActive
              ]}
            >
              Completed
            </ThemedText>
          </Pressable>
        </View>
        </LinearGradient>

        {/* Task List */}
        <FlatList
          data={filteredTasks}
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
                {searchQuery.trim()
                  ? 'No tasks match your search'
                  : activeFilter === 'pending'
                  ? 'No pending tasks'
                  : activeFilter === 'completed'
                  ? 'No completed tasks yet'
                  : 'No tasks yet. Tap the + button to add one!'}
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
    backgroundColor: GreenTheme.white,
  },
  container: {
    flex: 1,
    backgroundColor: GreenTheme.white,
  },
  taskHeader: {
    paddingTop: Spacing.five,
    paddingBottom: Spacing.three,
    paddingHorizontal: Spacing.three,
    minHeight: 170,
  },
  searchContainer: {
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  searchInput: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    padding: Spacing.three,
    fontSize: 16,
    color: GreenTheme.white,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  filterButton: {
    flex: 1,
    paddingVertical: Spacing.two,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
  },
  filterButtonActive: {
    borderColor: 'rgba(255,255,255,0.9)',
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
  },
  filterButtonTextActive: {
    color: GreenTheme.white,
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
