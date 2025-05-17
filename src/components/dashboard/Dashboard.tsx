import React, { useState, useEffect, useRef } from 'react';
import MoodCard from './MoodCard';
import SleepCard from './SleepCard';
import WaterCard from './WaterCard';
import StepsCard from './StepsCard';
import HeartRateCard from './HeartRateCard';
import WeightCard from './WeightCard';
import HealthScoreCard from './HealthScoreCard';
import OverlayChart from './OverlayChart';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useAnimation } from 'framer-motion';
import { Bell, Search, X, MessageSquare, Info } from 'lucide-react';
import confetti from 'canvas-confetti';




export interface HealthData {
  healthScore: number;
  mood: {
    value: number;
    history: { date: string; value: number; }[];
  };
  sleep: {
    value: number;
    history: { date: string; value: number; }[];
  };
  water: {
    value: number;
    goal: number;
    history: { date: string; value: number; }[];
  };
  steps: {
    value: number;
    goal: number;
    history: { date: string; value: number; }[];
  };
  heartRate: {
    value: number;
    history: { date: string; value: number; }[];
  };
  weight: {
    value: number;
    history: { date: string; value: number; }[];
  };
  user?: {
    name?: string;
    // Add other user fields if needed
  };
}

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
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiShown, setConfettiShown] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const notificationPanelRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const controls = useAnimation();
  const staggerControls = useAnimation();

  const scrollY = useMotionValue(0);
  const springScrollY = useSpring(scrollY, { stiffness: 100, damping: 30 });

  const headerY = useTransform(springScrollY, [0, 300], [0, -50]);
  const headerOpacity = useTransform(springScrollY, [0, 100], [1, 0.8]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const healthTips = [
    "Try to drink at least 8 glasses of water daily to stay hydrated.",
    "Aim for 7-9 hours of quality sleep each night for better health.",
    "Take short breaks to stand and stretch if you sit for long periods.",
    "Regular meditation can help reduce stress and improve focus.",
    "Try to incorporate 30 minutes of physical activity into your daily routine."
  ];

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

  const handleCardFocus = (cardId: string) => {
    if (layoutMode === 'grid') {
      setLayoutMode('focus');
      setFocusedCard(cardId);
      controls.start({
        scale: [1, 0.98, 1.02, 1],
        transition: { duration: 0.4 }
      });
    } else if (focusedCard === cardId) {
      setLayoutMode('grid');
      setFocusedCard(null);
      controls.start({
        scale: [1, 0.95, 1.03, 1],
        transition: { duration: 0.5 }
      });
    } else {
      setFocusedCard(cardId);
    }
  };

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
          history={healthData.mood.history.map((item, idx) => ({
            date: new Date(Date.now() - (healthData.mood.history.length - idx - 1) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            value: item.value
          }))}
        />
      ),
    },
    {
      id: 'sleep',
      label: 'Sleep',
      component: (
        <SleepCard
          value={healthData.sleep.value}
          history={healthData.sleep.history.map((item, idx) => ({
            date: new Date(Date.now() - (healthData.sleep.history.length - idx - 1) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            value: item.value
          }))}
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
          history={healthData.water.history.map(item => ({ value: item.value }))}
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
          history={healthData.steps.history.map((item, idx) => ({
            date: new Date(Date.now() - (healthData.steps.history.length - idx - 1) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            value: item.value
          }))}
        />
      ),
    },
    {
      id: 'heart-rate',
      label: 'Heart Rate',
      component: (
        <HeartRateCard
          value={healthData.heartRate.value}
          history={healthData.heartRate.history.map((item, idx) => ({
            date: new Date(Date.now() - (healthData.heartRate.history.length - idx - 1) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            value: item.value
          }))}
        />
      ),
    },
    {
      id: 'weight',
      label: 'Weight',
      component: (
        <WeightCard
          value={healthData.weight.value}
          history={healthData.weight.history.map((item, idx) => ({
            date: new Date(Date.now() - (healthData.weight.history.length - idx - 1) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            value: item.value
          }))}
        />
      ),
    },
    {
      id: 'overlay',
      label: 'Overlay',
      component: (
        <OverlayChart
          healthData={{
            ...healthData,
            mood: {
              ...healthData.mood,
              history: healthData.mood.history.map((item, idx) => ({
                date: new Date(Date.now() - (healthData.mood.history.length - idx - 1) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
                value: item.value
              }))
            },
            sleep: {
              ...healthData.sleep,
              history: healthData.sleep.history.map((item, idx) => ({
                date: new Date(Date.now() - (healthData.sleep.history.length - idx - 1) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
                value: item.value
              }))
            },
            water: {
              ...healthData.water,
              history: healthData.water.history.map((item, idx) => ({
                date: new Date(Date.now() - (healthData.water.history.length - idx - 1) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
                value: item.value
              }))
            },
            steps: {
              ...healthData.steps,
              history: healthData.steps.history.map((item, idx) => ({
                date: new Date(Date.now() - (healthData.steps.history.length - idx - 1) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
                value: item.value
              }))
            },
            heartRate: {
              ...healthData.heartRate,
              history: healthData.heartRate.history.map((item, idx) => ({
                date: new Date(Date.now() - (healthData.heartRate.history.length - idx - 1) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
                value: item.value
              }))
            },
            weight: {
              ...healthData.weight,
              history: healthData.weight.history.map((item, idx) => ({
                date: new Date(Date.now() - (healthData.weight.history.length - idx - 1) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
                value: item.value
              }))
            }
          }}
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

    const handleScroll = () => {
      scrollY.set(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    const welcomeTimer = setTimeout(() => {
      setShowWelcome(false);
      staggerControls.start("visible");

      if (!confettiShown) {
        setShowConfetti(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4F46E5', '#7C3AED', '#EC4899', '#10B981'],
        });
        setConfettiShown(true);
        setTimeout(() => setShowConfetti(false), 2500);
      }
    }, 4000);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(welcomeTimer);
    };
  }, [darkMode, scrollY, mouseX, mouseY, staggerControls, confettiShown]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

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
    controls.start({
      rotate: [0, 360],
      transition: { duration: 1, ease: "easeInOut" }
    });
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchTerm('');
    }
  };

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
      ref={dashboardRef}
      className={`min-h-screen transition-colors duration-500 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Floating particles background for dark mode */}
      {darkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-indigo-600 opacity-20"
              initial={{
                width: Math.random() * 15 + 5,
                height: Math.random() * 15 + 5,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                x: [
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                ],
                y: [
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight,
                ],
              }}
              transition={{
                duration: Math.random() * 50 + 30,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      {/* Welcome overlay with enhanced animation sequence */}
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
              className="text-center text-white z-10"
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
                className="text-5xl font-bold mb-4 tracking-tight"
                initial={{ y: 20, opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  transition: { delay: 0.5, duration: 0.6 }
                }}
              >
                Welcome to 
                <motion.span 
                  className="bg-gradient-to-r from-indigo-300 to-purple-400 text-transparent bg-clip-text ml-2"
                  animate={{ 
                    color: ["#C4B5FD", "#A78BFA", "#8B5CF6", "#C4B5FD"],
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  HealthSync
                </motion.span>
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

              {/* Username only, no search/notifications here */}
              <motion.div
                className="flex items-center justify-center mt-8 gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <span className="text-lg font-semibold text-white">
                  {`Welcome${healthData?.user?.name ? `, ${healthData.user.name}` : ''}!`}
                </span>
              </motion.div>

              {/* Loading animation */}
              <motion.div 
                className="flex justify-center mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <div className="flex space-x-2">
                  {[0, 1, 2, 3].map((dot) => (
                    <motion.div
                      key={dot}
                      className="h-3 w-3 rounded-full bg-indigo-400"
                      animate={{
                        y: ["0%", "-50%", "0%"],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        repeatType: "loop",
                        delay: dot * 0.1,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
            
            {/* Animated dots in background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-indigo-500 opacity-10"
                  style={{
                    width: Math.random() * 10 + 5,
                    height: Math.random() * 10 + 5,
                  }}
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    opacity: 0
                  }}
                  animate={{
                    opacity: [0, 0.5, 0],
                    scale: [0, 1, 0],
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                  }}
                  transition={{
                    duration: Math.random() * 5 + 3,
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Username + Search + Notifications row (below header, above dashboard cards) */}
      {!showWelcome && (
        <div className="max-w-7xl mx-auto px-4 mt-8 flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-800 dark:text-white">
            {`Welcome${healthData?.user?.name ? `, ${healthData.user.name}` : ''}!`}
          </span>
          <div className="flex items-center space-x-3">
            {/* Search bar */}
            <AnimatePresence mode="wait">
              {isSearchOpen ? (
                <motion.div
                  className="relative"
                  initial={{ width: 40, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 40, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-3 pr-10 py-2 rounded-full bg-white/90 text-gray-900 border-none focus:ring-2 focus:ring-indigo-400 transition"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                  <button
                    onClick={handleSearchToggle}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  onClick={handleSearchToggle}
                  className="p-2 rounded-full hover:bg-indigo-400/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search className="text-gray-700 dark:text-white" size={20} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Notifications */}
            <motion.div className="relative" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <button
                className="p-2 rounded-full hover:bg-indigo-400/20 transition-colors relative"
                onClick={handleNotificationsClick}
                aria-label="Show notifications"
              >
                <Bell className="text-gray-700 dark:text-white" size={20} />
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
          </div>
        </div>
      )}

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
            {filteredCards.length === 0 ? (
              <div className="col-span-full w-full flex justify-center items-center py-16">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md px-8 py-6 text-center text-gray-500 dark:text-gray-300 text-lg font-medium">
                   Card not available
                </div>
              </div>
            ) : (
              filteredCards.map(card => (
                <div key={card.id} className="flex w-full justify-center">
                  {card.component}
                </div>
              ))
            )}
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
              href="/privacy"
              className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
              whileHover={{ y: -2 }}
            >
              Privacy
            </motion.a>
            <motion.a
              href="/terms"
              className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
              whileHover={{ y: -2 }}
            >
              Terms
            </motion.a>
            <motion.a
              href="/support"
              className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
              whileHover={{ y: -2 }}
            >
              Support
            </motion.a>
          </motion.div>
        </div>
      </motion.footer>

      {/* Health Tip Floating Button */}
      <motion.button
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setShowTip(true);
          setTipIndex((prev) => (prev + 1) % healthTips.length);
        }}
        aria-label="Show Health Tip"
      >
        <Info size={28} className="text-white" />
      </motion.button>

      {/* Health Tip Popup - only visible when showTip is true */}
      <AnimatePresence>
        {showTip && (
          <motion.div 
            className="fixed bottom-28 right-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-4 text-white z-50 max-w-md"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
          >
            <div className="flex items-start">
              <MessageSquare className="mr-3 mt-1 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-medium mb-1">Health Tip</h4>
                <p className="text-sm opacity-90">{healthTips[tipIndex]}</p>
              </div>
              <button 
                onClick={() => setShowTip(false)}
                className="ml-3 text-white/70 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;
