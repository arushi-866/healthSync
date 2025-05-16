import React, { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  icon, 
  children,
  className 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-white dark:bg-gray-800",
        "rounded-xl shadow-sm",
        "border border-gray-100 dark:border-gray-700",
        "overflow-hidden",
        "h-full",
        className
      )}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {title}
          </h3>
          <div className="text-primary-500 dark:text-primary-400">
            {icon}
          </div>
        </div>
        
        <div className="mt-2">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;