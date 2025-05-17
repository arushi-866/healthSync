import React, { ReactNode, useState } from 'react';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

interface MetricCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  extraControls?: ReactNode;
  infoContent?: ReactNode;
  accentColor?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  icon,
  children,
  className,
  onClick,
  extraControls,
  infoContent,
  accentColor,
  variant = 'default',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  // Define variant-based styles
  const variantStyles = {
    default: {
      gradient: "from-blue-500 to-indigo-600",
      glow: "0 0 15px rgba(99, 102, 241, 0.5)",
      icon: "text-indigo-500 dark:text-indigo-400"
    },
    success: {
      gradient: "from-emerald-500 to-green-600",
      glow: "0 0 15px rgba(16, 185, 129, 0.5)",
      icon: "text-emerald-500 dark:text-emerald-400"
    },
    warning: {
      gradient: "from-amber-500 to-yellow-600",
      glow: "0 0 15px rgba(245, 158, 11, 0.5)",
      icon: "text-amber-500 dark:text-amber-400"
    },
    danger: {
      gradient: "from-rose-500 to-red-600",
      glow: "0 0 15px rgba(225, 29, 72, 0.5)",
      icon: "text-rose-500 dark:text-rose-400"
    },
    info: {
      gradient: "from-cyan-500 to-sky-600",
      glow: "0 0 15px rgba(14, 165, 233, 0.5)",
      icon: "text-cyan-500 dark:text-cyan-400"
    }
  };
  
  const selectedVariant = variantStyles[variant];
  
  // Particle animation setup
  const particles = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 2
  }));
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        mass: 1.2
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: isHovered ? 
          `0 20px 40px -12px rgba(16, 37, 66, 0.2), 0 10px 20px -12px rgba(16, 37, 66, 0.12), ${selectedVariant.glow}` : 
          "0 16px 40px -8px rgba(16, 37, 66, 0.18), 0 8px 20px -8px rgba(16, 37, 66, 0.10)",
        transition: { duration: 0.25 },
      }}
      whileTap={{ 
        scale: 0.98, 
        boxShadow: "0 8px 20px -8px rgba(16, 37, 66, 0.12), 0 4px 10px -4px rgba(16, 37, 66, 0.08)" 
      }}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTapStart={() => setIsPressed(true)}
      onTap={() => setTimeout(() => setIsPressed(false), 200)}
      onTapCancel={() => setIsPressed(false)}
      className={cn(
        "bg-white dark:bg-gray-800/90 backdrop-blur-sm backdrop-saturate-150",
        "rounded-2xl",
        "border border-gray-100 dark:border-gray-700",
        "overflow-hidden",
        "h-full",
        "transition-all duration-300",
        "min-w-[28rem] max-w-2xl w-full sm:min-w-[32rem] sm:max-w-3xl",
        "cursor-pointer",
        "relative",
        "will-change-transform",
        className
      )}
      tabIndex={0}
      aria-label={title}
      style={{ 
        boxShadow: "0 10px 30px -8px rgba(16, 37, 66, 0.15), 0 5px 15px -5px rgba(16, 37, 66, 0.08)",
      }}
    >
      {/* Background gradient effect */}
      <motion.div 
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0", 
          selectedVariant.gradient
        )}
        animate={{ 
          opacity: isHovered ? 0.05 : 0,
          scale: isHovered ? 1.05 : 1
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Particle effects visible on hover */}
      <AnimatePresence>
        {isHovered && particles.map(particle => (
          <motion.div
            key={particle.id}
            className={cn(
              "absolute rounded-full bg-white dark:bg-gray-200 opacity-30",
              "pointer-events-none"
            )}
            initial={{ 
              x: `${particle.x}%`, 
              y: `${particle.y}%`, 
              scale: 0,
              opacity: 0 
            }}
            animate={{ 
              x: [
                `${particle.x}%`, 
                `${particle.x + (Math.random() * 20 - 10)}%`, 
                `${particle.x + (Math.random() * 20 - 10)}%`
              ],
              y: [
                `${particle.y}%`, 
                `${particle.y - (Math.random() * 30 + 10)}%`, 
                `${particle.y - (Math.random() * 50 + 30)}%`
              ],
              scale: [0, Math.random() * 0.5 + 0.5, 0],
              opacity: [0, 0.7, 0] 
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              duration: 1.5 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut"
            }}
            style={{ 
              width: `${particle.size}px`, 
              height: `${particle.size}px`,
              filter: "blur(1px)"
            }}
          />
        ))}
      </AnimatePresence>
      
      {/* Glow effect on edges */}
      <motion.div 
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{ 
          boxShadow: isHovered ? 
            `inset 0 0 0 1px rgba(255,255,255,0.2), ${selectedVariant.glow}` : 
            'inset 0 0 0 1px rgba(255,255,255,0)' 
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Main content container */}
      <div className="p-6 sm:p-8 h-full flex flex-col relative z-10">
        <div className="flex items-center justify-between mb-6">
          <motion.h3
            className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {title}
          </motion.h3>
          <div className="flex items-center space-x-3">
            {extraControls && (
              <motion.div 
                className="ml-1"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {extraControls}
              </motion.div>
            )}
            
            {infoContent && (
              <motion.button
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowInfo(!showInfo);
                }}
                aria-label="Show more information"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </motion.button>
            )}
            
            <motion.div
              className={cn("transition-colors", selectedVariant.icon)}
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.9, rotate: -5 }}
              animate={{ 
                y: isPressed ? [0, -5, 0] : 0,
                scale: isPressed ? [1, 1.2, 1] : 1,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {icon}
            </motion.div>
          </div>
        </div>
        
        {/* Info overlay */}
        <AnimatePresence>
          {showInfo && infoContent && (
            <motion.div
              className="absolute inset-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm z-20 p-6 sm:p-8 flex flex-col"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100">About this metric</h4>
                <motion.button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInfo(false);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </motion.button>
              </div>
              <div className="flex-grow overflow-auto">
                {infoContent}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main content area */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={`content-${variant}`}
            className="mt-2 flex-grow flex flex-col justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
        
        {/* Bottom accent bar */}
        <div className="relative w-full h-1 mt-6 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
          <motion.div 
            className={cn(
              "absolute top-0 left-0 h-full bg-gradient-to-r",
              selectedVariant.gradient
            )}
            initial={{ width: "0%" }}
            animate={{ 
              width: isHovered ? "100%" : "85%",
              transition: { duration: isHovered ? 0.6 : 1.5 }
            }}
          />
          
          <motion.div
            className="absolute top-0 left-0 h-full w-20 bg-white/30 skew-x-30 -translate-x-32"
            animate={{
              translateX: isHovered ? ["0%", "200%"] : ["0%", "0%"],
            }}
            transition={{
              duration: 0.8,
              repeat: isHovered ? Infinity : 0,
              repeatType: "loop",
              ease: "easeInOut",
              delay: 0.2
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;