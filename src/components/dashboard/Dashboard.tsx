import React, { useState, useEffect, useRef } from 'react';
import { HealthData } from '../../hooks/useHealthData';
import MoodCard from './MoodCard';
import SleepCard from './SleepCard';
import WaterCard from './WaterCard';
import StepsCard from './StepsCard';
import HeartRateCard from './HeartRateCard';
import WeightCard from './WeightCard';
import HealthScoreCard from './HealthScoreCard';
import OverlayChart from './OverlayChart';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {  Bell,  Maximize, Search, X, RefreshCw } from 'lucide-react';


interface DashboardProps {
  healthData: HealthData;
}

const Dashboard: React.FC<DashboardProps> = ({ healthData }) => {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'focus'>('grid');
  const [focusedCard, setFocusedCard] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const notificationPanelRef = useRef<HTMLDivElement>(null);

  // Notifications array (add here to avoid "not defined" error)
  const notifications = [
    {
      id: 1,
      title: "💧 Time to hydrate!",
      message: "Reminder: Drink a glass of water to stay hydrated.",
      time: "Just now"
    },
    {
      id: 2,
      title: "🛌 Sleep Check",
      message: "Try to get at least 7 hours of sleep tonight.",
      time: "1h ago"
    },
    {
      id: 3,
      title: "🚶 Move Reminder",
      message: "Take a short walk to reach your step goal.",
      time: "2h ago"
    }
  ];

  // Page scroll tracking for parallax effects
  const scrollY = useMotionValue(0);
  const scrollYSmooth = useSpring(scrollY, { damping: 15, stiffness: 100 });

  // Card focus handler must be defined before cards array
  const handleCardFocus = (cardId: string) => {
    if (layoutMode === 'grid') {
      setLayoutMode('focus');
      setFocusedCard(cardId);
    } else if (focusedCard === cardId) {
      setLayoutMode('grid');
      setFocusedCard(null);
    } else {
      setFocusedCard(cardId);
    }
  };

  // List of cards for ordered rendering - define only once!
  const cards: { id: string; label: string; component: JSX.Element }[] = [
    {
      id: 'health-score',
      label: 'Health Score',
      component: (
        <HealthScoreCard
          score={healthData.healthScore}
          onClick={() => handleCardFocus('health-score')}
        />
      ),
    },
    {
      id: 'mood',
      label: 'Mood',
      component: (
        <MoodCard
          value={healthData.mood.value}
          history={healthData.mood.history}
        />
      ),
    },
    {
      id: 'sleep',
      label: 'Sleep',
      component: (
        <SleepCard
          value={healthData.sleep.value}
          history={healthData.sleep.history}
        />
      ),
    },
    {
      id: 'water',
      label: 'Water',
      component: (
        <WaterCard
          value={healthData.water.value}
          goal={healthData.water.goal}
          history={healthData.water.history}
          // onAddWater={healthData.water.onAddWater}
        />
      ),
    },
    {
      id: 'steps',
      label: 'Steps',
      component: (
        <StepsCard
          value={healthData.steps.value}
          goal={healthData.steps.goal}
          history={healthData.steps.history}
        />
      ),
    },
    {
      id: 'heart-rate',
      label: 'Heart Rate',
      component: (
        <HeartRateCard
          value={healthData.heartRate.value}
          history={healthData.heartRate.history}
        />
      ),
    },
    {
      id: 'weight',
      label: 'Weight',
      component: (
        <WeightCard
          value={healthData.weight.value}
          history={healthData.weight.history}
        />
      ),
    },
    {
      id: 'overlay',
      label: 'Overlay',
      component: (
        <OverlayChart
          healthData={healthData}
        />
      ),
    },
  ];

  useEffect(() => {
    setMounted(true);
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    // Track scroll position for parallax effects
    const handleScroll = () => {
      scrollY.set(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    // Hide welcome message after 5 seconds
    const welcomeTimer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(welcomeTimer);
    };
  }, [darkMode, scrollY]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Optional: close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showNotifications &&
        notificationPanelRef.current &&
        !notificationPanelRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

 

  const refreshData = () => {
    setRefreshing(true);

    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
    hover: {
      y: -5,
      boxShadow: darkMode
        ? "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
        : "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 }
    }
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchTerm('');
    }
  };

  // Create motion value hooks for all cards outside the render/return - avoids conditional hook creation
  // These will be used for parallax effects based on scroll position
  const cardOffsets = cards.map((_, i) => {
    return useTransform(
      scrollYSmooth,
      [0, 1000],
      [0, -30 + (i % 3) * 10]
    );
  });

  // Filter cards based on search term
  const filteredCards = searchTerm.trim()
    ? cards.filter(card =>
        card.label.toLowerCase().includes(searchTerm.trim().toLowerCase())
      )
    : cards;

  if (!mounted) return null;

  function handleNotificationsClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.stopPropagation();
    setShowNotifications((prev) => !prev);
    if (notificationCount > 0) {
      setNotificationCount(0);
    }
  }
  return (
    <motion.div
      className={`min-h-screen transition-colors duration-500 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Welcome overlay */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0a174e] via-[#19376d] to-[#26408b] dark:from-[#0a174e] dark:via-[#19376d] dark:to-[#26408b]"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.8, ease: "easeInOut" }
            }}
          >
            <motion.div
              className="text-center text-white"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: { delay: 0.3, duration: 0.6 }
              }}
              exit={{
                scale: 1.2,
                opacity: 0,
                transition: { duration: 0.4 }
              }}
            >
              <motion.h1
                className="text-5xl font-bold mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  transition: { delay: 0.5, duration: 0.6 }
                }}
              >
                Welcome to HealthSync
              </motion.h1>
              <motion.p
                className="text-xl opacity-90"
                initial={{ y: 20, opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  transition: { delay: 0.7, duration: 0.6 }
                }}
              >
                Your personal health dashboard, reimagined
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <motion.div
              className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              HealthSync
            </motion.div>
          </div>

          <motion.div
            className="flex items-center space-x-3"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            {/* Search button/input */}
            <AnimatePresence mode="wait">
              {isSearchOpen ? (
                <motion.div
                  className="relative"
                  initial={{ width: 40, opacity: 0 }}
                  animate={{ width: 250, opacity: 1 }}
                  exit={{ width: 40, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search cards..."
                    className="w-full pl-3 pr-10 py-2 rounded-full bg-white dark:bg-gray-800 border-none focus:ring-2 focus:ring-indigo-500 transition text-gray-900 dark:text-gray-100"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                  <button
                    onClick={handleSearchToggle}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X size={18} />
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  onClick={handleSearchToggle}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search className="text-gray-600 dark:text-gray-300" size={20} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Refresh button */}
            <motion.button
              onClick={refreshData}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={{ rotate: refreshing ? 360 : 0 }}
              transition={{ duration: 1, ease: "linear", repeat: refreshing ? Infinity : 0 }}
            >
              <RefreshCw className="text-gray-600 dark:text-gray-300" size={20} />
            </motion.button>

            {/* Notifications */}
            <motion.div className="relative" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <button
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors relative"
                onClick={handleNotificationsClick}
                aria-label="Show notifications"
              >
                <Bell className="text-gray-600 dark:text-gray-300" size={20} />
                {notificationCount > 0 && (
                  <motion.div
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  >
                    {notificationCount}
                  </motion.div>
                )}
              </button>
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    ref={notificationPanelRef}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 font-semibold text-gray-700 dark:text-gray-200">
                      Notifications
                    </div>
                    <div>
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="font-medium text-gray-800 dark:text-gray-100">{n.title}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{n.message}</div>
                          <div className="text-xs text-gray-400 mt-1">{n.time}</div>
                        </div>
                      ))}
                      {notifications.length === 0 && (
                        <div className="px-4 py-6 text-center text-gray-400 text-sm">
                          No new notifications
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* Main content */}
      {!showWelcome && (
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div
            className="
              grid 
              gap-8 
              grid-cols-1 
              md:grid-cols-2 
              xl:grid-cols-2 
              2xl:grid-cols-2
              auto-rows-fr
              justify-items-center
            "
          >
            {filteredCards.map(card => (
              <div key={card.id} className="flex w-full justify-center">
                {card.component}
              </div>
            ))}
          </div>
        </main>
      )}

      {/* Footer with gradient and animation */}
      <motion.footer
        className={`py-6 px-6 mt-12 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} relative overflow-hidden`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 dark:from-indigo-900/10 dark:to-purple-900/10"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 15,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400 relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            © 2025 HealthSync. All rights reserved.
          </motion.p>
          <motion.div
            className="flex space-x-6 mt-4 md:mt-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.a
              href="#"
              className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
              whileHover={{ y: -2 }}
            >
              Privacy
            </motion.a>
            <motion.a
              href="#"
              className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
              whileHover={{ y: -2 }}
            >
              Terms
            </motion.a>
            <motion.a
              href="#"
              className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
              whileHover={{ y: -2 }}
            >
              Support
            </motion.a>
          </motion.div>
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default Dashboard;
