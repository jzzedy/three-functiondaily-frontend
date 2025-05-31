import React, { useState } from 'react';
import { useHabitStore } from '../../../store/habitStore'; 
import HabitItem from './HabitItem'; 
import type { Habit } from '../types'; 
import { AnimatePresence } from 'framer-motion';
import EditHabitModal from './EditHabitModal'; 
import { Sparkles } from 'lucide-react'; 


const HabitList: React.FC = () => {
  const habits = useHabitStore((state) => state.habits);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
  };

  const handleCloseEditModal = () => {
    setEditingHabit(null);
  };

  const sortedHabits = [...habits].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (habits.length === 0) { 
      return (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-12 py-8">
          <Sparkles size={48} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No Habits Defined</h3>
          <p className="text-sm">Ready to build some great habits? Add your first one above!</p>
        </div>
      );
  }

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-text-primary border-b pb-2 border-gray-200 dark:border-gray-700">
        Your Habits
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">({sortedHabits.length})</span>
      </h2>
      <AnimatePresence>
        {sortedHabits.map((habit) => (
          <HabitItem key={habit.id} habit={habit} onEdit={handleEditHabit} />
        ))}
      </AnimatePresence>

      <EditHabitModal
        habit={editingHabit}
        isOpen={!!editingHabit}
        onClose={handleCloseEditModal}
      />
    </div>
  );
};

export default HabitList;