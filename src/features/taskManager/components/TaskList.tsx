import React, { useState } from 'react';
import { useTaskStore } from '../../../store/taskStore'; 
import TaskItem from './TaskItem'; 
import type { Task, TaskCategory } from '../types'; 
import { AnimatePresence } from 'framer-motion';
import EditTaskModal from './EditTaskModal';
import CategoryFilter from './CategoryFilter';
import { ClipboardList } from 'lucide-react'; 

const TaskList: React.FC = () => {
  const allTasks = useTaskStore((state) => state.tasks);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'All'>('All');

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleCloseEditModal = () => {
    setEditingTask(null);
  };

  const filteredTasks = selectedCategory === 'All'
    ? allTasks
    : allTasks.filter(task => task.category === selectedCategory);

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="mt-8">
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {sortedTasks.length === 0 ? (
         <div className="text-center text-gray-500 dark:text-gray-400 mt-12 py-8">
            <ClipboardList size={48} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">
              {selectedCategory === 'All' ? 'No Tasks Yet!' : `No Tasks in "${selectedCategory}"`}
            </h3>
            <p className="text-sm">
              {selectedCategory === 'All'
                ? "Looks like your task list is clear. Add a new task above to get started."
                : `Try a different category or add a new task to "${selectedCategory}".`}
            </p>
          </div>
      ) : (
        <>
          <h2 className="text-2xl font-semibold my-4 text-text-primary border-b pb-2 border-gray-200 dark:border-gray-700">
            {selectedCategory === 'All' ? 'All Tasks' : `${selectedCategory} Tasks`}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">({sortedTasks.length})</span>
          </h2>
          <div className="space-y-4">
            <AnimatePresence>
              {sortedTasks.map((task) => (
                <TaskItem key={task.id} task={task} onEdit={handleEditTask} />
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      <EditTaskModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={handleCloseEditModal}
      />
    </div>
  );
};

export default TaskList;