import React, { useState } from 'react';
import type { FormEvent } from 'react'; 
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import { pageVariants, pageTransition } from '../../../config/animationVariants'; 
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useAuthStore } from '../../../store/authStore';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isLoading, error: authError, isAuthenticated, clearError } = useAuthStore(); 
  const from = location.state?.from?.pathname || "/";

  const validateForm = (): boolean => {
    if (!email || !password || !confirmPassword) {
        setFormError("All fields except username are required.");
        return false;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return false;
    }
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        setFormError("Please enter a valid email address.");
        return false;
    }
    setFormError(null);
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError(); 
    if (!validateForm()) return;
    await register(email, password, username);
 
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  React.useEffect(() => {
    if (authError === null) { 
        setFormError(null); 
    } else if (authError) {
        setFormError(null); 
    }
  }, [authError]);

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
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {}
          {(formError || authError) && (
            <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md text-sm flex justify-between items-center">
              <span>{formError || authError}</span>
              <button type="button" onClick={() => { setFormError(null); clearError();}} className="ml-2 text-sm font-semibold hover:underline" aria-label="Dismiss error">&times;</button>
            </div>
          )}
          <Input
            label="Username (Optional)" id="username" name="username" type="text"
            autoComplete="username" placeholder="Your Name" value={username}
            onChange={(e) => setUsername(e.target.value)} icon={<UserIcon size={16} className="text-gray-400" />}
            disabled={isLoading}
          />
          <Input
            label="Email address" id="email-register" name="email" type="email"
            autoComplete="email" required placeholder="you@example.com" value={email}
            onChange={(e) => setEmail(e.target.value)} icon={<Mail size={16} className="text-gray-400" />}
            disabled={isLoading}
          />
          <Input
            label="Password" id="password-register" name="password" type="password"
            required placeholder="Minimum 8 characters" value={password}
            onChange={(e) => setPassword(e.target.value)} icon={<Lock size={16} className="text-gray-400" />}
            disabled={isLoading}
          />
          <Input
            label="Confirm Password" id="confirm-password" name="confirmPassword" type="password"
            required placeholder="Re-enter password" value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} icon={<Lock size={16} className="text-gray-400" />}
            disabled={isLoading}
          />
          <div>
            <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign up'}
            </Button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-text-primary">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-accent hover:text-secondary-accent">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
};
export default RegisterPage;
