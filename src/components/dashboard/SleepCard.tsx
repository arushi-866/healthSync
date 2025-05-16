import React, { useState, useEffect, useRef } from 'react';
import { Moon, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import MetricCard from './MetricCard';
import { motion, AnimatePresence } from 'framer-motion';

interface SleepCardProps {
  value: number;
  history: Array<{ date: string; value: number }>;
}

const SleepCard: React.FC<SleepCardProps> = ({ value, history }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [prevValue, setPrevValue] = useState(value);
  const [showPulse, setShowPulse] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Calculate sleep trends
  const trend = value > (history[history.length - 2]?.value || 0) ? 'up' : 'down';
  const averageSleep = history.reduce((sum, item) => sum + item.value, 0) / history.length;
  
  // Format dates for display
  const formattedData = history.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
    quality: getQualityIndicator(item.value),
  }));
  
  function getQualityIndicator(hours: number) {
    if (hours < 6) return "poor";
    if (hours < 7) return "fair";
    if (hours < 9) return "good";
    return "excellent";
  }
  
  // Colors based on sleep quality
  const qualityColors = {
    poor: "#ef4444",
    fair: "#f97316",
    good: "#0ca5e9",
    excellent: "#22c55e"
  };
  
  const sleepQuality = getQualityIndicator(value);
  const sleepColor = qualityColors[sleepQuality];
  
  // Handle value change animation
  useEffect(() => {
    if (value !== prevValue) {
      setShowPulse(true);
      setTimeout(() => {
        setShowPulse(false);
        setPrevValue(value);
      }, 1000);
    }
  }, [value, prevValue]);
  
  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [tooltipRef]);

  const toggleTooltip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTooltip(!showTooltip);
  };

  return (
    <MetricCard 
      title="Sleep" 
      icon={
        <motion.div
          animate={{ rotate: isHovered ? [0, 10, -10, 0] : 0, scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.5 }}
        >
          <Moon className="text-blue-400" />
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
                  className="absolute top-full mt-2 right-0 w-64 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-[9999] text-left border border-gray-200 dark:border-gray-700"
                  style={{ pointerEvents: 'auto' }}
                >
                  <h5 className="font-medium mb-1 text-gray-800 dark:text-gray-200">About Sleep</h5>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    This card tracks your nightly sleep duration and quality. 
                    Aim for 7-9 hours of good quality sleep for optimal health. 
                    The colored dots represent sleep quality for each day.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      }
    >
      <motion.div 
        className="flex flex-col"
        whileHover={{ scale: 1.01 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center items-center mb-6 relative">
          <AnimatePresence mode="wait">
            <motion.div 
              key={value}
              className="flex items-baseline"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 15 
              }}
            >
              <span 
                className="text-4xl font-semibold mr-1"
                style={{ color: sleepColor }}
              >
                {value}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-xl">
                hours
              </span>
            </motion.div>
          </AnimatePresence>
          
          {showPulse && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: sleepColor }}
              initial={{ scale: 0.8, opacity: 0.7 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 1 }}
            />
          )}
          
          <motion.div
            className="absolute -top-1 -right-1 flex items-center text-sm font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <motion.div
              className="flex items-center px-2 py-1 rounded-full text-white"
              style={{ backgroundColor: sleepColor }}
              whileHover={{ scale: 1.05 }}
            >
              {sleepQuality.charAt(0).toUpperCase() + sleepQuality.slice(1)}
              {trend === 'up' ? (
                <motion.span
                  className="ml-1"
                  animate={{ y: [0, -2, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  ↑
                </motion.span>
              ) : (
                <motion.span
                  className="ml-1"
                  animate={{ y: [0, 2, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  ↓
                </motion.span>
              )}
            </motion.div>
          </motion.div>
        </div>
        
        <motion.div 
          className="h-32 md:h-48"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={formattedData}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="sleepColorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ca5e9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0ca5e9" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              
                <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <YAxis 
                hide 
                domain={[
                  (dataMin: number) => Math.max(0, dataMin - 1), 
                  (dataMax: number) => Math.min(12, dataMax + 1)
                ]} 
                />

                <Tooltip 
                content={(props) => {
                  const { active, payload } = props;
                  if (
                    active &&
                    payload &&
                    payload.length &&
                    payload[0].payload &&
                    typeof payload[0].payload.value === 'number' &&
                    typeof payload[0].payload.quality === 'string'
                  ) {
                    const { value, quality } = payload[0].payload as {
                      value: number;
                      quality: keyof typeof qualityColors;
                    };
                    return (
                      <div
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '12px',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                          border: 'none',
                          padding: '12px',
                          color: qualityColors[quality]
                        }}
                      >
                        <div>
                          <strong>{value} hours</strong> <span style={{ fontSize: '12px' }}>({quality})</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
                cursor={{ stroke: '#9ca3af', strokeDasharray: '3 3' }}
              />
              
              {/* Reference line for average sleep */}
              <ReferenceLine 
                y={averageSleep} 
                stroke="#9ca3af" 
                strokeDasharray="3 3"
                label={{ 
                  value: 'Avg', 
                  position: 'insideTopRight',
                  fill: '#9ca3af',
                  fontSize: 10
                }}
              />
              
              {/* Ideal sleep range */}
              <ReferenceLine 
                y={7} 
                stroke="#22c55e" 
                strokeDasharray="2 4"
                strokeOpacity={0.6}
                label={{ 
                  value: 'Ideal', 
                  position: 'insideTopLeft',
                  fill: '#22c55e',
                  fontSize: 10
                }}
              />
              
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#0ca5e9" 
                strokeWidth={3}
                dot={(props: any) => {
                  const quality = props.payload.quality as keyof typeof qualityColors;
                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={5}
                      fill={qualityColors[quality]}
                      stroke="white"
                      strokeWidth={2}
                    />
                  );
                }}
                activeDot={(props: any) => {
                  const quality = props.payload.quality as keyof typeof qualityColors;
                  // Use motion's custom component for SVG
                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={7}
                      fill={qualityColors[quality]}
                      stroke="white"
                      strokeWidth={2}
                      style={{
                        transformOrigin: `${props.cx}px ${props.cy}px`,
                        animation: 'pulse 1s infinite'
                      }}
                    />
                  );
                }}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Add stats to fill empty space */}
        <motion.div
          className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Average</span>
            <span className="text-lg font-semibold text-blue-500">{averageSleep.toFixed(1)} hrs</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Best Night</span>
            <span className="text-lg font-semibold text-green-500">
              {Math.max(...history.map(h => h.value))} hrs
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Worst Night</span>
            <span className="text-lg font-semibold text-red-500">
              {Math.min(...history.map(h => h.value))} hrs
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Quality</span>
            <span className="text-lg font-semibold" style={{ color: sleepColor }}>
              {sleepQuality.charAt(0).toUpperCase() + sleepQuality.slice(1)}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </MetricCard>
  );
};

export default SleepCard;