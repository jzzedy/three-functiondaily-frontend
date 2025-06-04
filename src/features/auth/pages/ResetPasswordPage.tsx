import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../../../config/animationVariants';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useAuthStore } from '../../../store/authStore';
import { Lock, AlertCircle, CheckCircle, KeyRound } from 'lucide-react';

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>(); 
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

   //testing phase first
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset link.");
    }
  }, [token]);

  const handleResetPasswordAction = async (resetToken: string, pass: string) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    console.log("Resetting password with token:", resetToken, "and new password:", pass);

    await new Promise(resolve => setTimeout(resolve, 1500));

    if (resetToken === "invalidtoken") {
      setError("Invalid or expired token. Please request a new link.");
    } else {
      setSuccessMessage("Your password has been reset successfully! You can now log in with your new password.");
      setTimeout(() => navigate('/login'), 3000);
    }
    setIsLoading(false);
  };
   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      setError("No reset token found. Cannot proceed.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    await handleResetPasswordAction(token, newPassword);
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
            Reset Your Password
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Enter your new password below.
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
                label="New Password"
                id="new-password"
                name="newPassword"
                type="password"
                required
                placeholder="Minimum 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                icon={<Lock size={16} className="text-gray-400" />}
                disabled={isLoading || !token}
              />
              <Input
                label="Confirm New Password"
                id="confirm-new-password"
                name="confirmNewPassword"
                type="password"
                required
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock size={16} className="text-gray-400" />}
                disabled={isLoading || !token}
              />
              <div>
                <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading || !token}>
                  {isLoading ? 'Resetting Password...' : 'Reset Password'}
                </Button>
              </div>
            </>
          )}
           {successMessage && (
             <div className="mt-6 text-center">
                <Link to="/login" className="font-medium text-primary-accent hover:text-secondary-accent hover:underline">
                    Proceed to Login
                </Link>
             </div>
           )}
        </form>
         {!successMessage && (
            <div className="text-sm text-center">
                <Link to="/login" className="font-medium text-text-secondary hover:text-primary-accent hover:underline">
                    Back to Login
                </Link>
            </div>
         )}
      </div>
    </motion.div>
  );
};

export default ResetPasswordPage;