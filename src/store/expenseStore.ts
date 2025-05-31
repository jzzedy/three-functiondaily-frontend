import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; 
import type { Expense, ExpenseInput } from '../features/expenseTracker/types'; 
import * as expenseService from '../services/expenseService'; 
import type { ParsedExpenseSummary } from '../services/expenseService'; 
import { useAiNotificationStore } from './aiNotificationStore'; 
import type { AiTriggerEventData } from './aiNotificationStore'; 
import { format, parseISO, isSameDay } from 'date-fns'; 

export type PreferredCurrency = 'PHP' | 'USD';

interface ExpenseState {
  expenses: Expense[];
  summary: ParsedExpenseSummary | null; 
  isLoading: boolean; 
  error: string | null;
  preferredCurrency: PreferredCurrency; 
  fetchExpenses: () => Promise<void>;
  addExpense: (expenseData: ExpenseInput) => Promise<Expense | null>;
  updateExpense: (expenseId: string, updates: Partial<ExpenseInput>) => Promise<Expense | null>;
  deleteExpense: (expenseId: string) => Promise<boolean>;
  fetchSummary: () => Promise<void>; 
  setPreferredCurrency: (currency: PreferredCurrency) => void; 
  clearExpenseError: () => void;
}

const PHP_HIGH_EXPENSE_THRESHOLD = 20000;
const USD_HIGH_EXPENSE_THRESHOLD = 400; 
const REPEATED_EXPENSE_COUNT_THRESHOLD = 3;

export const useExpenseStore = create<ExpenseState>()(
  persist( 
    (set, get) => ({ 
      expenses: [],
      summary: null,
      isLoading: false,
      error: null,
      preferredCurrency: 'PHP', 

      fetchExpenses: async () => {
        set({ isLoading: true, error: null });
        try {
          const expenses = await expenseService.fetchExpenses();
          const sortedExpenses = expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          set({ expenses: sortedExpenses, isLoading: false });
          await get().fetchSummary(); 
        } catch (err: unknown) { 
          let errorMessage = 'Failed to fetch expenses.';
          if (typeof err === "object" && err !== null && "response" in err) {
            const responseError = err.response as { data?: { message?: string } };
            if (responseError.data?.message) { errorMessage = responseError.data.message; }
          } else if (err instanceof Error) { errorMessage = err.message; }
          set({ error: errorMessage, isLoading: false, expenses: [] });
        }
      },

      addExpense: async (expenseData) => {
        try {
          const newExpense = await expenseService.createExpense(expenseData);
          const allExpensesIncludingNew = [newExpense, ...get().expenses];

          set({
            expenses: allExpensesIncludingNew.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
          });
          await get().fetchSummary();

          const currentCurrency = get().preferredCurrency;
          const aiEventDataGeneral: AiTriggerEventData = { 
            itemName: newExpense.description, 
            itemValue: `${currentCurrency === 'PHP' ? '₱' : '$'}${newExpense.amount.toFixed(2)}`, 
            itemCategory: newExpense.category,
            action: 'added' 
          };
          useAiNotificationStore.getState().triggerAiSuggestion({ 
            type: 'expense_insight', 
            data: aiEventDataGeneral
          });

          const highExpenseThreshold = currentCurrency === 'PHP' 
                                        ? PHP_HIGH_EXPENSE_THRESHOLD 
                                        : USD_HIGH_EXPENSE_THRESHOLD;

          if (newExpense.amount > highExpenseThreshold) { 
            const aiEventDataHigh: AiTriggerEventData = {
                itemName: newExpense.description,
                expenseAmount: newExpense.amount, 
                itemCategory: newExpense.category,
                currency: currentCurrency, 
                action: 'threshold_reached'
            };
            useAiNotificationStore.getState().triggerAiSuggestion({
                type: 'expense_insight', 
                data: aiEventDataHigh
            });
          }

          const todayStr = format(parseISO(newExpense.date), 'yyyy-MM-dd'); 
          const expensesToday = allExpensesIncludingNew.filter(exp => 
            isSameDay(parseISO(exp.date), parseISO(todayStr))
          );
          const categoryCountToday = expensesToday.filter(exp => exp.category === newExpense.category).length;

          if (categoryCountToday >= REPEATED_EXPENSE_COUNT_THRESHOLD) {
            const aiEventDataRepeated: AiTriggerEventData = {
                itemCategory: newExpense.category,
                count: categoryCountToday,
                action: 'repeated_category_expense'
            };
            useAiNotificationStore.getState().triggerAiSuggestion({
                type: 'expense_insight',
                data: aiEventDataRepeated
            });
          }
          return newExpense;
        } catch (err: unknown) { 
          let errorMessage = 'Failed to add expense.';
          if (typeof err === "object" && err !== null && "response" in err) {
            const responseError = err.response as { data?: { message?: string } };
            if (responseError.data?.message) { errorMessage = responseError.data.message; }
          } else if (err instanceof Error) { errorMessage = err.message; }
          set({ error: errorMessage });
          return null;
        }
      },

      updateExpense: async (expenseId, updates) => {
        try {
          const updatedExpense = await expenseService.updateExpense(expenseId, updates);
          set((state) => ({
            expenses: state.expenses.map((expense) =>
              expense.id === expenseId ? updatedExpense : expense
            ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
          }));
          await get().fetchSummary();
          return updatedExpense;
        } catch (err: unknown) { 
          let errorMessage = 'Failed to update expense.';
          if (typeof err === "object" && err !== null && "response" in err) {
            const responseError = err.response as { data?: { message?: string } };
            if (responseError.data?.message) { errorMessage = responseError.data.message; }
          } else if (err instanceof Error) { errorMessage = err.message; }
          set({ error: errorMessage });
          return null;
        }
      },

      deleteExpense: async (expenseId) => {
        try {
          await expenseService.deleteExpense(expenseId);
          set((state) => ({
            expenses: state.expenses.filter((expense) => expense.id !== expenseId),
          }));
          await get().fetchSummary();
          return true;
        } catch (err: unknown) { 
          let errorMessage = 'Failed to delete expense.';
          if (typeof err === "object" && err !== null && "response" in err) {
            const responseError = err.response as { data?: { message?: string } };
            if (responseError.data?.message) { errorMessage = responseError.data.message; }
          } else if (err instanceof Error) { errorMessage = err.message; }
          set({ error: errorMessage });
          return false;
        }
      },

      fetchSummary: async () => {
        try {
          const summaryData = await expenseService.fetchExpenseSummary(); 
          set({ summary: summaryData, error: null });
        } catch (err: unknown) { 
          let errorMessage = 'Failed to fetch expense summary.';
          if (typeof err === "object" && err !== null && "response" in err) {
            const responseError = err.response as { data?: { message?: string } };
            if (responseError.data?.message) { errorMessage = responseError.data.message; }
          } else if (err instanceof Error) { errorMessage = err.message; }
          console.error("Summary fetch error:", errorMessage);
          set({ summary: null, error: errorMessage }); 
        }
      },
      setPreferredCurrency: (currency: PreferredCurrency) => {
        set({ preferredCurrency: currency });
      },
      clearExpenseError: () => set({ error: null }),
    }),
    {
      name: 'expense-storage', 
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ preferredCurrency: state.preferredCurrency }), 
    }
  )
);
