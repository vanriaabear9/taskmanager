import { ThemedText } from '@/components/themed-text';
import { GreenTheme, Spacing } from '@/constants/theme';
import type { Task } from '@/types/task';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';

export type TaskNotification = {
  key: string;
  kind: 'overdue' | 'today' | 'tomorrow';
  message: string;
  dueDate: string;
  task: Task;
};

function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getTaskDateKey(deadline: string): string | null {
  const dateOnly = deadline.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnly) {
    return `${dateOnly[1]}-${dateOnly[2]}-${dateOnly[3]}`;
  }

  const date = new Date(deadline);
  return Number.isNaN(date.getTime()) ? null : localDateKey(date);
}

function formatDueDate(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getTaskNotifications(tasks: Task[], referenceDate = new Date()): TaskNotification[] {
  const todayKey = localDateKey(referenceDate);
  const tomorrow = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate() + 1
  );
  const tomorrowKey = localDateKey(tomorrow);

  return tasks.flatMap((task) => {
    const dueDate = getTaskDateKey(task.deadline);
    if (!dueDate) {
      return [];
    }

    let kind: TaskNotification['kind'];
    let message: string;

    if (dueDate < todayKey && !task.isCompleted) {
      kind = 'overdue';
      message = 'Overdue task';
    } else if (dueDate === todayKey) {
      kind = 'today';
      message = 'Due today';
    } else if (dueDate === tomorrowKey) {
      kind = 'tomorrow';
      message = 'Due tomorrow';
    } else {
      return [];
    }

    return [{
      key: `${task.id}:${kind}:${dueDate}`,
      kind,
      message,
      dueDate: formatDueDate(dueDate),
      task,
    }];
  });
}

interface NotificationPanelProps {
  visible: boolean;
  notifications: TaskNotification[];
  onClose: () => void;
  onSelectNotification: (task: Task) => void;
}

export function NotificationPanel({
  visible,
  notifications,
  onClose,
  onSelectNotification,
}: NotificationPanelProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close notifications"
          onPress={onClose}
          style={styles.backdrop}
        />
        <View style={styles.panel}>
          <View style={styles.headingRow}>
            <ThemedText style={styles.heading}>Notifications</ThemedText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close notifications"
              onPress={onClose}
              style={styles.closeButton}
            >
              <ThemedText style={styles.closeText}>×</ThemedText>
            </Pressable>
          </View>
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${item.message}: ${item.task.title}, due ${item.dueDate}`}
                onPress={() => onSelectNotification(item.task)}
                style={styles.notification}
              >
                <View style={styles.notificationDot} />
                <View style={styles.notificationContent}>
                  <ThemedText style={styles.message}>{item.message}</ThemedText>
                  <ThemedText numberOfLines={2} style={styles.taskTitle}>
                    {item.task.title}
                  </ThemedText>
                  <ThemedText style={styles.dueDate}>Due {item.dueDate}</ThemedText>
                </View>
              </Pressable>
            )}
            contentContainerStyle={notifications.length ? styles.list : styles.emptyList}
            ListEmptyComponent={
              <ThemedText style={styles.emptyText}>No task notifications right now.</ThemedText>
            }
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  panel: {
    maxHeight: '72%',
    backgroundColor: GreenTheme.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
  },
  heading: {
    color: GreenTheme.text,
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GreenTheme.pale,
  },
  closeText: {
    color: GreenTheme.text,
    fontSize: 26,
    lineHeight: 30,
  },
  list: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.four,
  },
  emptyText: {
    color: GreenTheme.gray,
    textAlign: 'center',
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: GreenTheme.lightGray,
  },
  notificationDot: {
    width: 8,
    height: 8,
    marginTop: 6,
    borderRadius: 4,
    backgroundColor: GreenTheme.primary,
  },
  notificationContent: {
    flex: 1,
    gap: Spacing.half,
  },
  message: {
    color: GreenTheme.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  taskTitle: {
    color: GreenTheme.text,
    fontSize: 16,
    fontWeight: '600',
  },
  dueDate: {
    color: GreenTheme.gray,
    fontSize: 13,
  },
});