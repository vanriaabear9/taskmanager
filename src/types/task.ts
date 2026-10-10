/**
 * Task type definition for the todo app
 */
export interface Task {
  /** Unique identifier for the task */
  id: string;
  
  /** Task title/description */
  title: string;
  
  /** Task category: personal or school */
  category: 'personal' | 'school';
  
  /** Deadline in ISO string format */
  deadline: string;
  
  /** Whether the task is marked as priority */
  isPriority: boolean;
  
  /** Whether the task is completed */
  isCompleted: boolean;
  
  /** ISO timestamp when task was completed (optional) */
  completedAt?: string;
  
  /** ISO timestamp when task was created */
  createdAt: string;
  
  /** Week key in 'YYYY-WW' format when task was completed (optional) */
  weekKey?: string;
}
