export interface ExpenseInput { 
  description: string;
  amount: number; 
  category: ExpenseCategory | ''; 
  date: string; 
}

export interface Expense extends ExpenseInput {
  id: string; 
  userId: string;
  createdAt: string; 
  updatedAt: string; 
}

export type ExpenseCategory =
  | 'Food' | 'Transport' | 'Bills' | 'Entertainment' | 'Health'
  | 'Shopping' | 'Education' | 'Gifts' | 'Other';

export const expenseCategories: ExpenseCategory[] = [
  'Food', 'Transport', 'Bills', 'Entertainment', 'Health',
  'Shopping', 'Education', 'Gifts', 'Other',
];

export const categoryColors: Record<ExpenseCategory, string> = {
    Food: '#FF6384', 
    Transport: '#36A2EB',
    Bills: '#FFCE56',
    Entertainment: '#4BC0C0',
    Health: '#9966FF',
    Shopping: '#FF9F40',
    Education: '#C9CBCF',
    Gifts: '#E7E9ED',
    Other: '#777777'
};