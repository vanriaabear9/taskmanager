/**
 * Custom hook for task management with CRUD operations and weekly tracking
 */
import { hasSupabaseConnection } from '@/lib/supabase';
import type { Task } from '@/types/task';
import { getCurrentWeekKey, isCurrentWeek } from '@/utils/date-helpers';
import { loadTasks, saveTasks } from '@/utils/storage';
import { loadTasksFromSupabase, syncTasksWithSupabase } from '@/utils/supabase-tasks';
import { useCallback, useEffect, useState } from 'react';

let sharedTasks: Task[] = [];
let sharedIsLoading = true;
let sharedLoadError: string | null = null;
const listeners = new Set<(tasks: Task[], loadError?: string | null) => void>();

const notifyListeners = (loadError?: string | null) => {
  listeners.forEach((listener) => listener(sharedTasks, loadError));
};

export interface TaskStats {
  totalCount: number;
  completedThisWeek: number;
  pendingCount: number;
}

export interface UseTasks {
  tasks: Task[];
  stats: TaskStats;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'isCompleted' | 'completedAt' | 'weekKey'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  refreshTasks: () => Promise<void>;
  isLoading: boolean;
  loadError: string | null;
}

/**
 * Hook for managing tasks with AsyncStorage persistence
 */
export function useTasks(): UseTasks {
  const [tasks, setTasks] = useState<Task[]>(sharedTasks);
  const [isLoading, setIsLoading] = useState(sharedIsLoading);
  const [loadError, setLoadError] = useState<string | null>(sharedLoadError);

  useEffect(() => {
    const updateTasks = (nextTasks: Task[], nextLoadError?: string | null) => {
      setTasks(nextTasks);
      if (nextLoadError !== undefined) {
        setLoadError(nextLoadError);
      }
    };
    listeners.add(updateTasks);

    return () => {
      listeners.delete(updateTasks);
    };
  }, []);

  const refreshTasks = useCallback(async () => {
    if (sharedIsLoading) {
      return;
    }

    try {
      const loadedTasks = hasSupabaseConnection
        ? await loadTasksFromSupabase()
        : await loadTasks();

      sharedTasks = loadedTasks;
      sharedLoadError = null;
      notifyListeners(null);
    } catch (error) {
      console.error('Failed to refresh tasks:', error);
      sharedLoadError = error instanceof Error ? error.message : 'Unable to load tasks.';
      notifyListeners(sharedLoadError);
    }
  }, []);

  // Load tasks from Supabase when configured, otherwise fall back to local storage
  useEffect(() => {
    const loadTasksFromSource = async () => {
      try {
        const loadedTasks = hasSupabaseConnection
          ? await loadTasksFromSupabase()
          : await loadTasks();

        sharedTasks = loadedTasks;
        sharedIsLoading = false;
        sharedLoadError = null;
        notifyListeners(null);
        setTasks(loadedTasks);
      } catch (error) {
        console.error('Failed to load tasks:', error);
        sharedLoadError = error instanceof Error ? error.message : 'Unable to load tasks.';
        setLoadError(sharedLoadError);
        notifyListeners(sharedLoadError);
        sharedIsLoading = false;
        notifyListeners();
      } finally {
        setIsLoading(false);
      }
    };

    if (sharedIsLoading) {
      loadTasksFromSource();
    }
  }, []);

  // Save tasks to Supabase when configured, otherwise persist locally
  useEffect(() => {
    if (isLoading) {
      return;
    }

    const persistTasks = async () => {
      try {
        if (hasSupabaseConnection) {
          await syncTasksWithSupabase(tasks);
          return;
        }

        await saveTasks(tasks);
      } catch (error) {
        console.error('Failed to save tasks:', error);
      }
    };

    persistTasks();
  }, [tasks, isLoading]);

  // Add a new task
  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'isCompleted' | 'completedAt' | 'weekKey'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      isCompleted: false,
    };

    const nextTasks = [...sharedTasks, newTask];
    sharedTasks = nextTasks;
    notifyListeners();
    setTasks(nextTasks);
  }, []);

  // Update an existing task
  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    const nextTasks = sharedTasks.map((task) =>
      task.id === id ? { ...task, ...updates } : task
    );

    sharedTasks = nextTasks;
    notifyListeners();
    setTasks(nextTasks);
  }, []);

  // Delete a task
  const deleteTask = useCallback((id: string) => {
    const nextTasks = sharedTasks.filter((task) => task.id !== id);
    sharedTasks = nextTasks;
    notifyListeners();
    setTasks(nextTasks);
  }, []);

  // Toggle task completion status
  const toggleComplete = useCallback((id: string) => {
    const nextTasks = sharedTasks.map((task) => {
      if (task.id === id) {
        const isCompleted = !task.isCompleted;
        return {
          ...task,
          isCompleted,
          completedAt: isCompleted ? new Date().toISOString() : undefined,
          weekKey: isCompleted ? getCurrentWeekKey() : undefined,
        };
      }
      return task;
    });

    sharedTasks = nextTasks;
    notifyListeners();
    setTasks(nextTasks);
  }, []);

  // Calculate statistics
  const stats: TaskStats = {
    totalCount: tasks.length,
    completedThisWeek: tasks.filter(
      (task) => task.isCompleted && isCurrentWeek(task.weekKey)
    ).length,
    pendingCount: tasks.filter((task) => !task.isCompleted).length,
  };

  return {
    tasks,
    stats,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    refreshTasks,
    isLoading,
    loadError,
  };
}
