import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, pageTransition } from '../../../config/animationVariants'; 
import AddHabitForm from '../components/AddHabitForm';
import HabitList from '../components/HabitList';
import { useHabitStore } from '../../../store/habitStore'; 
import { Loader2, AlertTriangle, Plus, X as CloseIcon } from 'lucide-react';
import useIsMobile from '../../../hooks/useIsMobile';

const HabitTrackerPage: React.FC = () => {
  const { fetchHabits, isLoading, error, clearHabitError } = useHabitStore();
  const isMobile = useIsMobile();
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);

  useEffect(() => {
    fetchHabits();
    return () => {
        clearHabitError(); 
    }
  }, [fetchHabits, clearHabitError]);

  const handleOpenQuickAdd = () => {
    console.log("Mobile Quick Add Habit FAB clicked");
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
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary-accent">Habit Tracker</h1>
        <p className="text-text-secondary mt-1">Build good habits, break bad ones.</p>
      </header>

      <AddHabitForm />

      {isLoading && (
        <div className="flex justify-center items-center my-10 p-6 bg-card-background rounded-lg shadow">
          <Loader2 className="animate-spin h-8 w-8 text-primary-accent mr-3" />
          <span className="text-text-secondary">Loading habits...</span>
        </div>
      )}

      {error && !isLoading && (
        <div className="my-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md flex items-center">
          <AlertTriangle className="h-5 w-5 mr-3" />
          <span>Error: {error}</span>
           <button 
            onClick={clearHabitError} 
            className="ml-auto text-sm font-semibold hover:underline"
            aria-label="Clear error"
          >
            Dismiss
          </button>
        </div>
      )}

      {!isLoading && !error && <HabitList />}
      {}
      {isMobile && (
        <motion.button
          onClick={handleOpenQuickAdd}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-secondary-accent text-white p-4 rounded-full shadow-lg z-40 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-accent dark:focus:ring-offset-dark-background"
          aria-label="Quick Add Habit"
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
                    <h3 className="text-xl font-semibold text-text-primary">Quick Add Habit</h3>
                    <button onClick={handleCloseQuickAddModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <CloseIcon size={24}/>
                    </button>
                  </div>
                  {}
                  <AddHabitForm /> 
              </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HabitTrackerPage;