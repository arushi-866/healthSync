import React from 'react';
import { Medal } from 'lucide-react';
import MetricCard from './MetricCard';
import { motion } from 'framer-motion';

interface HealthScoreCardProps {
  score: number;
}

const HealthScoreCard: React.FC<HealthScoreCardProps> = ({ score }) => {
  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 80) return 'text-success-500';
    if (score >= 60) return 'text-primary-500';
    if (score >= 40) return 'text-warning-500';
    return 'text-error-500';
  };
  
  // Determine message based on score
  const getScoreMessage = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };
  
  return (
    <MetricCard title="Health Score" icon={<Medal />}>
      <div className="flex flex-col items-center">
        <motion.div 
          className="relative mb-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.6 
          }}
        >
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
            {/* Score circle */}
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={score >= 80 ? '#22c55e' : score >= 60 ? '#0ca5e9' : score >= 40 ? '#f59e0b' : '#ef4444'}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 54}`}
              strokeDashoffset={`${2 * Math.PI * 54 * (1 - score / 100)}`}
              initial={{ strokeDashoffset: `${2 * Math.PI * 54}` }}
              animate={{ strokeDashoffset: `${2 * Math.PI * 54 * (1 - score / 100)}` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              key={score}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className={`text-4xl font-bold ${getScoreColor()}`}
            >
              {score}
            </motion.span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              out of 100
            </span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.3 }}
          className={`text-lg font-medium ${getScoreColor()}`}
        >
          {getScoreMessage()}
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.3 }}
          className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2"
        >
          Based on your recent activity
        </motion.p>
      </div>
    </MetricCard>
  );
};

export default HealthScoreCard;