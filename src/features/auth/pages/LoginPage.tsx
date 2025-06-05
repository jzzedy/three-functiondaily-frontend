import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react'; 
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import { pageVariants, pageTransition } from '../../../config/animationVariants'; 
import { Mail, Lock, AlertCircle } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useAuthStore } from '../../../store/authStore';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, isAuthenticated, clearAuthError } = useAuthStore(); 
  const from = location.state?.from?.pathname || "/";

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearAuthError(); 
    const success = await login(email, password);
    if (success) {
      navigate(from, { replace: true });
    }
  };
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  return (
    <motion.div 
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full space-y-8 p-8 sm:p-10 bg-card-background shadow-2xl rounded-xl">
        <div className="text-center">
          {}
          {}
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-text-primary">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md text-sm flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle size={18} className="mr-2"/>
                <span>{error}</span>
              </div>
              <button 
                type="button" 
                onClick={clearAuthError} 
                className="ml-2 text-sm font-semibold hover:underline focus:outline-none" 
                aria-label="Dismiss error"
              >
                &times;
              </button>
            </div>
          )}
          <Input
            label="Email address"
            id="email-login" 
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="your@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={16} className="text-gray-400" />}
            disabled={isLoading}
          />
          <Input
            label="Password"
            id="password-login"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={16} className="text-gray-400" />}
            disabled={isLoading}
          />
          <div className="flex items-center justify-end text-sm"> 
            {}
            <Link to="/forgot-password" className="font-medium text-primary-accent hover:text-secondary-accent hover:underline">
              Forgot your password?
            </Link>
          </div>
          <div>
            <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-text-secondary">
          Not a member?{' '}
          <Link to="/register" className="font-medium text-primary-accent hover:text-secondary-accent hover:underline">
            Sign up now
          </Link>
        </p>
      </div>
    </motion.div>
  );
};
export default LoginPage;
