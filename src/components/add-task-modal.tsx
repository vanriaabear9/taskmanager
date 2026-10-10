/**
 * AddTaskModal - Modal for adding or editing tasks
 * Inputs: title, category (Personal/School), deadline (YYYY-MM-DD), priority toggle
 */
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
}

export function AddTaskModal({ visible, onClose, onSubmit, editTask }: AddTaskModalProps) {
  // Derive initial values from editTask
  const initialTitle = editTask?.title ?? '';
  const initialCategory = editTask?.category ?? 'personal';
  const initialDeadline = editTask?.deadline ?? '';
  const initialPriority = editTask?.isPriority ?? false;
  
  const [title, setTitle] = useState(initialTitle);
  const [category, setCategory] = useState<'personal' | 'school'>(initialCategory);
  const [deadline, setDeadline] = useState(initialDeadline);
  const [isPriority, setIsPriority] = useState(initialPriority);

  const handleSubmit = () => {
    if (!title.trim()) {
      return; // Don't submit empty tasks
    }

    onSubmit({
      title: title.trim(),
      category,
      deadline: deadline || new Date().toISOString().split('T')[0],
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

            {/* Deadline Input */}
            <View style={styles.section}>
              <ThemedText style={styles.label}>Deadline</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={deadline}
                onChangeText={setDeadline}
                placeholderTextColor={GreenTheme.gray}
              />
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
