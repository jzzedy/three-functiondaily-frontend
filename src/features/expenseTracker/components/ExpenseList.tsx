import React, { useState } from 'react';
import { useExpenseStore } from '../../../store/expenseStore'; 
import ExpenseItem from './ExpenseItem'; 
import type { Expense } from '../types'; 
import { AnimatePresence } from 'framer-motion';
import EditExpenseModal from './EditExpenseModal'; 
import { Wallet } from 'lucide-react'; 

const ExpenseList: React.FC = () => {
  const { expenses, preferredCurrency } = useExpenseStore(); //selecting currency
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleCloseEditModal = () => {
    setEditingExpense(null);
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 mt-12 py-8">
        <Wallet size={48} className="mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-semibold mb-2">No Expenses Logged</h3>
        <p className="text-sm">Start tracking your spending by adding your first expense above.</p>
      </div>
    );
  }

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const locale = preferredCurrency === 'PHP' ? 'en-PH' : 'en-US';
  const formattedTotalAmount = new Intl.NumberFormat(locale, { 
    style: 'currency',
    currency: preferredCurrency, 
  }).format(totalAmount);


  return (
    <div className="space-y-4 mt-8">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-text-primary">
            Your Expenses
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">({expenses.length})</span>
        </h2>
        <div className="text-lg font-semibold text-primary-accent">
            Total: {formattedTotalAmount}
        </div>
      </div>
      <AnimatePresence>
        {expenses.map((expense) => (
          <ExpenseItem key={expense.id} expense={expense} onEdit={handleEditExpense} />
        ))}
      </AnimatePresence>

      <EditExpenseModal
        expense={editingExpense}
        isOpen={!!editingExpense}
        onClose={handleCloseEditModal}
      />
    </div>
  );
};

export default ExpenseList;