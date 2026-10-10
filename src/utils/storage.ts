/**
 * AsyncStorage utilities for task persistence
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Task } from '@/types/task';

const STORAGE_KEY = 'TASKS_DATA';

/**
 * Load tasks from AsyncStorage
 * @returns Promise resolving to array of tasks (empty array if none stored)
 */
export async function loadTasks(): Promise<Task[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data === null) {
      return [];
    }
    return JSON.parse(data) as Task[];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
}

/**
 * Save tasks to AsyncStorage
 * @param tasks - Array of tasks to persist
 */
export async function saveTasks(tasks: Task[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
}
