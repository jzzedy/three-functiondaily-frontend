import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../../../config/animationVariants';
import AddExpenseForm from '../components/AddExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseChart from '../components/ExpenseChart';
import { useExpenseStore } from '../../../store/expenseStore';
import type { PreferredCurrency } from '../../../store/expenseStore'; 
import { Loader2, AlertTriangle, Settings } from 'lucide-react';

const ExpenseTrackerPage: React.FC = () => {
  const { 
    fetchExpenses, 
    isLoading, 
    error, 
    clearExpenseError,
    preferredCurrency, 
    setPreferredCurrency 
  } = useExpenseStore();

  useEffect(() => {
    fetchExpenses(); 
    return () => {
        clearExpenseError(); 
    }
  }, [fetchExpenses, clearExpenseError]);

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPreferredCurrency(event.target.value as PreferredCurrency);
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="container mx-auto p-0 sm:p-4" 
    >
      <header className="mb-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-primary-accent">Expense Tracker</h1>
                <p className="text-text-secondary mt-1">Keep an eye on your spending.</p>
            </div>
            <div className="flex items-center space-x-2">
                <Settings size={18} className="text-text-secondary" />
                <label htmlFor="currency-select" className="text-sm font-medium text-text-secondary">
                    Currency:
                </label>
                <select
                    id="currency-select"
                    value={preferredCurrency}
                    onChange={handleCurrencyChange}
                    className="form-select text-sm py-1.5 pl-2 pr-7 border rounded-md bg-card-background text-text-primary border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-primary-accent focus:border-primary-accent shadow-sm"
                >
                    <option value="PHP">PHP (₱)</option>
                    <option value="USD">USD ($)</option>
                </select>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AddExpenseForm />
          {/* Corrected Loading and Error State UI */}
          {isLoading && (
            <div className="flex justify-center items-center my-10 p-6 bg-card-background rounded-lg shadow">
              <Loader2 className="animate-spin h-8 w-8 text-primary-accent mr-3" />
              <span className="text-text-secondary">Loading expenses...</span>
            </div>
          )}
          {error && !isLoading && (
            <div className="my-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-3" />
                <span>Error: {error}</span>
              </div>
               <button 
                onClick={clearExpenseError} 
                className="ml-auto text-sm font-semibold hover:underline"
                aria-label="Dismiss error"
              >
                Dismiss
              </button>
            </div>
          )}
          {!isLoading && !error && <ExpenseList />}
        </div>
        <div className="lg:col-span-1">
          <ExpenseChart />
        </div>
      </div>
    </motion.div>
  );
};
export default ExpenseTrackerPage;