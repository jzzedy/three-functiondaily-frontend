import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import { pageVariants, pageTransition } from '../config/animationVariants'; 

const NotFoundPage: React.FC = () => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="text-center py-10 flex flex-col items-center justify-center min-h-[calc(100vh-150px)]" 
    >
      <h1 className="text-6xl font-bold text-primary-accent">404</h1>
      <p className="text-2xl mt-4 mb-6">Oops! Page Not Found.</p>
      <p className="mb-8 text-text-secondary">The page you are looking for does not exist or has been moved.</p>
      <Link
        to="/"
        className="px-6 py-3 bg-primary-accent text-white rounded-md hover:bg-secondary-accent transition-colors"
      >
        Go to Homepage
      </Link>
    </motion.div>
  );
};
export default NotFoundPage;