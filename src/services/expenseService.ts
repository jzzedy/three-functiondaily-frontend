import apiClient from './apiService';
import type { Expense, ExpenseInput } from '../features/expenseTracker/types'; 

type RawExpenseData = Omit<Expense, 'amount'> & { amount: string | number };

const parseExpense = (rawExpense: RawExpenseData): Expense => ({
    ...rawExpense,
    amount: parseFloat(String(rawExpense.amount)),
});

interface ExpensesResponse { expenses: RawExpenseData[]; }
interface SingleExpenseResponse { expense: RawExpenseData; }
interface CreateExpenseResponse { message: string; expense: RawExpenseData; }
interface UpdateExpenseResponse { message: string; expense: RawExpenseData; }


interface RawExpenseSummaryItem { category: string; totalAmount: number | string; }
interface RawExpenseSummaryResponse {
    summary: RawExpenseSummaryItem[];
    grandTotal: number | string;
}


export interface ParsedExpenseSummary {
    summary: Array<{ category: string; totalAmount: number }>;
    grandTotal: number;
}

export const fetchExpenses = async (): Promise<Expense[]> => {
  const response = await apiClient.get<ExpensesResponse>('/expenses');
  return response.data.expenses.map(parseExpense);
};

export const fetchExpenseById = async (expenseId: string): Promise<Expense> => {
  const response = await apiClient.get<SingleExpenseResponse>(`/expenses/${expenseId}`);
  return parseExpense(response.data.expense);
};

export const createExpense = async (expenseData: ExpenseInput): Promise<Expense> => {
  const response = await apiClient.post<CreateExpenseResponse>('/expenses', expenseData);
  return parseExpense(response.data.expense);
};

export const updateExpense = async (expenseId: string, expenseData: Partial<ExpenseInput>): Promise<Expense> => {
  const response = await apiClient.put<UpdateExpenseResponse>(`/expenses/${expenseId}`, expenseData);
  return parseExpense(response.data.expense);
};

export const deleteExpense = async (expenseId: string): Promise<void> => {
  await apiClient.delete(`/expenses/${expenseId}`);
};


export const fetchExpenseSummary = async (): Promise<ParsedExpenseSummary> => {
  const response = await apiClient.get<RawExpenseSummaryResponse>('/expenses/summary');
  return {
    summary: response.data.summary.map(item => ({
        ...item,
        totalAmount: parseFloat(String(item.totalAmount)) 
    })),
    grandTotal: parseFloat(String(response.data.grandTotal))
  };
};