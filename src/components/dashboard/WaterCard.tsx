import React from 'react';
import { Droplets } from 'lucide-react';
import MetricCard from './MetricCard';
import { motion } from 'framer-motion';

interface WaterCardProps {
  value: number;
  goal: number;
}

const WaterCard: React.FC<WaterCardProps> = ({ value, goal }) => {
  // Calculate progress percentage
  const progress = Math.min((value / goal) * 100, 100);
  
  // Generate cup icons
  const cups = Array.from({ length: goal }, (_, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: index < value ? 1 : 0.3, 
        scale: index < value ? 1 : 0.9 
      }}
      transition={{ 
        delay: index * 0.05,
        duration: 0.2
      }}
      className={`text-xl ${index < value ? 'text-primary-500' : 'text-gray-300 dark:text-gray-600'}`}
    >
      💧
    </motion.div>
  ));
  
  return (
    <MetricCard title="Water Intake" icon={<Droplets />}>
      <div className="flex flex-col items-center">
        <div className="mb-4 relative flex items-center justify-center">
          <svg width="120" height="120" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
              className="dark:stroke-gray-700"
            />
            {/* Progress circle */}
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#0ca5e9"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 54}`}
              strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
              initial={{ strokeDashoffset: `${2 * Math.PI * 54}` }}
              animate={{ strokeDashoffset: `${2 * Math.PI * 54 * (1 - progress / 100)}` }}
              transition={{ duration: 1, ease: "easeOut" }}
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <motion.span 
              key={value}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-semibold text-gray-800 dark:text-gray-100"
            >
              {value}
            </motion.span>
            <span className="text-sm text-gray-500 dark:text-gray-400">of {goal} cups</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 justify-center mt-2">
          {cups}
        </div>
      </div>
    </MetricCard>
  );
};

export default WaterCard;