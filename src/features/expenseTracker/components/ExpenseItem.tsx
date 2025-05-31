import React, { useState } from 'react';
import type { Expense, ExpenseCategory } from '../types'; 
import { categoryColors } from '../types'; 
import { useExpenseStore } from '../../../store/expenseStore';   
import Button from '../../../components/ui/Button';               
import { Edit3, Trash2, CalendarDays, Tag, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void; 
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onEdit }) => {
  const { deleteExpense, clearExpenseError, preferredCurrency } = useExpenseStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete expense: "${expense.description}"?`)) {
        setIsDeleting(true);
        clearExpenseError(); 
        await deleteExpense(expense.id);
        setIsDeleting(false);
    }
  };

  const locale = preferredCurrency === 'PHP' ? 'en-PH' : 'en-US';
  const formattedAmount = new Intl.NumberFormat(locale, { 
    style: 'currency',
    currency: preferredCurrency, 
  }).format(expense.amount);

  const itemCategory = expense.category as ExpenseCategory; 
  const colorForCategory = expense.category ? categoryColors[itemCategory] : categoryColors.Other;

  const currencySymbol = preferredCurrency === 'PHP' ? '₱' : '$';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
      className="p-4 bg-card-background shadow-md rounded-lg border-l-4"
      style={{ borderLeftColor: colorForCategory }} 
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center mb-1">
            <span className="mr-2 text-lg font-semibold text-primary-accent">{currencySymbol}</span>
            <h3 className="text-lg font-semibold text-text-primary break-words">
              {expense.description}
            </h3>
          </div>

          <p className="text-xl font-bold ml-7" style={{ color: colorForCategory }}>
            {formattedAmount} 
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400 ml-7 mt-2">
            {expense.category && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium flex items-center"
                style={{ backgroundColor: `${colorForCategory}20`, color: colorForCategory }}
              >
                <Tag size={12} className="mr-1" />
                {expense.category}
              </span>
            )}
            <span className="flex items-center">
              <CalendarDays size={12} className="mr-1" />
              {}
              {expense.date ? format(parseISO(expense.date), 'MMM d, yyyy') : 'N/A'}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 ml-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(expense)}
            icon={<Edit3 size={14} />}
            className="border-gray-300 dark:border-gray-600 hover:bg-yellow-500 hover:text-white hover:border-yellow-500"
            aria-label="Edit expense"
            disabled={isDeleting}
          >
            <span className="hidden sm:inline ml-1">Edit</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            icon={isDeleting ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
            className="border-gray-300 dark:border-gray-600 hover:bg-red-500 hover:text-white hover:border-red-500"
            aria-label="Delete expense"
            disabled={isDeleting}
          >
             <span className="hidden sm:inline ml-1">{isDeleting ? 'Deleting...' : 'Delete'}</span>
          </Button>
        </div>
      </div>
       <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-right">
        Logged: {expense.createdAt ? format(parseISO(expense.createdAt), "MMM d, HH:mm") : 'N/A'}
      </p>
    </motion.div>
  );
};

export default ExpenseItem;
