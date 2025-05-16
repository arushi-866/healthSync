import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

interface SyncButtonProps {
  onClick: () => void;
  loading: boolean;
  appearance?: 'default' | 'enhanced';
  size?: 'default' | 'small';
  lastSynced?: Date | null;
}

const SyncButton: React.FC<SyncButtonProps> = ({
  onClick,
  loading,
  appearance = 'default',
  size = 'default',
  lastSynced
}) => {
  const [syncAnimation, setSyncAnimation] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show animation for successful sync
    if (!loading && lastSynced) {
      setSyncAnimation(true);
      const timer = setTimeout(() => setSyncAnimation(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [loading, lastSynced]);

  const getFormattedTime = () => {
    if (!lastSynced) return 'Never synced';
    
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastSynced.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes === 1) return '1 minute ago';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    
    const hours = Math.floor(diffMinutes / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    
    return lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderSyncIcon = () => (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={cn(
        "w-5 h-5",
        size === 'small' && "w-4 h-4"
      )}
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 21h5v-5" />
    </svg>
  );

  const renderSuccessAnimation = () => (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="text-green-500"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={cn(
          "w-5 h-5",
          size === 'small' && "w-4 h-4"
        )}
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </motion.div>
  );

  if (appearance === 'enhanced') {
    return (
      <div className="relative inline-block">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          disabled={loading}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={cn(
            "relative overflow-hidden",
            "px-4 py-2 rounded-full",
            "bg-gradient-to-r from-blue-500 to-indigo-600",
            "text-white font-medium",
            "flex items-center justify-center space-x-2",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            "shadow-md hover:shadow-lg",
            "transition-all duration-300",
            loading && "opacity-90 cursor-not-allowed",
            size === 'small' && "px-3 py-1.5 text-sm"
          )}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                exit={{ opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Loader2 className={cn(
                  "h-5 w-5", 
                  size === 'small' && "h-4 w-4"
                )} />
              </motion.div>
            ) : syncAnimation ? (
              renderSuccessAnimation()
            ) : (
              <motion.div
                key="sync"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {renderSyncIcon()}
              </motion.div>
            )}
          </AnimatePresence>
          
          <span>Sync</span>
          
          {/* Animated background gradient */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0"
            animate={{ opacity: loading ? 0.5 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
        
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && lastSynced && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50"
            >
              Last synced: {getFormattedTime()}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Default appearance
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={cn(
        "flex items-center gap-2", // <-- Add flex and gap for icon + text
        "p-2 rounded-full",
        "bg-primary-50 dark:bg-primary-900/20",
        "text-primary-600 dark:text-primary-400",
        "hover:bg-primary-100 dark:hover:bg-primary-900/30",
        "focus:outline-none focus:ring-2 focus:ring-primary-500",
        "transition-colors duration-200",
        loading && "opacity-70 cursor-not-allowed"
      )}
      aria-label="Sync data"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        renderSyncIcon()
      )}
      <span className="font-medium text-sm pr-1 pl-1">Sync Device</span>
    </button>
  );
};

export default SyncButton;