import React, { useState } from 'react';
import type { FormEvent } from 'react'; 
import { useHabitStore } from '../../../store/habitStore'; 
import Button from '../../../components/ui/Button';         
import Input from '../../../components/ui/Input';           
import { habitFrequencies, habitColors } from '../types'; 
import type { HabitFrequency } from '../types';
import { PlusCircle, Type, Repeat, Target } from 'lucide-react'; 

const AddHabitForm: React.FC = () => {
  const { addHabit, clearHabitError } = useHabitStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>(habitFrequencies[0]);
  const [goal, setGoal] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(habitColors[0]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    clearHabitError(); 

    if (!name.trim()) {
      setFormError('Habit name is required.');
      return;
    }

    setIsSubmitting(true);
    const newHabit = await addHabit({
      name,
      description: description.trim() || undefined,
      frequency,
      goal: goal.trim() || undefined,
      color: selectedColor,
    });
    setIsSubmitting(false);

    if (newHabit) {
      setName('');
      setDescription('');
      setFrequency(habitFrequencies[0]);
      setGoal('');
      setSelectedColor(habitColors[0]);
    } 
  };

  return (
    <form onSubmit={handleSubmit} className="my-6 p-6 bg-card-background shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-6 text-text-primary flex items-center">
        <PlusCircle size={24} className="mr-2 text-primary-accent" />
        Add New Habit
      </h2>

      {formError && ( 
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
          {formError}
        </div>
      )}

      <Input
        label="Habit Name"
        id="habit-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Morning Meditation"
        required
        className="mb-4"
        icon={<Type size={16} className="text-gray-400" />}
        disabled={isSubmitting}
      />

      <div className="mb-4">
        <label htmlFor="habit-description" className="block text-sm font-medium text-text-primary mb-1">
          Description (Optional)
        </label>
        <textarea
          id="habit-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Why is this habit important to you?"
          rows={2}
          className="form-textarea block w-full px-3 py-2 border rounded-md bg-card-background text-text-primary border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent shadow-sm"
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="habit-frequency" className="block text-sm font-medium text-text-primary mb-1">
            Frequency
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
              <Repeat size={16} className="text-gray-400" />
            </div>
            <select
              id="habit-frequency"
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
          id="habit-goal"
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g., For 15 minutes"
          icon={<Target size={16} className="text-gray-400" />}
          disabled={isSubmitting}
        />
      </div>

      <div className="mb-6">
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

      <Button type="submit" className="w-full sm:w-auto" icon={<PlusCircle size={18} />} isLoading={isSubmitting} disabled={isSubmitting}>
        {isSubmitting ? 'Adding Habit...' : 'Add Habit'}
      </Button>
    </form>
  );
};

export default AddHabitForm;