import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Expense, ExpenseCategory } from '../types'; 
import { expenseCategories } from '../types'; 
import { useExpenseStore } from '../../../store/expenseStore';   
import Button from '../../../components/ui/Button';         
import Input from '../../../components/ui/Input';           
import { X, Save, CalendarDays, Tag, Type, DollarSign } from 'lucide-react';
import { format, parseISO } from 'date-fns';


interface EditExpenseModalProps {
  expense: Expense | null;
  isOpen: boolean;
  onClose: () => void;
}

const EditExpenseModal: React.FC<EditExpenseModalProps> = ({ expense, isOpen, onClose }) => {
  const { updateExpense, error: expenseStoreError, clearExpenseError } = useExpenseStore();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory | ''>('');
  const [date, setDate] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (expense && isOpen) { 
      setDescription(expense.description);
      setAmount(expense.amount.toString());
      setCategory(expense.category || '');
      setDate(expense.date ? format(parseISO(expense.date), 'yyyy-MM-dd') : '');
      setFormError(null);
      clearExpenseError();
    }
  }, [expense, isOpen, clearExpenseError]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!expense) return;
    setFormError(null);
    clearExpenseError();

    if (!description.trim()) {
      setFormError('Description is required.');
      return;
    }
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setFormError('Please enter a valid positive amount.');
      return;
    }
    if (!category) {
      setFormError('Please select a category.');
      return;
    }
    if (!date) {
        setFormError('Please select a date.');
        return;
    }

    setIsSubmitting(true);
    const success = await updateExpense(expense.id, {
      description,
      amount: numericAmount,
      category,
      date,
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

  if (!isOpen || !expense) return null; 

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
            <h2 className="text-2xl font-semibold mb-6 text-text-primary">Edit Expense</h2>

            {formError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                {formError}
              </div>
            )}
             {!formError && expenseStoreError && (
                 <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                 {expenseStoreError}
               </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Description"
                id="edit-expense-description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                icon={<Type size={16} className="text-gray-400" />}
                disabled={isSubmitting}
              />
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Amount"
                  id="edit-expense-amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  step="0.01"
                  icon={<DollarSign size={16} className="text-gray-400" />}
                  disabled={isSubmitting}
                />
                <div>
                  <label htmlFor="edit-expense-category" className="block text-sm font-medium text-text-primary mb-1">
                    Category
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Tag size={16} className="text-gray-400" />
                    </div>
                    <select
                      id="edit-expense-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ExpenseCategory | '')}
                      required
                      className="form-select block w-full pl-10 pr-3 py-2 border rounded-md bg-card-background text-text-primary border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent shadow-sm"
                      disabled={isSubmitting}
                    >
                      <option value="" disabled>Select a category</option>
                      {expenseCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <Input
                  label="Date"
                  id="edit-expense-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  icon={<CalendarDays size={16} className="text-gray-400" />}
                  disabled={isSubmitting}
                />
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

export default EditExpenseModal;