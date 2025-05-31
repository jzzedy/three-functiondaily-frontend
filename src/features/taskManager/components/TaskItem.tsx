import React, { useState } from 'react';
import type { Task, TaskCategory } from '../types'; 
import { useTaskStore } from '../../../store/taskStore'; 
import Button from '../../../components/ui/Button'; 
import { CheckCircle, Circle, Edit3, Trash2, CalendarDays, Tag, Loader2 } from 'lucide-react';
import { format, parseISO, differenceInDays, formatDistanceToNowStrict } from 'date-fns';
import { motion } from 'framer-motion';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const { toggleTaskCompletion, deleteTask, clearTaskError } = useTaskStore();
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleCompletion = async () => {
    setIsToggling(true);
    clearTaskError(); 
    await toggleTaskCompletion(task.id, task.isCompleted);
    setIsToggling(false);
  };

  const handleDelete = async () => {
    
    if (window.confirm(`Are you sure you want to delete task: "${task.title}"?`)) {
        setIsDeleting(true);
        clearTaskError(); 
        await deleteTask(task.id);
        setIsDeleting(false);
    }
  };

  const getDeadlineInfo = () => {
    if (!task.deadline) return null;
    try {
        const deadlineDate = parseISO(task.deadline);
        const today = new Date();
        today.setHours(0,0,0,0); 

        const diffDays = differenceInDays(deadlineDate, today); 

        let colorClass = 'text-gray-500 dark:text-gray-400';
        let text = `Due ${format(deadlineDate, 'MMM d, yyyy')}`; 

        if (diffDays < 0) { 
          colorClass = 'text-red-500 dark:text-red-400 font-semibold';
          text = `Overdue`;
        } else if (diffDays === 0) { 
          colorClass = 'text-orange-500 dark:text-orange-400 font-semibold';
          text = 'Due Today';
        } else if (diffDays <= 3) { 
          colorClass = 'text-yellow-600 dark:text-yellow-400';
          text = `Due in ${diffDays} day${diffDays > 1 ? 's' : ''}`; 
        }
        return { text, colorClass, diffDays }; 
    } catch (e) {
        console.error("Error parsing deadline date:", task.deadline, e);
        return { text: "Invalid Date", colorClass: "text-red-500", diffDays: null }; 
    }
  };

  const deadlineInfo = getDeadlineInfo();

  const categoryColorMapping: Record<TaskCategory, string> = {
    Work: 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-200',
    Personal: 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-200',
    Study: 'bg-purple-100 text-purple-700 dark:bg-purple-700 dark:text-purple-200',
    Errands: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-200',
    Other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
      className={`p-4 bg-card-background shadow-md rounded-lg border-l-4 ${
        task.isCompleted ? 'border-green-500 opacity-70' : 'border-primary-accent'
      } transition-all duration-300`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center mb-1">
            <button
              onClick={handleToggleCompletion}
              disabled={isToggling}
              className="mr-3 focus:outline-none p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
              aria-label={task.isCompleted ? 'Mark task as incomplete' : 'Mark task as complete'}
            >
              {isToggling ? <Loader2 size={22} className="animate-spin text-primary-accent" /> : 
                task.isCompleted ? (
                <CheckCircle size={22} className="text-green-500" />
              ) : (
                <Circle size={22} className="text-gray-400 hover:text-primary-accent" />
              )}
            </button>
            <h3
              className={`text-lg font-semibold cursor-pointer hover:text-primary-accent ${
                task.isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : 'text-text-primary'
              }`}
              onClick={handleToggleCompletion} 
            >
              {task.title}
            </h3>
          </div>

          {task.description && (
            <p className={`text-sm text-gray-600 dark:text-gray-400 ml-10 mb-2 break-words ${task.isCompleted ? 'line-through' : ''}`}>
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400 ml-10 mt-1">
            {task.category && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center ${
                  categoryColorMapping[task.category as TaskCategory] || categoryColorMapping.Other
                }`}
              >
                <Tag size={12} className="mr-1" />
                {task.category}
              </span>
            )}
            {deadlineInfo && (
              <span className={`flex items-center ${deadlineInfo.colorClass}`}>
                <CalendarDays size={12} className="mr-1" />
                {deadlineInfo.text}
                {}
                {deadlineInfo.diffDays !== null && deadlineInfo.diffDays < 0 && task.deadline && ` (${formatDistanceToNowStrict(parseISO(task.deadline), { addSuffix: true })})`}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 ml-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(task)}
            icon={<Edit3 size={14} />}
            className="border-gray-300 dark:border-gray-600 hover:bg-yellow-500 hover:text-white hover:border-yellow-500"
            aria-label="Edit task"
            disabled={isToggling || isDeleting}
          >
            <span className="hidden sm:inline ml-1">Edit</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            icon={isDeleting ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
            className="border-gray-300 dark:border-gray-600 hover:bg-red-500 hover:text-white hover:border-red-500"
            aria-label="Delete task"
            disabled={isToggling || isDeleting}
          >
             <span className="hidden sm:inline ml-1">{isDeleting ? 'Deleting...' : 'Delete'}</span>
          </Button>
        </div>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-right">
        Created: {task.createdAt ? format(parseISO(task.createdAt), "MMM d, HH:mm") : 'N/A'}
      </p>
    </motion.div>
  );
};

export default TaskItem;