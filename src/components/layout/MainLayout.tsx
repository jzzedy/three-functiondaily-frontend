import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; 
import Footer from './Footer';

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 sm:pb-32">
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;