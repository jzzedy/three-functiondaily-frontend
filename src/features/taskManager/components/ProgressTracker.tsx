import React from 'react';
import { useTaskStore } from '../../../store/taskStore'; 
import { motion } from 'framer-motion';
import { CheckSquare, ListChecks } from 'lucide-react';

const ProgressTracker: React.FC = () => {
  const tasks = useTaskStore((state) => state.tasks);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  if (totalTasks === 0) {
    return null; 
  }

  return (
    <div className="my-6 p-4 bg-card-background shadow rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-md font-semibold mb-3 text-text-primary flex items-center">
        <ListChecks size={20} className="mr-2 text-primary-accent" />
        Tasks Progress
      </h3>
      <div className="flex items-center justify-between text-sm text-text-secondary mb-1">
        <span>{completedTasks} / {totalTasks} tasks completed</span>
        <span className="font-medium">{Math.round(progressPercentage)}%</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-sky-500 to-blue-600 h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
      {progressPercentage === 100 && totalTasks > 0 && (
        <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
          <CheckSquare size={16} className="mr-1" />
          All tasks completed! Great job!
        </p>
      )}
    </div>
  );
};

export default ProgressTracker;
