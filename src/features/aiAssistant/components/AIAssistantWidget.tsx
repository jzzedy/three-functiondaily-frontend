import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Zap, Lightbulb, Smile, RefreshCw, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore'; 
import { useAiNotificationStore } from '../../../store/aiNotificationStore'; 
import Button from '../../../components/ui/Button'; 
import type { SuggestionType, AiSuggestionResponse } from '../../../services/aiFrontendService'; 
import { getAiSuggestionFromBackend } from '../../../services/aiFrontendService'; 

const AiAvatar: React.FC<{ className?: string }> = ({ className }) => ( 
  <svg viewBox="0 0 40 40" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" className="text-primary-accent" />
    <circle cx="13" cy="16" r="3.5" fill="white" />
    <circle cx="27" cy="16" r="3.5" fill="white" />
    <circle cx="13" cy="16" r="1.5" className="text-primary-accent" />
    <circle cx="27" cy="16" r="1.5" className="text-primary-accent" />
    <path d="M12 25 Q20 29 28 25" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
);

interface DisplayMessage {
    type: SuggestionType | 'greeting' | 'tip' | 'motivation' | 'summary_prompt' | 'insight' | 'error' | 'loading' | 'info';
    text: string;
    icon?: React.ReactNode;
    suggestionCategory?: SuggestionType; 
}

const predefinedWelcomeMessages: DisplayMessage[] = [
    { type: 'greeting', text: "Hello! I'm here to help. Click refresh for a tip!", icon: <Smile size={18} className="text-green-400"/>, suggestionCategory: 'general_greeting' },
    { type: 'info', text: "Need a fresh idea? Hit the refresh button!", icon: <Lightbulb size={18} className="text-blue-400"/> }
];

const getInitialWelcomeMessage = (username?: string | null): DisplayMessage => {
    const randomWelcomeIndex = Math.floor(Math.random() * predefinedWelcomeMessages.length);
    const welcomeMsg = { ...predefinedWelcomeMessages[randomWelcomeIndex] }; 

    if (welcomeMsg.text.includes("Hello!") && username) {
        welcomeMsg.text = `Hello ${username}! ${welcomeMsg.text.substring(welcomeMsg.text.indexOf("!")+1)}`;
    } else if (!username && welcomeMsg.type === 'greeting') {
         welcomeMsg.text = "Hello! How can I assist you today?";
    }
    return welcomeMsg;
};

const refreshableSuggestionTypes: SuggestionType[] = [
    'task_tip', 'expense_insight', 'habit_motivation', 'daily_summary_prompt', 'general_greeting'
];

const AIAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const [currentMessage, setCurrentMessage] = useState<DisplayMessage>(() => getInitialWelcomeMessage(user?.username));
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const { lastEvent, clearLastEvent } = useAiNotificationStore();

  const fetchNewSuggestion = useCallback(async (requestedType: SuggestionType) => {
    if (!isAuthenticated) return; 
    setIsLoadingAi(true);
    setCurrentMessage({ 
        type: 'loading', 
        text: 'Thinking...', 
        icon: <Loader2 size={18} className="animate-spin text-primary-accent" />, 
        suggestionCategory: requestedType 
    });
    try {
      const response: AiSuggestionResponse = await getAiSuggestionFromBackend({ 
        suggestionType: requestedType, 
      });

      let icon : React.ReactNode = <AiAvatar className="w-5 h-5 inline-block" />;
      if (response.suggestionCategory === 'task_tip') icon = <Lightbulb size={18} className="text-blue-400" />;
      else if (response.suggestionCategory === 'habit_motivation') icon = <Smile size={18} className="text-green-400" />;
      else if (response.suggestionCategory === 'expense_insight') icon = <Zap size={18} className="text-yellow-400" />;
      else if (response.suggestionCategory === 'daily_summary_prompt') icon = <MessageSquare size={18} className="text-purple-400" />;

      setCurrentMessage({
        type: response.suggestionCategory,
        text: response.text,
        icon: icon,
        suggestionCategory: response.suggestionCategory
      });
    } catch (error: unknown) { 
      console.error("Error fetching AI suggestion:", error);
      let errorMessage = "Sorry, I couldn't fetch a suggestion right now.";
      if (typeof error === "object" && error !== null && "response" in error) {
        const responseError = error.response as { data?: { message?: string } };
        if (responseError.data?.message) { errorMessage = responseError.data.message; }
      } else if (error instanceof Error) { errorMessage = error.message; }
      setCurrentMessage({ type: 'error', text: errorMessage, icon: <X size={18} className="text-red-500" /> });
    } finally {
      setIsLoadingAi(false);
    }
  }, [isAuthenticated]); 

  useEffect(() => {
    if (lastEvent && isAuthenticated) {
      if (!isOpen) setIsOpen(true); 
      fetchNewSuggestion(lastEvent.type); 
      clearLastEvent(); 
    }
  }, [lastEvent, isAuthenticated, fetchNewSuggestion, clearLastEvent, isOpen]);

   useEffect(() => {
    if (!isAuthenticated) {
        setIsOpen(false); 
        setCurrentMessage(getInitialWelcomeMessage(null)); 
        return;
    }
    
    if (isOpen && !isLoadingAi && currentMessage.type !== 'error' && !lastEvent) {
        const welcomeMsg = getInitialWelcomeMessage(user?.username);
        if (currentMessage.suggestionCategory === 'general_greeting' || currentMessage.type === 'info') {
            if(currentMessage.text !== welcomeMsg.text) {
                 setCurrentMessage(welcomeMsg);
            }
        }
    }
  },[isOpen, isAuthenticated, user?.username, isLoadingAi, currentMessage.type, currentMessage.text, currentMessage.suggestionCategory, lastEvent]);


  const toggleOpen = () => {
    const newIsOpenState = !isOpen;
    setIsOpen(newIsOpenState);
    if (newIsOpenState && !isLoadingAi && !lastEvent && (currentMessage.type === 'error' || !currentMessage.suggestionCategory || currentMessage.suggestionCategory === 'general_greeting')) {
        setCurrentMessage(getInitialWelcomeMessage(user?.username));
    }
  };

  const handleRefresh = () => {
    if (isLoadingAi) return; 
    const randomType = refreshableSuggestionTypes[Math.floor(Math.random() * refreshableSuggestionTypes.length)];
    fetchNewSuggestion(randomType);
  };

  const fabVariants = {
    closed: { scale: 1, rotate: 0 },
    open: { scale: 1.1, rotate: 15 },
  };
  const messageBoxVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <motion.button
        variants={fabVariants} animate={isOpen ? "open" : "closed"}
        whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 bg-primary-accent text-white p-4 rounded-full shadow-xl z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-accent dark:focus:ring-offset-dark-background"
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={messageBoxVariants} initial="hidden" animate="visible" exit="exit"
            className="fixed bottom-24 right-6 w-72 sm:w-80 bg-card-background text-text-primary p-4 rounded-lg shadow-2xl z-40 border border-gray-200 dark:border-gray-700 flex flex-col"
          >
            <div className="flex items-start mb-2">
                <span className="mr-2 shrink-0 mt-0.5">{currentMessage.icon || <AiAvatar className="w-6 h-6" />}</span>
                <p className="text-sm font-semibold flex-grow">
                    {currentMessage.type === 'loading' ? 'AI Assistant is thinking...' : 
                     currentMessage.type === 'error' ? 'Oh no!' :
                     currentMessage.suggestionCategory === 'general_greeting' ? `Hi ${user?.username || 'Explorer'}!` :
                     currentMessage.suggestionCategory === 'task_tip' ? 'Task Tip:' :
                     currentMessage.suggestionCategory === 'expense_insight' ? 'Expense Insight:' :
                     currentMessage.suggestionCategory === 'habit_motivation' ? 'Keep Going!':
                     currentMessage.suggestionCategory === 'daily_summary_prompt' ? 'Evening Thought:' :
                     'AI Assistant:'}
                </p>
                <button 
                    onClick={handleRefresh} 
                    disabled={isLoadingAi}
                    className="p-1 text-gray-400 hover:text-primary-accent disabled:opacity-50"
                    aria-label="Refresh suggestion"
                >
                    {isLoadingAi ? <Loader2 size={16} className="animate-spin"/> : <RefreshCw size={16} />}
                </button>
            </div>
            <p className={`text-sm mb-3 min-h-[40px] ${currentMessage.type === 'error' ? 'text-red-500' : 'text-text-secondary'}`}>
                {currentMessage.text}
            </p>
            <Button onClick={() => setIsOpen(false)} size="sm" variant="outline" className="w-full text-xs mt-auto">
              Dismiss
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistantWidget;
