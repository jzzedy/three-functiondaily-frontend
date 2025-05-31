import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { useExpenseStore } from '../../../store/expenseStore'; 
import Button from '../../../components/ui/Button';         
import Input from '../../../components/ui/Input';           
import { expenseCategories } from '../types'; 
import type { ExpenseCategory } from '../types'; 
import { PlusCircle, CalendarDays, Tag, Type } from 'lucide-react';
import { format } from 'date-fns'; 

const AddExpenseForm: React.FC = () => {
  const { addExpense, clearExpenseError, preferredCurrency } = useExpenseStore(); 

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory | ''>(expenseCategories[0]);
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    const newExpense = await addExpense({
      description,
      amount: numericAmount,
      category,
      date,
    });
    setIsSubmitting(false);

    if (newExpense) {
      setDescription('');
      setAmount('');
      setCategory(expenseCategories[0]);
      setDate(format(new Date(), 'yyyy-MM-dd'));
    } 
  };

  const amountPlaceholder = preferredCurrency === 'PHP' ? '₱0.00' : '$0.00';
  const currencyIconElement = (
    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
      {preferredCurrency === 'PHP' ? '₱' : '$'}
    </span>
  );

  return (
    <form onSubmit={handleSubmit} className="my-6 p-6 bg-card-background shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-6 text-text-primary flex items-center">
        <PlusCircle size={24} className="mr-2 text-primary-accent" />
        Add New Expense
      </h2>

      {formError && ( 
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
          {formError}
        </div>
      )}

      <Input
        label="Description"
        id="expense-description"
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="e.g., Lunch meeting"
        required
        className="mb-4"
        icon={<Type size={16} className="text-gray-400" />}
        disabled={isSubmitting}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Input
          label={`Amount`} 
          id="expense-amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={amountPlaceholder} 
          required
          step="0.01"
          icon={currencyIconElement} 
          disabled={isSubmitting}
        />
        <div>
          <label htmlFor="expense-category" className="block text-sm font-medium text-text-primary mb-1">
            Category
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
              <Tag size={16} className="text-gray-400" />
            </div>
            <select
              id="expense-category"
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
          id="expense-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          icon={<CalendarDays size={16} className="text-gray-400" />}
          disabled={isSubmitting}
        />
      </div>

      <Button type="submit" className="w-full sm:w-auto" icon={<PlusCircle size={18} />} isLoading={isSubmitting} disabled={isSubmitting}>
        {isSubmitting ? 'Adding Expense...' : 'Add Expense'}
      </Button>
    </form>
  );
};

export default AddExpenseForm;