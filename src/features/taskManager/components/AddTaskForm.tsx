import React, { useState } from 'react';
import type { FormEvent } from 'react'; 
import { useTaskStore } from '../../../store/taskStore'; 
import Button from '../../../components/ui/Button'; 
import Input from '../../../components/ui/Input';   
import { taskCategories } from '../types'; 
import type { TaskCategory } from '../types'; 
import { PlusCircle, CalendarDays, Tag, AlignLeft } from 'lucide-react';

const AddTaskForm: React.FC = () => {
  
  const { addTask, clearTaskError } = useTaskStore(); 
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory | ''>(taskCategories[0]);
  const [deadline, setDeadline] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null); 

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Task title is required.');
      return;
    }
    setFormError(null);
    clearTaskError(); 
    setIsSubmitting(true);

    const success = await addTask({
      title,
      description: description.trim() || undefined,
      category: category || undefined,
      deadline: deadline || null,
    });

    setIsSubmitting(false);
    if (success) {
      setTitle('');
      setDescription('');
      setCategory(taskCategories[0]);
      setDeadline(null);
    } 
    
  };

  return (
    <form onSubmit={handleSubmit} className="my-6 p-6 bg-card-background shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-6 text-text-primary flex items-center">
        <PlusCircle size={24} className="mr-2 text-primary-accent" />
        Add New Task
      </h2>

      {formError && ( 
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
          {formError}
        </div>
      )}
      {}

      <Input
        label="Task Title"
        id="task-title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g., Finish project report"
        required
        className="mb-4"
        icon={<AlignLeft size={16} className="text-gray-400" />}
        disabled={isSubmitting}
      />

      <div className="mb-4">
        <label htmlFor="task-description" className="block text-sm font-medium text-text-primary mb-1">
          Description (Optional)
        </label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details about the task..."
          rows={3}
          className="form-textarea block w-full px-3 py-2 border rounded-md bg-card-background text-text-primary border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent shadow-sm"
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Input
          label="Deadline (Optional)"
          id="task-deadline"
          type="date"
          value={deadline || ''}
          onChange={(e) => setDeadline(e.target.value || null)}
          icon={<CalendarDays size={16} className="text-gray-400" />}
          disabled={isSubmitting}
        />
        <div>
          <label htmlFor="task-category" className="block text-sm font-medium text-text-primary mb-1">
            Category
          </label>
          <div className="relative">
             <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                <Tag size={16} className="text-gray-400" />
             </div>
            <select
              id="task-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory | '')}
              className="form-select block w-full pl-10 pr-3 py-2 border rounded-md bg-card-background text-text-primary border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent shadow-sm"
              disabled={isSubmitting}
            >
              {taskCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full sm:w-auto" icon={<PlusCircle size={18} />} isLoading={isSubmitting} disabled={isSubmitting}>
        {isSubmitting ? 'Adding Task...' : 'Add Task'}
      </Button>
    </form>
  );
};

export default AddTaskForm;