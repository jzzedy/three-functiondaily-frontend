import React, { useState, useMemo } from 'react';
import type { Habit } from '../types'; 
import { useHabitStore } from '../../../store/habitStore';
import Button from '../../../components/ui/Button';
import { CheckSquare, Square, Edit3, Trash2, Zap, TrendingUp, Calendar, Repeat as RepeatIcon, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns'; 
import { motion } from 'framer-motion';
import { calculateCurrentStreak, calculateLongestStreak, isHabitCompletedOnDate } from '../utils/streakCalculations';

interface HabitItemProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
}

const HabitItem: React.FC<HabitItemProps> = ({ habit, onEdit }) => {
  const { toggleHabitCompletion, deleteHabit, clearHabitError } = useHabitStore();
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isCompletedToday = useMemo(() => {
    return isHabitCompletedOnDate(habit, todayStr);
  }, [habit, todayStr]);

  const currentStreak = useMemo(() => calculateCurrentStreak(habit, new Date()), [habit]);
  const longestStreak = useMemo(() => calculateLongestStreak(habit), [habit]);

  const handleToggleCompletion = async () => {
    setIsToggling(true);
    clearHabitError();
    await toggleHabitCompletion(habit.id, todayStr, undefined);
    setIsToggling(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete habit: "${habit.name}"?`)) {
        setIsDeleting(true);
        clearHabitError();
        await deleteHabit(habit.id);
        setIsDeleting(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
      className="p-4 bg-card-background shadow-md rounded-lg border-l-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
      style={{ borderLeftColor: habit.color || '#777777' }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center mb-2">
          <h3 className="text-lg font-semibold text-text-primary">{habit.name}</h3>
        </div>

        {habit.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 break-words">
            {habit.description}
          </p>
        )}
        {habit.goal && (
          <p className="text-xs italic text-gray-500 dark:text-gray-400 mb-2">Goal: {habit.goal}</p>
        )}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <span className="flex items-center capitalize"><RepeatIcon size={12} className="mr-1"/> {habit.frequency}</span>
            <span className="flex items-center"><Calendar size={12} className="mr-1"/> Created: {habit.createdAt ? format(parseISO(habit.createdAt), 'MMM d, yy') : 'N/A'}</span>
        </div>

        <div className="flex space-x-4 text-sm">
            <div className="flex items-center" title="Current Streak">
                <Zap size={16} className="mr-1 text-orange-500" />
                <span className="font-medium">{currentStreak}</span>
                <span className="text-xs ml-1">day{currentStreak !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center" title="Longest Streak">
                <TrendingUp size={16} className="mr-1 text-green-500" />
                <span className="font-medium">{longestStreak}</span>
                 <span className="text-xs ml-1">day{longestStreak !== 1 ? 's' : ''}</span>
            </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2 sm:ml-4 shrink-0 self-start sm:self-center">
        <Button
            variant={isCompletedToday ? 'primary' : 'outline'}
            size="md"
            onClick={handleToggleCompletion}
            icon={isToggling ? <Loader2 className="animate-spin" size={18}/> : isCompletedToday ? <CheckSquare size={18} /> : <Square size={18} />}
            className={`w-full sm:w-auto ${isCompletedToday ? 'bg-green-500 hover:bg-green-600 text-white' : 'border-gray-300 dark:border-gray-600 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            aria-label={isCompletedToday ? "Mark as incomplete for today" : "Mark as complete for today"}
            disabled={isToggling || isDeleting}
        >
          {isToggling ? 'Updating...' : (isCompletedToday ? 'Done Today!' : 'Mark Done')}
        </Button>
        <div className="flex gap-2 w-full sm:w-auto">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(habit)}
                icon={<Edit3 size={14} />}
                className="border-gray-300 dark:border-gray-600 flex-1 sm:flex-initial"
                aria-label="Edit habit"
                disabled={isToggling || isDeleting}
            >
                <span className="hidden sm:inline ml-1">Edit</span>
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                icon={isDeleting ? <Loader2 className="animate-spin" size={14}/> : <Trash2 size={14} />}
                className="border-gray-300 dark:border-gray-600 hover:bg-red-500 hover:text-white hover:border-red-500 flex-1 sm:flex-initial"
                aria-label="Delete habit"
                disabled={isToggling || isDeleting}
            >
                <span className="hidden sm:inline ml-1">{isDeleting ? 'Deleting...' : 'Delete'}</span>
            </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default HabitItem;