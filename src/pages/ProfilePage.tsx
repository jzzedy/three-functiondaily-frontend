import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../config/animationVariants';
import { useAuthStore } from '../store/authStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { User, Lock, Mail, Save, AlertCircle, CheckCircle } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, changePassword, isPasswordActionLoading, passwordActionError, passwordActionSuccessMessage, clearPasswordActionMessages } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      clearPasswordActionMessages();
    };
  }, [clearPasswordActionMessages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    clearPasswordActionMessages();

    if (newPassword.length < 8) {
      setFormError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setFormError("New passwords do not match.");
      return;
    }

    const success = await changePassword(currentPassword, newPassword);
    if (success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="max-w-4xl mx-auto"
    >
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary-accent font-poppins">My Profile</h1>
        <p className="text-text-secondary mt-1">Manage your account details.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {}
        <div className="md:col-span-1">
          <div className="p-6 bg-card-background rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Account Information</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <User size={18} className="text-text-secondary mr-3" />
                <span className="text-sm text-text-primary">{user?.username || 'No username set'}</span>
              </div>
              <div className="flex items-center">
                <Mail size={18} className="text-text-secondary mr-3" />
                <span className="text-sm text-text-primary">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="p-6 bg-card-background rounded-lg shadow-md space-y-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Change Password</h3>
            {formError && (
              <div className="p-3 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md text-sm flex items-center space-x-2">
                <AlertCircle size={18} />
                <span>{formError}</span>
              </div>
            )}
            {passwordActionError && (
              <div className="p-3 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md text-sm flex items-center space-x-2">
                <AlertCircle size={18} />
                <span>{passwordActionError}</span>
              </div>
            )}
            {passwordActionSuccessMessage && (
              <div className="p-3 bg-green-100 dark:bg-green-900/50 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 rounded-md text-sm flex items-center space-x-2">
                <CheckCircle size={18} />
                <span>{passwordActionSuccessMessage}</span>
              </div>
            )}
            <Input
              label="Current Password"
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              icon={<Lock size={16} className="text-gray-400" />}
              disabled={isPasswordActionLoading}
            />
            <Input
              label="New Password"
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Minimum 8 characters"
              icon={<Lock size={16} className="text-gray-400" />}
              disabled={isPasswordActionLoading}
            />
            <Input
              label="Confirm New Password"
              id="confirmNewPassword"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              icon={<Lock size={16} className="text-gray-400" />}
              disabled={isPasswordActionLoading}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={isPasswordActionLoading}
                disabled={isPasswordActionLoading}
                icon={<Save size={18} />}
              >
                {isPasswordActionLoading ? 'Saving...' : 'Save New Password'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;