import React from 'react';
import Header from './components/Header';
import Dashboard from './components/dashboard/Dashboard';
import { useHealthData } from './hooks/useHealthData';
import { motion } from 'framer-motion';

function App() {
  const { healthData, loading, syncData } = useHealthData();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header onSync={syncData} loading={loading} />
      
      <main className="pb-8">
        {healthData ? (
          <Dashboard healthData={healthData} />
        ) : (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"
            ></motion.div>
          </div>
        )}
      </main>
      
      <footer className="max-w-7xl mx-auto py-4 px-4 sm:px-6 border-t border-gray-200 dark:border-gray-800">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          HealthSync Dashboard — Your health data, beautifully visualized.
        </p>
      </footer>
    </div>
  );
}

export default App;