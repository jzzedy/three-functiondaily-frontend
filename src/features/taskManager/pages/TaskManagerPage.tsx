import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../../../config/animationVariants'; 
import AddTaskForm from '../components/AddTaskForm';
import TaskList from '../components/TaskList';
import ProgressTracker from '../components/ProgressTracker';
import { useTaskStore } from '../../../store/taskStore'; 
import { Loader2, AlertTriangle } from 'lucide-react'; 

const TaskManagerPage: React.FC = () => {
  const { fetchTasks, isLoading, error, clearTaskError } = useTaskStore();

  useEffect(() => {
    fetchTasks();
    
    return () => {
        clearTaskError();
    }
  }, [fetchTasks, clearTaskError]);

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
        <h1 className="text-3xl font-bold text-primary-accent">Task Manager</h1>
        <p className="text-text-secondary mt-1">Stay organized and productive.</p>
      </header>

      <AddTaskForm />
      <ProgressTracker />

      {isLoading && (
        <div className="flex justify-center items-center my-10 p-6 bg-card-background rounded-lg shadow">
          <Loader2 className="animate-spin h-8 w-8 text-primary-accent mr-3" />
          <span className="text-text-secondary">Loading tasks...</span>
        </div>
      )}

      {error && !isLoading && ( 
        <div className="my-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md flex items-center">
          <AlertTriangle className="h-5 w-5 mr-3" />
          <span>Error: {error}</span>
          <button 
            onClick={clearTaskError} 
            className="ml-auto text-sm font-semibold hover:underline"
            aria-label="Clear error"
          >
            Dismiss
          </button>
        </div>
      )}

      {!isLoading && !error && <TaskList />}

    </motion.div>
  );
};
export default TaskManagerPage;