import React, { useState, useEffect } from 'react';
import { Heart, Info } from 'lucide-react';
import { LineChart, Line, XAxis, ResponsiveContainer } from 'recharts';
import MetricCard from './MetricCard';
import { motion, AnimatePresence } from 'framer-motion';

interface HeartRateCardProps {
  value: number;
  history: Array<{ date: string; value: number }>;
  onShowTip?: () => void; // <-- add this line
}

const heartTips = [
  "Tip: A normal resting heart rate for adults ranges from 60 to 100 BPM.",
  "Tip: Regular exercise can help lower your resting heart rate.",
  "Tip: Deep breathing and relaxation can reduce heart rate spikes.",
  "Tip: Stay hydrated for a healthier heart rhythm.",
  "Tip: Monitor your heart rate trends for early signs of health issues."
];

const HeartRateCard: React.FC<HeartRateCardProps> = ({ value, history, onShowTip }) => {
  // Generate data for the pulse graph (more detailed points for visualization)
  const generatePulseData = () => {
    const points = [];
    const cycles = 15; // Number of heartbeat cycles to show
    for (let i = 0; i < cycles * 10; i++) {
      const x = i / 10;
      let y;
      const mod = x % 1;
      if (mod < 0.1) {
        y = mod * 10; // Rising edge
      } else if (mod < 0.2) {
        y = 1 - (mod - 0.1) * 10; // Falling edge 1
      } else if (mod < 0.4) {
        y = 0; // Flat line
      } else if (mod < 0.5) {
        y = (mod - 0.4) * 8; // Rising edge 2
      } else if (mod < 0.6) {
        y = 0.8 - (mod - 0.5) * 8; // Falling edge 2
      } else {
        y = 0; // Flat line
      }
      y = y * (0.8 + Math.random() * 0.4);
      points.push({ x, y });
    }
    return points;
  };

  // Enhanced stats
  const bestDay = history.length ? Math.max(...history.map((h) => h.value)) : value;
  const worstDay = history.length ? Math.min(...history.map((h) => h.value)) : value;
  const avg = history.length ? Math.round(history.reduce((sum, h) => sum + h.value, 0) / history.length) : value;

  const pulseData = generatePulseData();

  return (
    <MetricCard 
      title="Heart Rate" 
      icon={
        <motion.div
          whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <Heart className="text-error-500" />
        </motion.div>
      }
      extraControls={
        <div className="flex space-x-1">
          <button
            type="button"
            onClick={onShowTip} // <-- show alert at the top
            className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors relative z-50"
            style={{ position: 'relative', zIndex: 50 }}
            aria-label="Show heart rate info"
          >
            <Info size={16} />
          </button>
        </div>
      }
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-center mb-2">
          <motion.div
            key={value}
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: [1.1, 1], opacity: 1 }}
            transition={{ duration: 0.3, times: [0, 1] }}
            className="flex items-baseline"
          >
            <span className="text-3xl font-semibold text-error-500">
              {value}
            </span>
            <span className="ml-1 text-gray-500 dark:text-gray-400 text-lg">
              BPM
            </span>
          </motion.div>
        </div>
        
        {/* Heartbeat animation */}
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pulseData}>
              <XAxis dataKey="x" hide />
              <Line 
                type="monotone" 
                dataKey="y" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Enhanced stats section */}
        <motion.div
          className="grid grid-cols-3 gap-4 mt-4 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Best</span>
            <span className="text-lg font-semibold text-green-500">
              {bestDay}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Avg</span>
            <span className="text-lg font-semibold text-blue-500">
              {avg}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Worst</span>
            <span className="text-lg font-semibold text-red-500">
              {worstDay}
            </span>
          </div>
        </motion.div>

        {/* Resting heart rate label */}
        <div className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          Resting Heart Rate
        </div>

        {/* Heart health tip */}
        <AnimatePresence mode="wait">
          <motion.div
            key={value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.8, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="mt-3 text-xs text-center text-gray-500 dark:text-gray-400 italic px-4"
            onClick={() => {}}
            style={{ cursor: 'pointer' }}
            title="Click for another tip"
          >
            {heartTips[Math.floor(Math.random() * heartTips.length)]}
          </motion.div>
        </AnimatePresence>
      </div>
    </MetricCard>
  );
};

export default HeartRateCard;