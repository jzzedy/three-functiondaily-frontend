import React from 'react';
import { taskCategories } from '../types'; 
import type { TaskCategory } from '../types'; 
import { ListFilter } from 'lucide-react'; 

interface CategoryFilterProps {
  selectedCategory: TaskCategory | 'All';
  onSelectCategory: (category: TaskCategory | 'All') => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onSelectCategory }) => {
  const allFilterCategories: (TaskCategory | 'All')[] = ['All', ...taskCategories];

  return (
    <div className="my-4 p-4 bg-card-background shadow rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-md font-semibold mb-3 text-text-primary flex items-center">
        <ListFilter size={20} className="mr-2 text-primary-accent" />
        Filter by Category
      </h3>
      <div className="flex flex-wrap gap-2">
        {allFilterCategories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`
              px-3 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-150 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-accent
              ${
                selectedCategory === category
                  ? 'bg-primary-accent text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-700 text-text-primary hover:bg-slate-200 dark:hover:bg-slate-600'
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;