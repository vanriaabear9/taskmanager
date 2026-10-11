/**
 * TaskItem - Single task row component with checkbox, title, category badge, deadline, edit/delete buttons
 */
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GreenTheme, Spacing } from '@/constants/theme';
import type { Task } from '@/types/task';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDelete(task.id)
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      {/* Checkbox */}
      <Pressable
        onPress={() => onToggle(task.id)}
        style={[styles.checkbox, task.isCompleted && styles.checkboxChecked]}
      >
        {task.isCompleted && (
          <ThemedText style={styles.checkmark}>✓</ThemedText>
        )}
      </Pressable>

      {/* Task Info */}
      <View style={styles.content}>
        <ThemedText 
          style={[styles.title, task.isCompleted && styles.titleCompleted]}
          numberOfLines={2}
        >
          {task.title}
        </ThemedText>
        
        <View style={styles.metaRow}>
          {/* Category Badge */}
          <View style={styles.badge}>
            <ThemedText style={styles.badgeText}>
              {task.category === 'personal' ? 'Personal' : 'School'}
            </ThemedText>
          </View>

          {/* Priority Badge */}
          <View style={[styles.badge, task.isPriority ? styles.priorityBadge : styles.secondaryBadge]}>
            <ThemedText style={styles.badgeText}>
              {task.isPriority ? 'Priority' : 'Normal'}
            </ThemedText>
          </View>
          
          {/* Deadline */}
          <ThemedText style={styles.deadline}>
            {formatDeadline(task.deadline)}
          </ThemedText>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Pressable onPress={() => onEdit(task)} style={styles.actionButton}>
          <ThemedText style={styles.actionIcon}>✏️</ThemedText>
        </Pressable>
        
        <Pressable onPress={handleDelete} style={styles.actionButton}>
          <ThemedText style={styles.actionIcon}>🗑️</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

/**
 * Format deadline date for display
 */
function formatDeadline(deadline: string): string {
  try {
    const date = new Date(deadline);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  } catch {
    return deadline;
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    marginHorizontal: Spacing.three,
    marginBottom: Spacing.two,
    borderRadius: 12,
    backgroundColor: GreenTheme.pale,
    gap: Spacing.two,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: GreenTheme.primary,
    backgroundColor: GreenTheme.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: GreenTheme.primary,
  },
  checkmark: {
    color: GreenTheme.white,
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    gap: Spacing.one,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: GreenTheme.text,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: GreenTheme.gray,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: 6,
    backgroundColor: GreenTheme.light,
  },
  priorityBadge: {
    backgroundColor: GreenTheme.primary,
  },
  secondaryBadge: {
    backgroundColor: GreenTheme.medium,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: GreenTheme.white,
  },
  deadline: {
    fontSize: 12,
    color: GreenTheme.gray,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  actionButton: {
    padding: Spacing.one,
  },
  actionIcon: {
    fontSize: 18,
  },
});
