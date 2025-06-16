import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MainLayout from './components/layout/MainLayout';
import { useThemeStore } from './store/themeStore';
import { useAuthStore } from './store/authStore'; 
import ProtectedRoute from './features/auth/components/ProtectedRoute';

import HomePage from './pages/HomePage';
import TaskManagerPage from './features/taskManager/pages/TaskManagerPage';
import ExpenseTrackerPage from './features/expenseTracker/pages/ExpenseTrackerPage';
import HabitTrackerPage from './features/habitTracker/pages/HabitTrackerPage';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage'; 
import ProfilePage from './pages/ProfilePage';

const AppWithThemeAndAuth: React.FC = () => {
  const { theme, setTheme } = useThemeStore();
  
  const { fetchCurrentUser } = useAuthStore(); 
  const location = useLocation();

  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  useEffect(() => {
    if (useAuthStore.getState().token) {
              fetchCurrentUser(); 
            }
          }, [fetchCurrentUser]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/tasks" element={<TaskManagerPage />} />
            <Route path="/expenses" element={<ExpenseTrackerPage />} />
            <Route path="/habits" element={<HabitTrackerPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} /> 
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppWithThemeAndAuth />
    </BrowserRouter>
  );
}

export default App;