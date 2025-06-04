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