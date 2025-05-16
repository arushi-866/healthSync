import React, { useState, useEffect, useRef } from 'react';
import { FootprintsIcon, Award, Zap, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer, ReferenceLine } from 'recharts';
import MetricCard from './MetricCard';
import { motion, AnimatePresence } from 'framer-motion';

interface StepsCardProps {
  value: number;
  goal: number;
  history: Array<{ date: string; value: number }>;
}

const StepsCard: React.FC<StepsCardProps> = ({ value, goal, history }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Format dates for display and calculate streaks
  const formattedData = history.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
    percentage: Math.round((item.value / goal) * 100),
    goalReached: item.value >= goal
  }));

  // Calculate progress percentage and other metrics
  const progress = Math.min((value / goal) * 100, 100);
  const averageSteps = Math.round(history.reduce((sum, item) => sum + item.value, 0) / history.length);
  const goalReached = value >= goal;
  const stepsRemaining = Math.max(0, goal - value);

  // Calculate streak
  useEffect(() => {
    let currentStreak = 0;
    // Count consecutive days where goal was met, starting from the most recent
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].value >= goal) {
        currentStreak++;
      } else {
        break;
      }
    }
    setStreak(currentStreak);
  }, [history, goal]);

  // Animate progress bar
  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgressBarWidth(progress);
    }, 300);
    return () => clearTimeout(timeout);
  }, [progress]);

  // Celebration animation when goal is reached
  useEffect(() => {
    if (goalReached && value > 0) {
      setShowCelebration(true);
      const timeout = setTimeout(() => {
        setShowCelebration(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [goalReached, value]);

  // Get color based on progress
  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "#22c55e"; // Green for achieved
    if (percentage >= 75) return "#84cc16";  // Light green for close
    if (percentage >= 50) return "#facc15";  // Yellow for halfway
    if (percentage >= 25) return "#f97316";  // Orange for started
    return "#ef4444";                        // Red for minimal progress
  };

  // Tooltip logic
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

  // Animation variants
  const barContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  return (
    <MetricCard 
      title="Steps" 
      icon={
        <motion.div
          animate={{ 
            rotate: isHovered ? [0, -10, 10, 0] : 0,
            scale: isHovered ? 1.1 : 1 
          }}
          transition={{ duration: 0.5 }}
        >
          <FootprintsIcon className={goalReached ? "text-green-500" : "text-primary"} />
        </motion.div>
      }
      extraControls={
        <div className="flex space-x-1">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTooltip}
            className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors relative z-50"
            style={{ position: 'relative', zIndex: 50 }}
          >
            <Info size={16} />
            <AnimatePresence>
              {showTooltip && (
                <motion.div 
                  ref={tooltipRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-2 right-0 w-72 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-[9999] text-left border border-gray-200 dark:border-gray-700"
                  style={{ pointerEvents: 'auto' }}
                >
                  <h5 className="font-medium mb-1 text-gray-800 dark:text-gray-200">About Steps</h5>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    This card tracks your daily step count and progress toward your goal. 
                    The bar chart shows your recent step history, and the progress bar visualizes your daily achievement.
                  </p>
                  <ul className="mt-2 text-xs text-gray-500 dark:text-gray-400 list-disc pl-4">
                    <li>Green bars mean you hit your goal.</li>
                    <li>Streaks are shown for consecutive goal days.</li>
                    <li>Try to keep your streak going for better health!</li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      }
    >
      <motion.div 
        className="flex flex-col"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-baseline mb-2">
          <div className="flex items-baseline">
            <AnimatePresence mode="wait">
              <motion.span 
                key={value}
                className="text-3xl font-semibold text-gray-800 dark:text-gray-100"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 10, opacity: 0 }}
                transition={{ duration: 0.3, type: "spring" }}
              >
                {value.toLocaleString()}
              </motion.span>
            </AnimatePresence>
            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
              steps
            </span>
          </div>
          
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-1">
              Goal: {goal.toLocaleString()}
            </span>
            {goalReached && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                <Award size={16} className="text-green-500" />
              </motion.div>
            )}
          </motion.div>
        </div>
        
        {/* Streak indicator */}
        {streak > 1 && (
          <motion.div 
            className="flex items-center text-xs mb-2 text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full w-fit"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Zap size={14} className="mr-1" />
            <span>{streak} day streak!</span>
          </motion.div>
        )}
        
        {/* Progress bar with animated fill */}
        <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full mb-4 relative overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ 
              width: `${progressBarWidth}%`,
              backgroundColor: getProgressColor(progress) 
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progressBarWidth}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          
          {/* Milestone markers */}
          <div className="absolute top-0 left-1/4 h-full w-px bg-gray-300 dark:bg-gray-600"></div>
          <div className="absolute top-0 left-1/2 h-full w-px bg-gray-300 dark:bg-gray-600"></div>
          <div className="absolute top-0 left-3/4 h-full w-px bg-gray-300 dark:bg-gray-600"></div>
          
          {/* Celebration particles */}
          {showCelebration && (
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{ 
                    backgroundColor: ['#22c55e', '#84cc16', '#facc15', '#0ca5e9'][i % 4],
                    top: '50%',
                    left: `${progress}%`
                  }}
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: [0, 1, 0],
                    x: Math.sin(i) * 100,
                    y: Math.cos(i) * 50 - 50,
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 1.5,
                    delay: i * 0.05,
                    ease: "easeOut" 
                  }}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Status display */}
        <motion.div 
          className="flex justify-between mb-4 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className="text-gray-600 dark:text-gray-300">
            {stepsRemaining > 0 ? (
              <span>{stepsRemaining.toLocaleString()} to go</span>
            ) : (
              <span className="text-green-500 font-medium">Goal achieved!</span>
            )}
          </div>
          <div className="text-gray-500 dark:text-gray-400">
            Avg: {averageSteps.toLocaleString()}
          </div>
        </motion.div>
        
        {/* Enhanced stats section */}
        <motion.div
          className="grid grid-cols-2 gap-4 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Best Day</span>
            <span className="text-lg font-semibold text-green-500">
              {Math.max(...history.map(h => h.value)).toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Worst Day</span>
            <span className="text-lg font-semibold text-red-500">
              {Math.min(...history.map(h => h.value)).toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">7-day Avg</span>
            <span className="text-lg font-semibold text-blue-500">
              {averageSteps.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Goal %</span>
            <span className="text-lg font-semibold" style={{ color: getProgressColor(progress) }}>
              {Math.round(progress)}%
            </span>
          </div>
        </motion.div>

        {/* Bar chart */}
        <motion.div 
          className="h-32 md:h-44"
          variants={barContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={formattedData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              barGap={2}
            >
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false}
                fontSize={12}
                tick={{ fill: '#9ca3af' }}
              />
              <YAxis hide />
              <Tooltip 
                formatter={(value: number) => `${value.toLocaleString()} steps`}
                labelFormatter={(label: string, payload: any[]) => {
                  if (payload && payload.length > 0) {
                    const percentage = payload[0]?.payload?.percentage;
                    return (
                      <span>
                        <span style={{ color: getProgressColor(percentage) }}>
                          {percentage}% of goal
                        </span>
                      </span>
                    );
                  }
                  return label;
                }}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  border: 'none',
                  padding: '10px',
                }}
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              />
              
              {/* Reference line for goal */}
              <ReferenceLine 
                y={goal} 
                stroke="#22c55e" 
                strokeDasharray="3 3"
                strokeWidth={2}
                label={{ 
                  value: 'Goal', 
                  position: 'insideTopRight',
                  fill: '#22c55e',
                  fontSize: 10
                }}
              />
              
              <Bar 
                dataKey="value" 
                radius={[6, 6, 0, 0]} 
                animationDuration={1200}
                animationEasing="ease-in-out"
              >
                {formattedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getProgressColor(entry.percentage)}
                    fillOpacity={0.7}
                    stroke={entry.goalReached ? "#22c55e" : "transparent"}
                    strokeWidth={entry.goalReached ? 2 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>
    </MetricCard>
  );
};

export default StepsCard;