import React from 'react';
import type { Task } from '../types'; 
import { motion } from 'framer-motion';
import { ListChecks, CheckSquare } from 'lucide-react';

interface ProgressTrackerProps {
  tasks: Task[]; 
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ tasks }) => {
  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  if (totalTasks === 0) {
    return (
        <div className="my-6 p-4 bg-card-background shadow rounded-lg border border-gray-200 dark:border-gray-700">
           <p className="text-sm text-text-secondary text-center">No tasks yet. Add some tasks to see your progress!</p>
        </div>
    );
  }

  return (
    <div className="my-6 p-4 bg-card-background shadow rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-semibold text-text-primary flex items-center">
            <ListChecks size={20} className="mr-2 text-primary-accent" />
            Tasks Progress
        </h3>
        <span className="text-sm font-medium text-text-secondary">
          {completedTasks} / {totalTasks} tasks completed
        </span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-sky-500 to-blue-600 h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        ></motion.div>
      </div>
      {progressPercentage === 100 && totalTasks > 0 && (
        <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center justify-end">
            <CheckSquare size={14} className="mr-1" />
            All tasks completed! Great job!
        </p>
      )}
    </div>
  );
};

export default ProgressTracker;
