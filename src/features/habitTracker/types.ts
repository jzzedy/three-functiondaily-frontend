export type HabitFrequency = 'daily' | 'weekly' | 'monthly'; 

export interface HabitCompletionInput { 
  date: string; 
  notes?: string | null;
}

export interface HabitCompletion extends HabitCompletionInput {
  id: string; 
  habitId: string;
  userId: string; 
  createdAt: string; 
}

export interface HabitInput { 
  name: string;
  description?: string | null;
  frequency: HabitFrequency;
  goal?: string | null;
  color?: string | null; 
  icon?: string | null; 
}

export interface Habit extends HabitInput {
  id: string; 
  userId: string; 
  completions: HabitCompletion[]; 
  createdAt: string; 
  updatedAt: string; 
}

export const habitFrequencies: HabitFrequency[] = ['daily', 'weekly', 'monthly'];

export const habitColors: string[] = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766', '#2AB7CA',
    '#F0B67F', '#FE4A49', '#547980', '#8A9B0F', '#C0D860'
];
