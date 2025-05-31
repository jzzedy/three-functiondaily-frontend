import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; 
import Footer from './Footer';
import AIAssistantWidget from '../../features/aiAssistant/components/AIAssistantWidget'; 

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet /> 
      </main>
      <Footer />
      <AIAssistantWidget /> 
    </div>
  );
};

export default MainLayout;