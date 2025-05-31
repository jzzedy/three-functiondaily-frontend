import React, { useState } from 'react';
import type { FormEvent } from 'react'; 
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import { pageVariants, pageTransition } from '../../../config/animationVariants'; 
import { Mail, Lock } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useAuthStore } from '../../../store/authStore';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore(); 
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    await login(email, password);
  };

  React.useEffect(() => {
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
      <div className="max-w-md w-full space-y-8 p-8 bg-card-background shadow-xl rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md text-sm flex justify-between items-center">
              <span>{error}</span>
              <button type="button" onClick={clearError} className="ml-2 text-sm font-semibold hover:underline" aria-label="Dismiss error">&times;</button>
            </div>
          )}
          <Input
            label="Email address"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={16} className="text-gray-400" />}
            disabled={isLoading}
          />
          <Input
            label="Password"
            id="password"
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
          <div className="flex items-center justify-between text-sm">
            {}
            <a href="#" className="font-medium text-primary-accent hover:text-secondary-accent">
              Forgot your password?
            </a>
          </div>
          <div>
            <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-text-primary">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary-accent hover:text-secondary-accent">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};
export default LoginPage;
