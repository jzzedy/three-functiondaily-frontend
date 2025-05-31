import apiClient from './apiService';
import type { Task, TaskInput } from '../features/taskManager/types'; 

interface TasksResponse {
  tasks: Task[];
}

interface SingleTaskResponse {
  task: Task;
}

interface CreateTaskResponse {
    message: string;
    task: Task;
}

interface UpdateTaskResponse {
    message: string;
    task: Task;
}

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await apiClient.get<TasksResponse>('/tasks');
  return response.data.tasks;
};

export const fetchTaskById = async (taskId: string): Promise<Task> => {
  const response = await apiClient.get<SingleTaskResponse>(`/tasks/${taskId}`);
  return response.data.task;
};

export const createTask = async (taskData: Omit<TaskInput, 'isCompleted'>): Promise<Task> => {
  const payload = {
    title: taskData.title,
    description: taskData.description,
    deadline: taskData.deadline,
    category: taskData.category,
  };
  const response = await apiClient.post<CreateTaskResponse>('/tasks', payload);
  return response.data.task;
};

export const updateTask = async (taskId: string, taskData: Partial<TaskInput>): Promise<Task> => {
  const response = await apiClient.put<UpdateTaskResponse>(`/tasks/${taskId}`, taskData);
  return response.data.task;
};

export const toggleTaskAPI = async (taskId: string, isCompleted: boolean): Promise<Task> => {
  const response = await apiClient.put<UpdateTaskResponse>(`/tasks/${taskId}`, { isCompleted });
  return response.data.task;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await apiClient.delete(`/tasks/${taskId}`);
};