import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion';
import type { Task, TaskCategory, TaskInput } from '../types'; 
import { taskCategories } from '../types'; 
import { useTaskStore } from '../../../store/taskStore';   
import Button from '../../../components/ui/Button';         
import Input from '../../../components/ui/Input';           
import { X, Save, CalendarDays, Tag, AlignLeft } from 'lucide-react';

interface EditTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, isOpen, onClose }) => {
  const { updateTask, error: taskStoreError, clearTaskError } = useTaskStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory | ''>(''); 
  const [deadline, setDeadline] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false); 

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null); 

  useEffect(() => {
    if (task && isOpen) { 
      setTitle(task.title);
      setDescription(task.description || '');
      setCategory(task.category || ''); 
      setDeadline(task.deadline ? task.deadline.split('T')[0] : null);
      setIsCompleted(task.isCompleted);
      setFormError(null); 
      clearTaskError(); 
    }
  }, [task, isOpen, clearTaskError]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!task) return;
    if (!title.trim()) {
      setFormError('Task title is required.');
      return;
    }
    setFormError(null);
    clearTaskError();
    setIsSubmitting(true);

    
    const updatedTaskData: Partial<TaskInput> = {
      title,
      description: description.trim() || undefined, 
      category: category || undefined, 
      deadline: deadline || null,
      isCompleted, 
    };

    const success = await updateTask(task.id, updatedTaskData);
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

  if (!isOpen || !task) return null;

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
            <h2 className="text-2xl font-semibold mb-6 text-text-primary">Edit Task</h2>

            {formError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                {formError}
              </div>
            )}
            {!formError && taskStoreError && (
                 <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                 {taskStoreError}
               </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Task Title"
                id="edit-task-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                icon={<AlignLeft size={16} className="text-gray-400" />}
                disabled={isSubmitting}
              />

              <div>
                <label htmlFor="edit-task-description" className="block text-sm font-medium text-text-primary mb-1">
                  Description (Optional)
                </label>
                <textarea
                  id="edit-task-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="form-textarea block w-full px-3 py-2 border rounded-md bg-card-background text-text-primary border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent shadow-sm"
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Deadline (Optional)"
                  id="edit-task-deadline"
                  type="date"
                  value={deadline || ''}
                  onChange={(e) => setDeadline(e.target.value || null)}
                  icon={<CalendarDays size={16} className="text-gray-400" />}
                  disabled={isSubmitting}
                />
                <div>
                  <label htmlFor="edit-task-category" className="block text-sm font-medium text-text-primary mb-1">
                    Category
                  </label>
                   <div className="relative">
                     <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                        <Tag size={16} className="text-gray-400" />
                     </div>
                    <select
                      id="edit-task-category"
                      value={category} 
                      onChange={(e) => setCategory(e.target.value as TaskCategory | '')} 
                      className="form-select block w-full pl-10 pr-3 py-2 border rounded-md bg-card-background text-text-primary border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent shadow-sm"
                      disabled={isSubmitting}
                    >
                      <option value="">No Category</option>
                      {taskCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center mb-4">
                <input
                    id="edit-task-completed"
                    type="checkbox"
                    checked={isCompleted}
                    onChange={(e) => setIsCompleted(e.target.checked)}
                    className="h-4 w-4 text-primary-accent focus:ring-primary-accent border-gray-300 rounded disabled:opacity-70"
                    disabled={isSubmitting}
                />
                <label htmlFor="edit-task-completed" className="ml-2 block text-sm text-text-primary">
                    Mark as completed
                </label>
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

export default EditTaskModal;