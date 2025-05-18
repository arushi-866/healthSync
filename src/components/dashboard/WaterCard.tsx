import React, { useState, useEffect, useRef } from 'react';
import { Droplets, Trophy, Droplet, Info } from 'lucide-react';
import MetricCard from './MetricCard';
import { motion, AnimatePresence } from 'framer-motion';

interface WaterCardProps {
  value: number;
  goal: number;
  onAddWater?: () => void;
  streakDays?: number;
  history?: Array<{ value: number }>; // Added for best/worst/avg
  onShowTip?: () => void; // <-- add this line
}

const hydrationTips = [
  "Tip: Drink a glass of water before each meal to help with digestion.",
  "Tip: Set reminders to drink water throughout your day.",
  "Tip: Carry a reusable water bottle when you go out.",
  "Tip: Herbal teas count toward your daily water intake.",
  "Tip: Staying hydrated improves energy levels and brain function."
];

const WaterCard: React.FC<WaterCardProps> = ({ 
  value, 
  goal, 
  onAddWater = () => {}, 
  streakDays = 0,
  history = [],
  onShowTip // <-- add this
}) => {
  // State for animation triggers
  const [showCelebration, setShowCelebration] = useState(false);
  const [prevValue, setPrevValue] = useState(value);
  const [isHovering, setIsHovering] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tipIndex, setTipIndex] = useState(() => Math.floor(Math.random() * hydrationTips.length));
  
  // Calculate progress percentage
  const progress = Math.min((value / goal) * 100, 100);
  const goalCompleted = value >= goal;
  
  // Check if water was just added
  useEffect(() => {
    if (value > prevValue) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 2000);
      return () => clearTimeout(timer);
    }
    setPrevValue(value);
  }, [value, prevValue]);

  // Tooltip close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTooltip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTooltip(!showTooltip);
  };

  // Custom ripple animation for the water drops
  const rippleVariants = {
    inactive: { scale: 1, opacity: 0.3 },
    active: { 
      scale: [0.8, 1.2, 1],
      opacity: 1,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.15,
      opacity: 0.7,
      transition: { 
        duration: 0.2
      }
    }
  };

  // Circle progress animation
  const circumference = 2 * Math.PI * 54;

  // Enhanced stats
  const bestDay = history.length ? Math.max(...history.map((h) => h.value)) : value;
  const worstDay = history.length ? Math.min(...history.map((h) => h.value)) : value;
  const avg = history.length ? Math.round(history.reduce((sum, h) => sum + h.value, 0) / history.length) : value;

  return (
    <MetricCard 
      title="Water Intake" 
      icon={<Droplets className="text-blue-500" />}
      className="relative overflow-hidden"
      extraControls={
        <div className="flex space-x-1">
          <button
            type="button"
            onClick={onShowTip} // <-- show alert at the top
            className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors relative z-50"
            style={{ position: 'relative', zIndex: 50 }}
            aria-label="Show water intake info"
          >
            <Info size={16} />
          </button>
        </div>
      }
    >
      {/* Goal reached celebration overlay */}
      <AnimatePresence>
        {showCelebration && goalCompleted && (
          <motion.div 
            className="absolute inset-0 bg-blue-500 bg-opacity-20 z-10 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="flex flex-col items-center"
              initial={{ scale: 0.5, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 20 }}
              transition={{ type: "spring", damping: 12 }}
            >
              <Trophy size={40} className="text-yellow-500 mb-2" />
              <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300">Goal Reached!</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">Stay hydrated!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex flex-col items-center">
        {/* Streak display */}
        {streakDays > 0 && (
          <motion.div 
            className="mb-2 px-3 py-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full text-white flex items-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="mr-1 text-xs">🔥</span>
            <span className="text-xs font-medium">{streakDays} day streak</span>
          </motion.div>
        )}
        
        {/* Progress Circle */}
        <div className="mb-4 relative flex items-center justify-center">
          <svg width="140" height="140" viewBox="0 0 140 140">
            {/* Water background effect */}
            <defs>
              <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.8" />
              </linearGradient>
              <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0ea5e9" floodOpacity="0.3"/>
              </filter>
            </defs>
            
            {/* Background circle */}
            <circle
              cx="70"
              cy="70"
              r="60"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
              className="dark:stroke-gray-700"
            />
            
            {/* Progress circle */}
            <motion.circle
              cx="70"
              cy="70"
              r="60"
              fill="none"
              stroke="url(#waterGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ 
                strokeDashoffset: circumference * (1 - progress / 100)
              }}
              transition={{ 
                duration: 1.5, 
                ease: "easeOut",
                delay: 0.3
              }}
              transform="rotate(-90 70 70)"
              filter="url(#dropShadow)"
            />
            
            {/* Water wave effect at bottom of circle based on progress */}
            {progress > 0 && (
              <motion.path
                d={`M 10,${140 - progress} 
                    C 30,${130 - progress} 50,${150 - progress} 70,${140 - progress} 
                    C 90,${130 - progress} 110,${150 - progress} 130,${140 - progress}
                    L 130,140 L 10,140 Z`}
                fill="url(#waterGradient)"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 0.7 }}
                transition={{
                  duration: 1,
                  delay: 0.5
                }}
              />
            )}
          </svg>
          
          {/* Central value display */}
          <div className="absolute flex flex-col items-center justify-center">
            <motion.div
              className="relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.span 
                key={value}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-blue-500 to-blue-700 dark:from-blue-300 dark:to-blue-500"
              >
                {value}
              </motion.span>
              
              {/* Droplet add button */}
              <motion.button
                className="absolute -right-8 -top-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700 rounded-full p-1 shadow-md"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAddWater}
                aria-label="Add water"
              >
                <Droplet size={16} className="text-blue-600 dark:text-blue-300" />
              </motion.button>
            </motion.div>
            
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              of <span className="font-medium">{goal}</span> cups
            </span>
          </div>
        </div>
        
        {/* Water cups visualization */}
        <motion.div 
          className="flex flex-wrap gap-2 justify-center mt-3 px-2 py-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {Array.from({ length: goal }, (_, index) => (
            <motion.div
              key={index}
              variants={rippleVariants}
              initial="inactive"
              animate={index < value ? "active" : "inactive"}
              whileHover={index >= value ? "hover" : undefined}
              onClick={index >= value ? onAddWater : undefined}
              className={`cursor-pointer text-xl ${index < value ? '' : 'cursor-pointer'}`}
              onMouseEnter={() => index >= value && setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              transition={{ delay: index * 0.08 }}
            >
              <div className="relative">
                {index < value ? (
                  <motion.span 
                    initial={{ rotateZ: 0 }}
                    animate={{ rotateZ: [0, -10, 10, -5, 5, 0] }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                  >
                    💧
                  </motion.span>
                ) : (
                  <span className="text-gray-300 dark:text-gray-600">💧</span>
                )}
                
                {/* Add a ripple effect when hovering over inactive cups */}
                {index >= value && isHovering && (
                  <motion.div
                    className="absolute inset-0 bg-blue-400 rounded-full"
                    initial={{ scale: 0.2, opacity: 0.7 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Enhanced stats section */}
        <motion.div
          className="grid grid-cols-2 gap-4 mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Best Day</span>
            <span className="text-lg font-semibold text-blue-500">
              {bestDay}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Worst Day</span>
            <span className="text-lg font-semibold text-red-500">
              {worstDay}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Avg</span>
            <span className="text-lg font-semibold text-blue-400">
              {avg}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Streak</span>
            <span className="text-lg font-semibold text-amber-500">
              {streakDays}
            </span>
          </div>
        </motion.div>

        {/* Daily hydration tips with animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tipIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.8, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400 italic px-4"
            onClick={() => setTipIndex((prev) => (prev + 1) % hydrationTips.length)}
            style={{ cursor: 'pointer' }}
            title="Click for another tip"
          >
            {hydrationTips[tipIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
    </MetricCard>
  );
};

export default WaterCard;