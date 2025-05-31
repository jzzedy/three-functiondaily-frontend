import { create } from 'zustand';
import type { Habit, HabitInput, HabitCompletionInput } from '../features/habitTracker/types';
import * as habitService from '../services/habitService';
import { useAiNotificationStore } from './aiNotificationStore';
import type { AiTriggerEventData } from './aiNotificationStore';
import { calculateCurrentStreak } from '../features/habitTracker/utils/streakCalculations'; 

interface HabitState {
  habits: Habit[];
  isLoading: boolean;
  error: string | null;
  fetchHabits: () => Promise<void>;
  addHabit: (habitData: HabitInput) => Promise<Habit | null>;
  updateHabit: (habitId: string, updates: Partial<HabitInput>) => Promise<Habit | null>;
  deleteHabit: (habitId: string) => Promise<boolean>;
  toggleHabitCompletion: (habitId: string, date: string, notes?: string) => Promise<boolean | null>; 
  fetchHabitWithCompletions: (habitId: string) => Promise<void>; 
  clearHabitError: () => void;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  isLoading: false,
  error: null,

  fetchHabits: async () => {
    set({ isLoading: true, error: null });
    try {
      const habits = await habitService.fetchHabits();
      const sortedHabits = habits.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      set({ habits: sortedHabits, isLoading: false });
    } catch (err: unknown) { 
      let errorMessage = 'Failed to fetch habits.';
      if (typeof err === "object" && err !== null && "response" in err) {
        const responseError = err.response as { data?: { message?: string } };
        if (responseError.data?.message) { errorMessage = responseError.data.message; }
      } else if (err instanceof Error) { errorMessage = err.message; }
      set({ error: errorMessage, isLoading: false, habits: [] });
    }
  },

  addHabit: async (habitData) => {
    try {
      const newHabit = await habitService.createHabit(habitData);
      set((state) => ({
        habits: [newHabit, ...state.habits].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      }));
      const aiEventData: AiTriggerEventData = { itemName: newHabit.name, action: 'created' };
      useAiNotificationStore.getState().triggerAiSuggestion({ 
        type: 'habit_motivation', 
        data: aiEventData 
      });
      return newHabit;
    } catch (err: unknown) { 
      let errorMessage = 'Failed to add habit.';
      if (typeof err === "object" && err !== null && "response" in err) {
        const responseError = err.response as { data?: { message?: string } };
        if (responseError.data?.message) { errorMessage = responseError.data.message; }
      } else if (err instanceof Error) { errorMessage = err.message; }
      set({ error: errorMessage });
      return null;
    }
  },

  updateHabit: async (habitId, updates) => {
    try {
      const updatedHabitFromApi = await habitService.updateHabit(habitId, updates);
      set((state) => {
        const existingHabit = state.habits.find(h => h.id === habitId);
        const finalUpdatedHabit = { 
            ...updatedHabitFromApi, 
            completions: existingHabit?.completions || updatedHabitFromApi.completions || [] 
        };
        return {
          habits: state.habits.map((habit) =>
            habit.id === habitId ? finalUpdatedHabit : habit
          ).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        };
      });
      await get().fetchHabitWithCompletions(habitId);
      return get().habits.find(h => h.id === habitId) || null;
    } catch (err: unknown) { 
      let errorMessage = 'Failed to update habit.';
      if (typeof err === "object" && err !== null && "response" in err) {
        const responseError = err.response as { data?: { message?: string } };
        if (responseError.data?.message) { errorMessage = responseError.data.message; }
      } else if (err instanceof Error) { errorMessage = err.message; }
      set({ error: errorMessage });
      return null;
    }
  },

  deleteHabit: async (habitId) => {
    try {
      await habitService.deleteHabit(habitId);
      set((state) => ({
        habits: state.habits.filter((habit) => habit.id !== habitId),
      }));
      return true;
    } catch (err: unknown) { 
      let errorMessage = 'Failed to delete habit.';
      if (typeof err === "object" && err !== null && "response" in err) {
        const responseError = err.response as { data?: { message?: string } };
        if (responseError.data?.message) { errorMessage = responseError.data.message; }
      } else if (err instanceof Error) { errorMessage = err.message; }
      set({ error: errorMessage });
      return false;
    }
  },

  toggleHabitCompletion: async (habitId, date, notes) => {
    try {
      const completionData: HabitCompletionInput = { date, notes };
      const response = await habitService.toggleHabitCompletionAPI(habitId, completionData);

      await get().fetchHabitWithCompletions(habitId); 
      const updatedHabit = get().habits.find(h => h.id === habitId);

      if (updatedHabit && response.completed) {
        const currentStreak = calculateCurrentStreak(updatedHabit, new Date());
        
        
        const streakMilestones = [3, 7, 14, 21, 30, 50, 75, 100]; 
        if (streakMilestones.includes(currentStreak) && currentStreak > 0) { 
          const aiEventData: AiTriggerEventData = { 
            itemName: updatedHabit.name, 
            habitStreakLength: currentStreak, 
            action: 'streak_update' 
          };
          useAiNotificationStore.getState().triggerAiSuggestion({
            type: 'habit_motivation', 
            data: aiEventData
          });
        }
      }
      return response.completed;
    } catch (err: unknown) { 
      let errorMessage = 'Failed to toggle habit completion.';
      if (typeof err === "object" && err !== null && "response" in err) {
        const responseError = err.response as { data?: { message?: string } };
        if (responseError.data?.message) { errorMessage = responseError.data.message; }
      } else if (err instanceof Error) { errorMessage = err.message; }
      set({ error: errorMessage });
      return null;
    }
  },

  fetchHabitWithCompletions: async (habitId: string) => {
    try {
        const updatedHabitWithCompletions = await habitService.fetchHabitById(habitId);
        set(state => ({
            habits: state.habits.map(h => 
                h.id === habitId ? updatedHabitWithCompletions : h
            ).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
            error: null 
        }));
    } catch (err: unknown) { 
        let errorMessage = `Failed to fetch details for habit ${habitId}.`;
        if (typeof err === "object" && err !== null && "response" in err) {
          const responseError = err.response as { data?: { message?: string } };
          if (responseError.data?.message) { errorMessage = responseError.data.message; }
        } else if (err instanceof Error) { errorMessage = err.message; }
        set({ error: errorMessage });
        console.error(`Error fetching habit ${habitId} with completions:`, errorMessage);
    }
  },

  clearHabitError: () => set({ error: null }),
}));
