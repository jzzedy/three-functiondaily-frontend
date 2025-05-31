import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion';
import type { Habit, HabitFrequency } from '../types'; 
import { habitFrequencies, habitColors } from '../types'; 
import { useHabitStore } from '../../../store/habitStore';   
import Button from '../../../components/ui/Button';         
import Input from '../../../components/ui/Input';           
import { X, Save, Type, Repeat, Target } from 'lucide-react'; 

interface EditHabitModalProps {
  habit: Habit | null;
  isOpen: boolean;
  onClose: () => void;
}

const EditHabitModal: React.FC<EditHabitModalProps> = ({ habit, isOpen, onClose }) => {
  const { updateHabit, error: habitStoreError, clearHabitError } = useHabitStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>(habitFrequencies[0]);
  const [goal, setGoal] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (habit && isOpen) {
      setName(habit.name);
      setDescription(habit.description || '');
      setFrequency(habit.frequency);
      setGoal(habit.goal || '');
      setSelectedColor(habit.color || habitColors[0]);
      setFormError(null);
      clearHabitError();
    }
  }, [habit, isOpen, clearHabitError]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!habit) return;
    setFormError(null);
    clearHabitError();

    if (!name.trim()) {
      setFormError('Habit name is required.');
      return;
    }

    setIsSubmitting(true);
    const success = await updateHabit(habit.id, {
      name,
      description: description.trim() || undefined,
      frequency,
      goal: goal.trim() || undefined,
      color: selectedColor,
    });
    setIsSubmitting(false);

    if (success) {
      onClose(); 
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  if (!isOpen || !habit) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={onClose} 
        >
          <motion.div
            className="bg-card-background p-6 rounded-lg shadow-xl max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()} 
            variants={modalVariants}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="Close modal"
              disabled={isSubmitting}
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-semibold mb-6 text-text-primary">Edit Habit</h2>

            {formError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                {formError}
              </div>
            )}
            {!formError && habitStoreError && (
                 <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                 {habitStoreError}
               </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Habit Name"
                id="edit-habit-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                icon={<Type size={16} className="text-gray-400" />}
                disabled={isSubmitting}
              />

              <div>
                <label htmlFor="edit-habit-description" className="block text-sm font-medium text-text-primary mb-1">
                  Description (Optional)
                </label>
                <textarea
                  id="edit-habit-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="form-textarea block w-full px-3 py-2 border rounded-md bg-card-background text-text-primary border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent shadow-sm"
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-habit-frequency" className="block text-sm font-medium text-text-primary mb-1">
                    Frequency
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Repeat size={16} className="text-gray-400" />
                    </div>
                    <select
                      id="edit-habit-frequency"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
                      required
                      className="form-select block w-full pl-10 pr-3 py-2 border rounded-md bg-card-background text-text-primary border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent shadow-sm"
                      disabled={isSubmitting}
                    >
                      {habitFrequencies.map((freq) => (
                        <option key={freq} value={freq}>{freq.charAt(0).toUpperCase() + freq.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <Input
                  label="Goal (Optional)"
                  id="edit-habit-goal"
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  icon={<Target size={16} className="text-gray-400" />}
                  disabled={isSubmitting}
                />
              </div>

               <div className="mb-2">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Color Tag
                </label>
                <div className="flex flex-wrap gap-2">
                  {habitColors.map((color) => (
                    <button
                      type="button"
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-150
                        ${selectedColor === color ? 'ring-2 ring-offset-2 ring-primary-accent dark:ring-offset-card-background' : 'hover:opacity-80'}
                      `}
                      style={{ backgroundColor: color, borderColor: selectedColor === color ? color: 'transparent' }}
                      aria-label={`Select color ${color}`}
                      disabled={isSubmitting}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="border-gray-300 dark:border-gray-600" disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" icon={<Save size={18} />} isLoading={isSubmitting} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditHabitModal;