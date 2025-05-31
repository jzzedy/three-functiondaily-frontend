import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card-background shadow-sm text-text-primary py-4 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} ThreeFunctionDaily. All rights reserved.</p>
        <p className="mt-1">
          Made<span className=""> </span>by Zed!
        </p>
      </div>
    </footer>
  );
};

export default Footer; 