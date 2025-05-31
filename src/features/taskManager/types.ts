export interface TaskInput { 
  title: string;
  description?: string | null;
  deadline?: string | null; 
  category?: TaskCategory | '' | null; 
  isCompleted?: boolean; 
}

export interface Task extends TaskInput { 
  id: string;
  userId: string; 
  isCompleted: boolean; 
  createdAt: string; 
  updatedAt: string; 
  category?: TaskCategory | null; 
}

export type TaskCategory = 'Work' | 'Personal' | 'Study' | 'Errands' | 'Other';

export const taskCategories: TaskCategory[] = ['Work', 'Personal', 'Study', 'Errands', 'Other'];