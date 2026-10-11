import { supabase } from '@/lib/supabase';
import type { Task } from '@/types/task';

const TABLE = 'tasks';

function mapSupabaseTask(row: Record<string, any>): Task {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    deadline: row.deadline,
    isPriority: row.isPriority ?? row.ispriority ?? false,
    isCompleted: row.isCompleted ?? row.iscompleted ?? false,
    completedAt: row.completedAt ?? row.completedat ?? undefined,
    createdAt: row.createdAt ?? row.createdat ?? new Date().toISOString(),
    weekKey: row.weekKey ?? row.weekkey ?? undefined,
  };
}

function mapTaskForSupabase(task: Task): Record<string, any> {
  return {
    id: task.id,
    title: task.title,
    category: task.category,
    deadline: task.deadline,
    ispriority: task.isPriority,
    iscompleted: task.isCompleted,
    completedat: task.completedAt ?? null,
    createdat: task.createdAt,
    weekkey: task.weekKey ?? null,
  };
}

export async function loadTasksFromSupabase(): Promise<Task[]> {
  if (!supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('id, title, category, deadline, ispriority, iscompleted, completedat, createdat, weekkey')
      .order('createdat', { ascending: true });

    if (error) {
      console.error('Error loading tasks from Supabase with lowercase columns:', error);

      const fallback = await supabase
        .from(TABLE)
        .select('id, title, category, deadline, "isPriority", "isCompleted", "completedAt", "createdAt", "weekKey"')
        .order('"createdAt"', { ascending: true } as any);

      if (fallback.error) {
        console.error('Error loading tasks from Supabase with camelCase columns:', fallback.error);
        return [];
      }

      return (fallback.data ?? []).map(mapSupabaseTask);
    }

    return (data ?? []).map(mapSupabaseTask);
  } catch (error) {
    console.error('Unexpected error loading tasks from Supabase:', error);
    return [];
  }
}

export async function saveTasksToSupabase(tasks: Task[]): Promise<void> {
  if (!supabase) {
    return;
  }

  try {
    const payload = tasks.map(mapTaskForSupabase);
    const { error } = await supabase.from(TABLE).upsert(payload, {
      onConflict: 'id',
    });

    if (error) {
      console.error('Error saving tasks to Supabase with lowercase columns:', error);

      const fallback = tasks.map((task) => ({
        id: task.id,
        title: task.title,
        category: task.category,
        deadline: task.deadline,
        'isPriority': task.isPriority,
        'isCompleted': task.isCompleted,
        'completedAt': task.completedAt ?? null,
        'createdAt': task.createdAt,
        'weekKey': task.weekKey ?? null,
      }));

      const { error: fallbackError } = await supabase.from(TABLE).upsert(fallback as any, {
        onConflict: 'id',
      });

      if (fallbackError) {
        console.error('Error saving tasks to Supabase with camelCase columns:', fallbackError);
      }
    }
  } catch (error) {
    console.error('Unexpected error saving tasks to Supabase:', error);
  }
}

export async function syncTasksWithSupabase(tasks: Task[]): Promise<void> {
  if (!supabase) {
    return;
  }

  await saveTasksToSupabase(tasks);
}
