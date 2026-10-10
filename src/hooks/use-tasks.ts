/**
 * Custom hook for task management with CRUD operations and weekly tracking
 */
import { useState, useEffect, useCallback } from 'react';
import type { Task } from '@/types/task';
import { loadTasks, saveTasks } from '@/utils/storage';
import { getCurrentWeekKey, isCurrentWeek } from '@/utils/date-helpers';

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
  isLoading: boolean;
}

/**
 * Hook for managing tasks with AsyncStorage persistence
 */
export function useTasks(): UseTasks {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks from storage on mount
  useEffect(() => {
    loadTasks()
      .then((loadedTasks) => {
        setTasks(loadedTasks);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load tasks:', error);
        setIsLoading(false);
      });
  }, []);

  // Save tasks to storage whenever they change
  useEffect(() => {
    if (!isLoading) {
      saveTasks(tasks).catch((error) => {
        console.error('Failed to save tasks:', error);
      });
    }
  }, [tasks, isLoading]);

  // Add a new task
  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'isCompleted' | 'completedAt' | 'weekKey'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      isCompleted: false,
    };
    setTasks((prev) => [...prev, newTask]);
  }, []);

  // Update an existing task
  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  }, []);

  // Delete a task
  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  // Toggle task completion status
  const toggleComplete = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
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
      })
    );
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
    isLoading,
  };
}
