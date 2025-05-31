
import React from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react'; 

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode; 
}

const Input: React.FC<InputProps> = ({ label, id, error, icon, className, ...props }) => {
  return (
    <div className="mb-4 w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text-primary mb-1">
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
               <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{icon}</span>
            </div>
        )}
        <input
          id={id}
          className={`
            form-input block w-full px-3 py-2 border rounded-md
            bg-card-background text-text-primary border-gray-300 dark:border-gray-600
            focus:outline-none focus:ring-2
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'focus:ring-primary-accent focus:border-primary-accent'}
            ${className || ''}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;