import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../../../config/animationVariants'; 
import AddHabitForm from '../components/AddHabitForm';
import HabitList from '../components/HabitList';
import { useHabitStore } from '../../../store/habitStore'; 
import { Loader2, AlertTriangle } from 'lucide-react';

const HabitTrackerPage: React.FC = () => {
  const { fetchHabits, isLoading, error, clearHabitError } = useHabitStore();

  useEffect(() => {
    fetchHabits();
    return () => {
        clearHabitError(); 
    }
  }, [fetchHabits, clearHabitError]);

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

    </motion.div>
  );
};

export default HabitTrackerPage;