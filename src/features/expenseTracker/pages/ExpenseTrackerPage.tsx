import React, { useEffect,useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, pageTransition } from '../../../config/animationVariants';
import AddExpenseForm from '../components/AddExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseChart from '../components/ExpenseChart';
import { useExpenseStore } from '../../../store/expenseStore';
import type { PreferredCurrency } from '../../../store/expenseStore'; 
import { Loader2, AlertTriangle, Settings, Plus, X as CloseIcon } from 'lucide-react';
import useIsMobile from '../../../hooks/useIsMobile';

const ExpenseTrackerPage: React.FC = () => {
  const { 
    fetchExpenses, 
    isLoading, 
    error, 
    clearExpenseError,
    preferredCurrency, 
    setPreferredCurrency 
  } = useExpenseStore();

const isMobile = useIsMobile();
const [showQuickAddModal, setShowQuickAddModal] = useState(false);

  useEffect(() => {
    fetchExpenses(); 
    return () => {
        clearExpenseError(); 
    }
  }, [fetchExpenses, clearExpenseError]);

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPreferredCurrency(event.target.value as PreferredCurrency);
  };

   const handleOpenQuickAdd = () => {
    console.log("Mobile Quick Add Expense FAB clicked");
    setShowQuickAddModal(true); 
  };
  const handleCloseQuickAddModal = () => {
    setShowQuickAddModal(false);
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
        <div className="flex flex-wrap justify-between items-center gap-4"> {}
            <div>
                <h1 className="text-3xl font-bold text-primary-accent">Expense Tracker</h1>
                <p className="text-text-secondary mt-1">Keep an eye on your spending.</p>
            </div>
            <div className="flex items-center space-x-2">
                <Settings size={18} className="text-text-secondary" />
                <label htmlFor="currency-select" className="text-sm font-medium text-text-secondary whitespace-nowrap"> {}
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
          {isLoading && (
            <div className="flex justify-center items-center my-10 p-6 bg-card-background rounded-lg shadow">
              <Loader2 className="animate-spin h-8 w-8 text-primary-accent mr-3" />
              <span className="text-text-secondary">Loading expenses...</span>
            </div>
          )}
          {error && !isLoading && (
            <div className="my-6 p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md flex items-center justify-between">
                <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-3" />
                    <span>Error: {error}</span>
                </div>
               <button 
                onClick={clearExpenseError} 
                className="ml-auto text-sm font-semibold hover:underline focus:outline-none"
                aria-label="Clear error"
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

      {}
      {isMobile && (
        <motion.button
          onClick={handleOpenQuickAdd}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-secondary-accent text-white p-4 rounded-full shadow-lg z-40 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-accent dark:focus:ring-offset-dark-background"
          aria-label="Quick Add Expense"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <Plus size={24} />
        </motion.button>
      )}

      {}
      <AnimatePresence>
        {isMobile && showQuickAddModal && (
          <motion.div 
              className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseQuickAddModal} 
          >
              <motion.div 
                  className="bg-card-background p-6 rounded-lg shadow-xl w-full max-w-md"
                  onClick={(e) => e.stopPropagation()} 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-text-primary">Quick Add Expense</h3>
                    <button onClick={handleCloseQuickAddModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <CloseIcon size={24}/>
                    </button>
                  </div>
                  {}
                  <AddExpenseForm /> 
              </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
export default ExpenseTrackerPage;