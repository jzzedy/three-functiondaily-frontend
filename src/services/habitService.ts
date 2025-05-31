import apiClient from './apiService';

import type { Habit, HabitInput, HabitCompletion, HabitCompletionInput } from '../features/habitTracker/types'; 

interface HabitsResponse {
  habits: Habit[];
}

interface SingleHabitResponse {
  habit: Habit; 
}

interface CreateHabitResponse {
    message: string;
    habit: Habit;
}

interface UpdateHabitResponse {
    message: string;
    habit: Habit;
}

interface ToggleCompletionResponse {
    message: string;
    completion?: HabitCompletion; 
    habitId: string;
    date: string;
    completed: boolean; 
}

export const fetchHabits = async (): Promise<Habit[]> => {
  const response = await apiClient.get<HabitsResponse>('/habits');
  return response.data.habits.map(h => ({ ...h, completions: h.completions || [] }));
};

export const fetchHabitById = async (habitId: string): Promise<Habit> => {
  const response = await apiClient.get<SingleHabitResponse>(`/habits/${habitId}`);
  return { ...response.data.habit, completions: response.data.habit.completions || [] };
};

export const createHabit = async (habitData: HabitInput): Promise<Habit> => {
  const response = await apiClient.post<CreateHabitResponse>('/habits', habitData);
  return { ...response.data.habit, completions: [] }; 
};

export const updateHabit = async (habitId: string, habitData: Partial<HabitInput>): Promise<Habit> => {
  const response = await apiClient.put<UpdateHabitResponse>(`/habits/${habitId}`, habitData);
  
  
  return response.data.habit; 
};

export const deleteHabit = async (habitId: string): Promise<void> => {
  await apiClient.delete(`/habits/${habitId}`);
};

export const toggleHabitCompletionAPI = async (
  habitId: string, 
  completionData: HabitCompletionInput
): Promise<ToggleCompletionResponse> => {
  const response = await apiClient.post<ToggleCompletionResponse>(`/habits/${habitId}/completions`, completionData);
  return response.data;
};
