import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../../../config/animationVariants';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useAuthStore } from '../../../store/authStore';
import { Mail, AlertCircle, CheckCircle, KeyRound } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');

  //initial test before modifying store
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleRequestReset = async (emailToReset: string) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    console.log("Requesting password reset for:", emailToReset);

    await new Promise(resolve => setTimeout(resolve, 1500)); 

    if (!emailToReset.trim() || !/\S+@\S+\.\S+/.test(emailToReset)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }
    if (emailToReset === "error@mail.com") { 
      setError("Failed to send reset link. Please try again later.");
    } else {
      setSuccessMessage("Sent to email, a password reset link has been sent.");
      setEmail(''); 
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleRequestReset(email);
  };

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
          <KeyRound className="mx-auto h-12 w-auto text-primary-accent" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-text-primary">
            Forgot Your Password?
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md text-sm flex items-center space-x-2">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
          {successMessage && (
            <div className="p-3 bg-green-100 dark:bg-green-900/50 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 rounded-md text-sm flex items-center space-x-2">
              <CheckCircle size={18} />
              <span>{successMessage}</span>
            </div>
          )}

          {!successMessage && (
            <>
              <Input
                label="Email address"
                id="email-forgot"
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
              <div>
                <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
                  {isLoading ? 'Sending Link...' : 'Send Password Reset Link'}
                </Button>
              </div>
            </>
          )}
        </form>

        <div className="text-sm text-center">
          <Link to="/login" className="font-medium text-primary-accent hover:text-secondary-accent hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordPage;
