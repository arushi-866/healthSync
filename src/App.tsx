import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/dashboard/Dashboard';
import { useHealthData } from './hooks/useHealthData';
import { motion, AnimatePresence } from 'framer-motion';

// Loading screen component
const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress(prev => Math.min(prev + 2, 100));
      } else {
        setTimeout(onComplete, 500);
      }
    }, 30);

    return () => clearTimeout(timer);
  }, [progress, onComplete]);

  return (
    <motion.div 
      className="flex flex-col justify-center items-center h-screen bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="mb-8"
      >
        <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path 
            d="M50 10 C20 10 10 30 10 50 C10 70 20 90 50 90 C80 90 90 70 90 50 C90 30 80 10 50 10" 
            stroke="#3b82f6" 
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.path 
            d="M30 50 L45 65 L70 35" 
            stroke="#10b981" 
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1, repeat: Infinity }}
          />
        </svg>
      </motion.div>
      
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
        <span className="text-blue-500">Health</span>
        <span className="text-green-500">Sync</span>
      </h1>
      
      <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 50 }}
        />
      </div>
      
      <p className="text-gray-600 dark:text-gray-300">
        {progress < 30 ? 'Connecting to health services...' : 
         progress < 60 ? 'Fetching your health data...' : 
         progress < 90 ? 'Preparing your insights...' : 
         'Ready to go!'}
      </p>
    </motion.div>
  );
};

// Onboarding card component
const OnboardingCard = ({ onComplete }: { onComplete: (name: string) => void }) => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setNameError('Please enter your name');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onComplete(name);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header removed from onboarding card */}
      <motion.div 
        className="flex flex-1 justify-center items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md border border-gray-700"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <div className="text-center mb-6">
            <motion.div
              className="inline-block mb-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg className="w-16 h-16 mx-auto" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="40" stroke="#3b82f6" strokeWidth="4" />
                <path d="M30 50 L45 65 L70 35" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </motion.div>
            <h2 className="text-2xl font-bold text-white">Welcome to <span className="text-blue-400">Health</span><span className="text-green-400">Sync</span></h2>
            <p className="text-gray-300 mt-2">Let's personalize your experience</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">
                What should we call you?
              </label>
              <motion.div whileTap={{ scale: 0.98 }}>
                <input
                  type="text"
                  id="name"
                  className={`w-full px-4 py-3 rounded-lg border ${nameError ? 'border-red-500' : 'border-gray-700'} bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  placeholder="Enter your name"
                  value={name}
                  autoFocus
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) setNameError('');
                  }}
                />
              </motion.div>
              {nameError && (
                <motion.p 
                  className="mt-1 text-sm text-red-400"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {nameError}
                </motion.p>
              )}
            </div>
            
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Setting up your account
                </span>
              ) : (
                "Get Started"
              )}
            </motion.button>
          </form>
          
         
        </motion.div>
      </motion.div>
    </div>
  );
};

function App() {
  const { healthData, loading, syncData } = useHealthData();
  const [appState, setAppState] = useState<'loading' | 'onboarding' | 'dashboard'>('loading');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (appState === 'loading') {
        setAppState('onboarding');
      }
    }, 10000); 
    return () => clearTimeout(timer);
  }, [appState]);

  const handleOnboardingComplete = (name: string) => {
    setUserName(name);
    setAppState('dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Only show header if not onboarding */}
      {appState !== 'loading' && appState !== 'onboarding' && (
        <Header 
          onSync={syncData} 
          loading={loading} 
          username={userName}
        />
      )}
      
      <AnimatePresence mode="wait">
        {appState === 'loading' && (
          <LoadingScreen 
            key="loading" 
            onComplete={() => setAppState('onboarding')} 
          />
        )}
        
        {appState === 'onboarding' && (
          <OnboardingCard 
            key="onboarding" 
            onComplete={handleOnboardingComplete} 
          />
        )}
        
        {appState === 'dashboard' && (
          <motion.main 
            key="dashboard"
            className="pb-8 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {healthData ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5,
                  staggerChildren: 0.1,
                  delayChildren: 0.2
                }}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                      Welcome, <span className="text-blue-500">{userName}</span>!
                    </h1>
                  </motion.div>
                  
                  <Dashboard healthData={healthData} />
                </div>
              </motion.div>
            ) : (
              <div className="flex justify-center items-center h-64">
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent border-b-green-500"
                ></motion.div>
              </div>
            )}
          </motion.main>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {appState === 'dashboard' && (
          <motion.footer 
            className="max-w-7xl mx-auto py-4 px-4 sm:px-6 border-t border-gray-200 dark:border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              HealthSync Dashboard — Your health data, beautifully visualized.
            </p>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;