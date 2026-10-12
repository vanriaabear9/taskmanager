/**
 * AddTaskModal - Modal for adding or editing tasks
 * Inputs: title, category (Personal/School), deadline (date + time pickers), priority toggle
 */
import DateTimePicker, { DateTimePickerChangeEvent } from '@react-native-community/datetimepicker';

import { ThemedText } from '@/components/themed-text';
import { GreenTheme, Spacing } from '@/constants/theme';
import type { Task } from '@/types/task';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    TextInput,
    View
} from 'react-native';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (taskData: {
    title: string;
    category: 'personal' | 'school';
    deadline: string;
    isPriority: boolean;
  }) => void;
  editTask?: Task | null;
  initialDate?: Date;
}

export function AddTaskModal({ visible, onClose, onSubmit, editTask, initialDate }: AddTaskModalProps) {
  // Derive initial values from editTask
  const initialTitle = editTask?.title ?? '';
  const initialCategory = editTask?.category ?? 'personal';
  const initialDeadline = editTask?.deadline
    ? new Date(editTask.deadline)
    : initialDate ?? new Date();
  const initialPriority = editTask?.isPriority ?? false;
  
  const [title, setTitle] = useState(initialTitle);
  const [category, setCategory] = useState<'personal' | 'school'>(initialCategory);
  const [deadlineDate, setDeadlineDate] = useState(initialDeadline);
  const [isPriority, setIsPriority] = useState(initialPriority);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateValueChange = (_event: DateTimePickerChangeEvent, selectedDate: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    setDeadlineDate(selectedDate);
  };

  const handleTimeValueChange = (_event: DateTimePickerChangeEvent, selectedDate: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    setDeadlineDate(selectedDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      return; // Don't submit empty tasks
    }

    onSubmit({
      title: title.trim(),
      category,
      deadline: deadlineDate.toISOString(),
      isPriority,
    });

    // Close modal
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <ThemedText style={styles.header}>
              {editTask ? 'Edit Task' : 'Add New Task'}
            </ThemedText>

            {/* Title Input */}
            <View style={styles.section}>
              <ThemedText style={styles.label}>Task Title</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Enter task title"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor={GreenTheme.gray}
              />
            </View>

            {/* Category Selection */}
            <View style={styles.section}>
              <ThemedText style={styles.label}>Category</ThemedText>
              <View style={styles.categoryButtons}>
                <Pressable
                  onPress={() => setCategory('personal')}
                  style={[
                    styles.categoryButton,
                    category === 'personal' && styles.categoryButtonActive
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.categoryButtonText,
                      category === 'personal' && styles.categoryButtonTextActive
                    ]}
                  >
                    Personal
                  </ThemedText>
                </Pressable>

                <Pressable
                  onPress={() => setCategory('school')}
                  style={[
                    styles.categoryButton,
                    category === 'school' && styles.categoryButtonActive
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.categoryButtonText,
                      category === 'school' && styles.categoryButtonTextActive
                    ]}
                  >
                    School
                  </ThemedText>
                </Pressable>
              </View>
            </View>

            {/* Deadline Date & Time Pickers */}
            <View style={styles.section}>
              <ThemedText style={styles.label}>Deadline</ThemedText>
              
              {/* Date Picker Button */}
              <Pressable 
                onPress={() => setShowDatePicker(true)}
                style={styles.dateTimeButton}
              >
                <ThemedText style={styles.dateTimeButtonText}>
                  📅 {formatDate(deadlineDate)}
                </ThemedText>
              </Pressable>

              {/* Time Picker Button */}
              <Pressable 
                onPress={() => setShowTimePicker(true)}
                style={[styles.dateTimeButton, { marginTop: Spacing.two }]}
              >
                <ThemedText style={styles.dateTimeButtonText}>
                  🕐 {formatTime(deadlineDate)}
                </ThemedText>
              </Pressable>

              {/* Date Picker Modal */}
              {showDatePicker && (
                <DateTimePicker
                  value={deadlineDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onValueChange={handleDateValueChange}
                  onDismiss={() => setShowDatePicker(false)}
                  minimumDate={new Date()}
                />
              )}

              {/* Time Picker Modal */}
              {showTimePicker && (
                <DateTimePicker
                  value={deadlineDate}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onValueChange={handleTimeValueChange}
                  onDismiss={() => setShowTimePicker(false)}
                />
              )}
            </View>

            {/* Priority Toggle */}
            <View style={styles.section}>
              <View style={styles.priorityRow}>
                <ThemedText style={styles.label}>Priority</ThemedText>
                <Switch
                  value={isPriority}
                  onValueChange={setIsPriority}
                  trackColor={{ false: GreenTheme.lightGray, true: GreenTheme.light }}
                  thumbColor={isPriority ? GreenTheme.primary : GreenTheme.white}
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <Pressable onPress={handleCancel} style={styles.cancelButton}>
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </Pressable>

              <Pressable onPress={handleSubmit} style={styles.submitButton}>
                <ThemedText style={styles.submitButtonText}>
                  {editTask ? 'Update' : 'Add Task'}
                </ThemedText>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: GreenTheme.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  scrollContent: {
    padding: Spacing.four,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: GreenTheme.text,
    marginBottom: Spacing.four,
  },
  section: {
    marginBottom: Spacing.four,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: GreenTheme.text,
    marginBottom: Spacing.two,
  },
  input: {
    borderWidth: 1,
    borderColor: GreenTheme.lightGray,
    borderRadius: 12,
    padding: Spacing.three,
    fontSize: 16,
    color: GreenTheme.black,
    backgroundColor: GreenTheme.white,
  },
  categoryButtons: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: Spacing.three,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: GreenTheme.lightGray,
    backgroundColor: GreenTheme.white,
    alignItems: 'center',
  },
  categoryButtonActive: {
    borderColor: GreenTheme.primary,
    backgroundColor: GreenTheme.pale,
  },
  categoryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: GreenTheme.gray,
  },
  categoryButtonTextActive: {
    color: GreenTheme.primary,
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: GreenTheme.lightGray,
    borderRadius: 12,
    padding: Spacing.three,
    backgroundColor: GreenTheme.white,
    alignItems: 'center',
  },
  dateTimeButtonText: {
    fontSize: 16,
    color: GreenTheme.black,
    fontWeight: '500',
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.three,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: GreenTheme.lightGray,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: GreenTheme.gray,
  },
  submitButton: {
    flex: 1,
    paddingVertical: Spacing.three,
    borderRadius: 12,
    backgroundColor: GreenTheme.primary,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: GreenTheme.white,
  },
});
