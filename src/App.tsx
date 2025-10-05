import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import { mockAirQualityData } from './data/mockData';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'dashboard'>('landing');
  const [isLoading, setIsLoading] = useState(false);

  const handleEnterDashboard = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentPage('dashboard');
      setIsLoading(false);
    }, 1500);
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
  };

  return (
    <div className="min-h-screen space-gradient">
      <AnimatePresence mode="wait">
        {currentPage === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LandingPage onEnterDashboard={handleEnterDashboard} />
          </motion.div>
        )}
        
        {currentPage === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <Dashboard onBackToLanding={handleBackToLanding} />
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-space-dark/95 backdrop-blur-sm z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <motion.h2 
              className="text-2xl font-orbitron text-gradient mb-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Initializing AeroSight
            </motion.h2>
            <p className="text-gray-400">Connecting to NASA TEMPO satellite data...</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default App;
