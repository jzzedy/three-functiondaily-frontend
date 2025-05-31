import { create } from 'zustand';
import type { Task, TaskInput } from '../features/taskManager/types'; 
import * as taskService from '../services/taskService'; 
import { useAiNotificationStore } from './aiNotificationStore'; 

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (taskData: Omit<TaskInput, 'isCompleted'>) => Promise<Task | null>;
  updateTask: (taskId: string, updates: Partial<TaskInput>) => Promise<Task | null>;
  deleteTask: (taskId: string) => Promise<boolean>;
  toggleTaskCompletion: (taskId: string, currentStatus: boolean) => Promise<Task | null>;
  clearTaskError: () => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await taskService.fetchTasks();
      set({ tasks, isLoading: false });
    } catch (err: unknown) { 
      let errorMessage = 'Failed to fetch tasks.';
      if (typeof err === "object" && err !== null && "response" in err) {
        const responseError = err.response as { data?: { message?: string } };
        if (responseError.data?.message) { errorMessage = responseError.data.message; }
      } else if (err instanceof Error) { errorMessage = err.message; }
      set({ error: errorMessage, isLoading: false, tasks: [] });
    }
  },

  addTask: async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData);
      set((state) => ({
        tasks: [newTask, ...state.tasks].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      }));
      useAiNotificationStore.getState().triggerAiSuggestion({ 
        type: 'task_tip', 
        data: { itemName: newTask.title, action: 'added' } 
      });
      return newTask;
    } catch (err: unknown) { 
      let errorMessage = 'Failed to add task.';
      if (typeof err === "object" && err !== null && "response" in err) {
        const responseError = err.response as { data?: { message?: string } };
        if (responseError.data?.message) { errorMessage = responseError.data.message; }
      } else if (err instanceof Error) { errorMessage = err.message; }
      set({ error: errorMessage }); 
      return null;
    }
  },

  updateTask: async (taskId, updates) => {
    try {
      const updatedTask = await taskService.updateTask(taskId, updates);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? updatedTask : task
        ).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      }));
      return updatedTask;
    } catch (err: unknown) { 
      let errorMessage = 'Failed to update task.';
       if (typeof err === "object" && err !== null && "response" in err) {
        const responseError = err.response as { data?: { message?: string } };
        if (responseError.data?.message) { errorMessage = responseError.data.message; }
      } else if (err instanceof Error) { errorMessage = err.message; }
      set({ error: errorMessage });
      return null;
    }
  },

  toggleTaskCompletion: async (taskId, currentStatus) => {
    try {
        const updatedTask = await taskService.toggleTaskAPI(taskId, !currentStatus);
        set(state => ({
            tasks: state.tasks.map(task => task.id === taskId ? updatedTask : task)
                              .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        }));
        if (updatedTask.isCompleted) {
            useAiNotificationStore.getState().triggerAiSuggestion({
                type: 'task_tip', 
                data: { itemName: updatedTask.title, action: 'completed' } 
            });
        }
        return updatedTask;
    } catch (err: unknown) { 
      let errorMessage = 'Failed to toggle task.';
      if (typeof err === "object" && err !== null && "response" in err) {
        const responseError = err.response as { data?: { message?: string } };
        if (responseError.data?.message) { errorMessage = responseError.data.message; }
      } else if (err instanceof Error) { errorMessage = err.message; }
      set({ error: errorMessage });
      return null;
    }
  },

  deleteTask: async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
      }));
      return true;
    } catch (err: unknown) { 
      let errorMessage = 'Failed to delete task.';
      if (typeof err === "object" && err !== null && "response" in err) {
        const responseError = err.response as { data?: { message?: string } };
        if (responseError.data?.message) { errorMessage = responseError.data.message; }
      } else if (err instanceof Error) { errorMessage = err.message; }
      set({ error: errorMessage });
      return false;
    }
  },
  clearTaskError: () => set({ error: null }),
}));