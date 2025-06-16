import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { Moon, Sun, LogOut, User as UserIcon } from "lucide-react";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import AppLogo from "../../assets/logo.svg";
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "bg-primary-accent text-white"
        : "text-text-primary hover:bg-gray-200 dark:hover:bg-gray-700"
    }`;

  return (
    <nav className="bg-card-background shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <img
                src={AppLogo}
                alt="ThreeFunctionDaily Logo"
                className="h-8 w-auto"
              />
              <span className="hidden sm:inline font-bold text-lg text-text-primary font-poppins">
                ThreeFunctionDaily
              </span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {isAuthenticated && (
                  <>
                    <NavLink to="/tasks" className={navLinkClass}>
                      Tasks
                    </NavLink>
                    <NavLink to="/expenses" className={navLinkClass}>
                      Expenses
                    </NavLink>
                    <NavLink to="/habits" className={navLinkClass}>
                      Habits
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-400 hover:text-text-primary hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-accent"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {isAuthenticated ? (
              <div className="ml-3 relative" ref={dropdownRef}>
                <div>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="max-w-xs bg-card-background rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-accent"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-primary-accent flex items-center justify-center text-white font-bold">
                      {user?.username ? (
                        user.username.charAt(0).toUpperCase()
                      ) : (
                        <UserIcon size={18} />
                      )}
                    </div>
                  </button>
                </div>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        scale: 0.95,
                        y: -10,
                        transition: { duration: 0.1 },
                      }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-card-background ring-1 ring-black ring-opacity-5 focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                    >
                      <div className="px-4 py-2 text-sm text-text-secondary border-b border-gray-200 dark:border-gray-700">
                        <p className="font-semibold">Signed in as</p>
                        <p className="truncate">
                          {user?.username || user?.email}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        <UserIcon size={16} className="mr-2" />
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-white bg-primary-accent hover:bg-opacity-90"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
