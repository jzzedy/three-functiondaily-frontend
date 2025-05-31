import React from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react'; 
import { motion } from 'framer-motion'; 
import { Loader2 } from 'lucide-react'; 

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className,
  type = 'button', 
  onClick,
  disabled, 
  ...rest 
}) => {
  const baseStyles = "font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 ease-in-out flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed";

  const variantStyles = {
    primary: "bg-primary-accent text-white hover:bg-opacity-90 focus:ring-primary-accent",
    secondary: "bg-secondary-accent text-white hover:bg-opacity-90 focus:ring-secondary-accent",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline: "bg-transparent border border-primary-accent text-primary-accent hover:bg-primary-accent hover:text-white focus:ring-primary-accent",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <motion.button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`}
      disabled={isLoading || disabled}
      onClick={onClick} // Pass onClick explicitly
      whileHover={{ scale: (isLoading || disabled) ? 1 : 1.03 }}
      whileTap={{ scale: (isLoading || disabled) ? 1 : 0.98 }}
      aria-label={rest['aria-label']} 
    >
      {isLoading ? (
        <Loader2 className="animate-spin h-5 w-5 mr-2" />
      ) : (
        icon && <span className="mr-2">{icon}</span>
      )}
      {children}
    </motion.button>
  );
};

export default Button;