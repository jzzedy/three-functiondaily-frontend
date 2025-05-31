import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../config/animationVariants'; 
import { Link } from 'react-router-dom'; 
import { useAuthStore } from '../store/authStore'; 
import { getAiSuggestionFromBackend } from '../services/aiFrontendService'; 
import type { AiSuggestionResponse } from '../services/aiFrontendService'; 
import { Sparkles, Loader2 } from 'lucide-react'; 

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [aiWelcomeMessage, setAiWelcomeMessage] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated && user) { 
      setIsAiLoading(true);
      getAiSuggestionFromBackend({ suggestionType: 'general_greeting' })
        .then((response: AiSuggestionResponse) => {
          
          let messageText = response.text;
          if (response.suggestionCategory === 'general_greeting' && user.username) {
             
            if (messageText.toLowerCase().startsWith('hello') || messageText.toLowerCase().startsWith('hi')) {
                messageText = `Hello ${user.username}! ${messageText.substring(messageText.indexOf("!") + 1).trimStart()}`;
            } else {
                 messageText = `${user.username}, ${messageText.charAt(0).toLowerCase() + messageText.slice(1)}`;
            }
          }
          setAiWelcomeMessage(messageText);
        })
        .catch(error => {
          console.error("Error fetching AI welcome message:", error);
          setAiWelcomeMessage("Hope you have a productive day!"); 
        })
        .finally(() => {
          setIsAiLoading(false);
        });
    } else {
        setAiWelcomeMessage(null); 
    }
  }, [isAuthenticated, user]); 

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-200px)] px-4" 
    >
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-primary-accent font-poppins">
        Welcome to ThreeFunctionDaily!
      </h1>
      <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-8">
        Your all-in-one solution to master your tasks, keep an eye on your expenses, and build lasting habits for a more productive and organized life.
      </p>

      {}
      {isAuthenticated && isAiLoading && (
        <div className="my-6 flex items-center justify-center text-text-secondary">
          <Loader2 className="animate-spin h-5 w-5 mr-2" />
          <span>AI is preparing a greeting...</span>
        </div>
      )}
      {isAuthenticated && !isAiLoading && aiWelcomeMessage && (
        <motion.div 
          initial={{ opacity: 0, y:10 }}
          animate={{ opacity:1, y:0 }}
          className="my-6 p-4 bg-card-background/50 dark:bg-dark-card/50 rounded-lg shadow-md max-w-xl"
        >
          <div className="flex items-center text-primary-accent mb-2">
            <Sparkles size={20} className="mr-2" />
            <h3 className="font-semibold">A Quick Thought For You:</h3>
          </div>
          <p className="text-text-secondary italic">"{aiWelcomeMessage}"</p>
        </motion.div>
      )}

      {isAuthenticated ? (
        <div className="space-x-4 mt-8">
            <Link
                to="/tasks"
                className="bg-primary-accent text-white hover:bg-opacity-90 font-medium py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
                Go to My Dashboard
            </Link>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row mt-8">
            <Link
                to="/register"
                className="bg-primary-accent text-white hover:bg-opacity-90 font-medium py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
                Get Started - Sign Up
            </Link>
            <Link
                to="/login"
                className="bg-slate-200 text-slate-700 hover:bg-slate-300 font-medium py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
                Already have an account? Login
            </Link>
        </div>
      )}

      <p className="mt-12 text-sm text-text-secondary">
        We keep track of everything for you!
      </p>
      <p className="mt-12 text-sm text-text-secondary">
        App made by Zed, what a thoughtful developer he is, right?
      </p>
    </motion.div>
  );
};
export default HomePage;