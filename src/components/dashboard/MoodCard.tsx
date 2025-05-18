import React, { useState, useEffect, useRef } from 'react';
import { Smile, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import MetricCard from './MetricCard';
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from 'framer-motion';

interface MoodCardProps {
  value: number;
  history: Array<{ date: string; value: number }>;
  onMoodChange?: (newValue: number) => void;
  onShowTip?: () => void; // <-- add this line
}

const MoodCard: React.FC<MoodCardProps> = ({ value, history, onMoodChange, onShowTip }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevValue, setPrevValue] = useState(value);
  const controls = useAnimation();

  // Emoji mapping for mood values with descriptions and colors
  const moodData = [
    { emoji: "😢", color: "#ef4444", label: "Very Sad", description: "Feeling deeply upset or distressed" },
    { emoji: "😔", color: "#f97316", label: "Sad", description: "Feeling down or unhappy" },
    { emoji: "😐", color: "#facc15", label: "Neutral", description: "Neither particularly happy nor sad" },
    { emoji: "🙂", color: "#84cc16", label: "Happy", description: "Feeling good and content" },
    { emoji: "😄", color: "#22c55e", label: "Very Happy", description: "Feeling joyful and enthusiastic" }
  ];

  // Only show current day and previous 7 days (8 days total)
  const formattedData = history
    .slice(-8)
    .map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('en-US', { 
        weekday: 'short',
        day: 'numeric'
      }),
      color: moodData[item.value - 1]?.color || "#facc15"
    }));

  // For interactive mood selector
  const handleMoodSelect = (newValue: number) => {
    if (onMoodChange) {
      onMoodChange(newValue);
    }
  };

  // Handle value changes for animations
  useEffect(() => {
    if (value !== prevValue) {
      setIsAnimating(true);
      controls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.6, ease: "easeInOut" }
      });

      const timer = setTimeout(() => {
        setIsAnimating(false);
        setPrevValue(value);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [value, prevValue, controls]);

  // Automatically pulse the emoji every 10 seconds to attract attention
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating && !isHovered) {
        controls.start({
          scale: [1, 1.1, 1],
          transition: { duration: 1.5, ease: "easeInOut" }
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [controls, isAnimating, isHovered]);

  // Motion values for parallax effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  // Handle mouse move for parallax effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  // Clear parallax effect when mouse leaves
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <MetricCard 
      title="Mood Tracker"
      icon={
        <motion.div 
          animate={{ rotate: isHovered ? [0, -10, 10, -10, 0] : 0 }}
          transition={{ duration: 0.5 }}
        >
          <Smile className="text-primary" />
        </motion.div>
      }
      extraControls={
        <div className="flex space-x-1">
          <button
            type="button"
            onClick={onShowTip} // <-- show alert at the top
            className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors relative z-50"
            style={{ position: 'relative', zIndex: 50 }}
            aria-label="Show mood tracker info"
          >
            <Info size={16} />
          </button>
        </div>
      }
    >
      <motion.div 
        className="flex flex-col"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          perspective: 1000
        }}
      >
        {/* Current Mood Display */}
        <motion.div 
          className="flex flex-col items-center justify-center mb-6 relative"
          style={{
            rotateX,
            rotateY,
          }}
        >
          <motion.div
            animate={controls}
            className="text-7xl mb-3 filter drop-shadow-lg"
          >
            {moodData[value - 1]?.emoji || "😐"}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-gray-700 dark:text-gray-200 font-semibold mb-1"
          >
            {moodData[value - 1]?.label || "Neutral"}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="text-gray-500 dark:text-gray-400 text-sm text-center max-w-xs"
          >
            {moodData[value - 1]?.description || "Neither particularly happy nor sad"}
          </motion.div>
          
          {isAnimating && (
            <motion.div
              className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent rounded-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          )}
        </motion.div>

        {/* Interactive Mood Selector */}
        <motion.div 
          className="flex justify-center items-center mb-6 gap-1 md:gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {moodData.map((mood, index) => (
            <motion.button
              key={index}
              type="button"
              onClick={() => handleMoodSelect(index + 1)}
              whileHover={{ scale: 1.15, y: -5 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                scale: value === index + 1 ? 1.1 : 1,
                y: value === index + 1 ? -3 : 0
              }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className={`text-2xl md:text-3xl p-1 md:p-2 rounded-full ${value === index + 1 ? 'bg-opacity-20 bg-gray-200 dark:bg-gray-700 shadow-md' : ''}`}
            >
              {mood.emoji}
            </motion.button>
          ))}
        </motion.div>
        
        {/* Mood History Chart */}
        <motion.div 
          className="h-36 md:h-48 overflow-hidden relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={formattedData}
              margin={{ top: 5, right: 10, left: 10, bottom: 20 }}
            >
              <defs>
                {moodData.map((mood, index) => (
                  <linearGradient key={index} id={`moodGradient${index + 1}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={mood.color} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={mood.color} stopOpacity={0.5} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                height={30}
              />
              <YAxis domain={[0, 5]} hide />
              <Tooltip 
                formatter={(value: any) => [
                  `${moodData[Number(value) - 1]?.label || "Neutral"} ${moodData[Number(value) - 1]?.emoji || "😐"}`, 
                  'Mood'
                ]}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(5px)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                  border: 'none',
                  padding: '12px',
                }}
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              />
              <Bar 
                dataKey="value" 
                radius={[8, 8, 0, 0]} 
                animationDuration={1200}
                animationEasing="ease-in-out"
              >
                {formattedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={`url(#moodGradient${entry.value})`}
                    stroke={entry.color}
                    strokeWidth={1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
        
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800"
        >
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Average</div>
              <div className="flex justify-center mt-1">
                {(() => {
                  const avg = formattedData.reduce((sum, item) => sum + item.value, 0) / formattedData.length;
                  const avgIndex = Math.round(avg) - 1;
                  return (
                    <motion.div 
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="text-xl"
                    >
                      {avgIndex >= 0 && avgIndex < moodData.length ? moodData[avgIndex].emoji : '😐'}
                    </motion.div>
                  );
                })()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Lowest</div>
              <div className="flex justify-center mt-1">
                {(() => {
                  const min = Math.min(...formattedData.map(item => item.value));
                  return (
                    <motion.div 
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="text-xl"
                    >
                      {moodData[min - 1]?.emoji || "😐"}
                    </motion.div>
                  );
                })()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Highest</div>
              <div className="flex justify-center mt-1">
                {(() => {
                  const max = Math.max(...formattedData.map(item => item.value));
                  return (
                    <motion.div 
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="text-xl"
                    >
                      {moodData[max - 1]?.emoji || "😐"}
                    </motion.div>
                  );
                })()}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </MetricCard>
  );
};

export default MoodCard;