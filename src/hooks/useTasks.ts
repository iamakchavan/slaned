import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const useTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks from Supabase
  const fetchTasks = async () => {
    if (!user || !supabase) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTasks: Task[] = (data || []).map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || undefined,
        completed: task.completed,
        priority: task.priority,
        dueDate: task.due_date ? new Date(task.due_date) : undefined,
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at),
      }));

      setTasks(formattedTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      if (err instanceof Error && err.message.includes('refresh_token_not_found')) {
        setError('Session expired. Please sign in again.');
      } else {
        setError('Failed to fetch tasks');
      }
    } finally {
      setLoading(false);
    }
  };

  // Create a new task
  const createTask = async (taskData: {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: Date;
  }) => {
    if (!user || !supabase) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title: taskData.title,
          description: taskData.description || null,
          priority: taskData.priority,
          due_date: taskData.dueDate ? taskData.dueDate.toISOString() : null,
          completed: false,
        })
        .select()
        .single();

      if (error) throw error;

      const newTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        completed: data.completed,
        priority: data.priority,
        dueDate: data.due_date ? new Date(data.due_date) : undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task');
      throw err;
    }
  };

  // Update a task
  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!user || !supabase) return;

    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description || null;
      if (updates.completed !== undefined) updateData.completed = updates.completed;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate ? updates.dueDate.toISOString() : null;

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        completed: data.completed,
        priority: data.priority,
        dueDate: data.due_date ? new Date(data.due_date) : undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      setTasks(prev => prev.map(task => task.id === taskId ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
      throw err;
    }
  };

  // Delete a task
  const deleteTask = async (taskId: string) => {
    if (!user || !supabase) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
      throw err;
    }
  };

  // Duplicate a task
  const duplicateTask = async (taskId: string) => {
    const taskToDuplicate = tasks.find(task => task.id === taskId);
    if (!taskToDuplicate) return;

    return createTask({
      title: `${taskToDuplicate.title} (Copy)`,
      description: taskToDuplicate.description,
      priority: taskToDuplicate.priority,
      dueDate: taskToDuplicate.dueDate,
    });
  };

  // Clear completed tasks
  const clearCompletedTasks = async () => {
    if (!user || !supabase) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('user_id', user.id)
        .eq('completed', true);

      if (error) throw error;

      setTasks(prev => prev.filter(task => !task.completed));
    } catch (err) {
      console.error('Error clearing completed tasks:', err);
      setError('Failed to clear completed tasks');
      throw err;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    duplicateTask,
    clearCompletedTasks,
    refetch: fetchTasks,
  };
};