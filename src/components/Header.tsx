import React, { useState, useEffect } from 'react';
import { Activity, Moon, Sun, Bell, Menu } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import SyncButton from './SyncButton';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onSync: () => void;
  loading: boolean;
  username?: string;
}

const Header: React.FC<HeaderProps> = ({ onSync, loading, username = 'User' }) => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Update last synced time when sync is triggered
  const handleSync = () => {
    onSync();
    setLastSynced(new Date());
  };

  
  

  return (
    <>
      <motion.header
        className={cn(
          "sticky top-0 z-30 w-full",
          "backdrop-blur-md",
          scrolled ? "bg-white/90 dark:bg-gray-900/90" : "bg-white dark:bg-gray-900",
          scrolled ? "shadow-md" : "border-b border-gray-200 dark:border-gray-800",
          "transition-all duration-300",
          "px-4 py-3 sm:px-6"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-80"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <Activity className="h-6 w-6 text-white relative z-10" />
            </motion.div>
            
            <motion.h1 
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              HealthSync
            </motion.h1>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "250px", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <input
                    type="text"
                    placeholder="Search health metrics..."
                    className="w-full px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary-500"
                    autoFocus
                  />
                </motion.div>
              )}
            </AnimatePresence>
             */}
            <motion.div 
              className="flex items-center space-x-4"
              variants={{
                hidden: { opacity: 0, y: -20 },
                show: { 
                  opacity: 1, 
                  y: 0,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              initial="hidden"
              animate="show"
            >
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: -20 },
                  show: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* <button
                  onClick={toggleSearch}
                  className={cn(
                    "p-2 rounded-full",
                    "bg-gray-100 dark:bg-gray-800",
                    "text-gray-700 dark:text-gray-300",
                    "hover:bg-gray-200 dark:hover:bg-gray-700",
                    "focus:outline-none focus:ring-2 focus:ring-primary-500",
                    "transition-all duration-200"
                  )}
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </button> */}
              </motion.div>
              
          
              
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: -20 },
                  show: { opacity: 1, y: 0 }
                }}
                className="relative"
              >
                <SyncButton 
                  onClick={handleSync} 
                  loading={loading} 
                />
              </motion.div>
              
              
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: -20 },
                  show: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {username.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{username}</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </motion.header>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
          >
            <div className="px-4 py-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {username.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{username}</span>
                </div>
                <div>
                  <SyncButton onClick={handleSync} loading={loading} />
                </div>
              </div>
              
              
              <div className="flex justify-between">
                
                <button
                  onClick={toggleTheme}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  {theme === 'light' ? (
                    <>
                      <Moon className="h-5 w-5" />
                      <span>Dark Mode</span>
                    </>
                  ) : (
                    <>
                      <Sun className="h-5 w-5" />
                      <span>Light Mode</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;