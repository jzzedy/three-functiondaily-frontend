import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, LogOut, UserCircle } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';
import AppLogo from '../../assets/logo.svg'; 

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-card-background shadow-md text-text-primary sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-primary-accent hover:text-secondary-accent transition-colors">
          <img src={AppLogo} alt="ThreeFunctionDaily Logo" className="h-8 w-auto" /> {}
          <span className="hidden sm:inline">ThreeFunctionDaily</span>
        </Link>
        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <>
              <Link to="/tasks" className="hover:text-primary-accent transition-colors text-sm sm:text-base">Tasks</Link>
              <Link to="/expenses" className="hover:text-primary-accent transition-colors text-sm sm:text-base">Expenses</Link>
              <Link to="/habits" className="hover:text-primary-accent transition-colors text-sm sm:text-base">Habits</Link>
            </>
          )}
        </div>
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-background focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-accent dark:focus:ring-offset-dark-background"
            aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          {isAuthenticated ? (
            <div className="flex items-center space-x-2 sm:space-x-3">
              {user?.email && (
                <span className="text-xs sm:text-sm hidden md:inline">
                  {user.username || user.email}
                </span>
              )}
               <UserCircle size={24} className="text-text-primary hidden sm:inline" />
              <Button onClick={handleLogout} variant="outline" size="sm" icon={<LogOut size={16}/>}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link to="/login" className="text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2 rounded-md hover:text-primary-accent hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">Login</Link>
              <Link
                to="/register"
                className="text-sm sm:text-base bg-primary-accent text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md hover:bg-opacity-90 transition-colors shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;