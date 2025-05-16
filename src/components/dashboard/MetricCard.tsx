import React, { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  extraControls?: ReactNode;
  infoContent?: ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  icon,
  children,
  className,
  onClick,
  extraControls,
  infoContent,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        y: -7,
        boxShadow:
          "0 16px 40px -8px rgba(16, 37, 66, 0.18), 0 8px 20px -8px rgba(16, 37, 66, 0.10)",
        transition: { duration: 0.18 },
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        "bg-white dark:bg-gray-800",
        "rounded-2xl shadow-lg hover:shadow-2xl",
        "border border-gray-100 dark:border-gray-700",
        "overflow-hidden",
        "h-full",
        "transition-all duration-300",
        "min-w-[28rem] max-w-2xl w-full sm:min-w-[32rem] sm:max-w-3xl",
        "cursor-pointer",
        className
      )}
      tabIndex={0}
      aria-label={title}
    >
      <div className="p-6 sm:p-8 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <motion.h3
            className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight"
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {title}
          </motion.h3>
          <div className="flex items-center space-x-2">
            {extraControls && (
              <div className="ml-1">{extraControls}</div>
            )}
            <motion.div
              className="text-primary-500 dark:text-primary-400"
              whileHover={{ scale: 1.13 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {icon}
            </motion.div>
          </div>
        </div>
        <div className="mt-2 flex-grow flex flex-col justify-center">
          {children}
        </div>
        <motion.div
          className="w-full h-1 bg-gradient-to-r from-transparent via-primary-500/30 to-transparent mt-6 rounded-full"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        />
      </div>
    </motion.div>
  );
};

export default MetricCard;