import React from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

interface SyncButtonProps {
  onClick: () => void;
  loading: boolean;
}

const SyncButton: React.FC<SyncButtonProps> = ({ onClick, loading }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={cn(
        "flex items-center space-x-2",
        "px-4 py-2 rounded-full",
        "bg-primary-500 hover:bg-primary-600",
        "text-white font-medium",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        "transition-colors duration-200",
        "disabled:opacity-70 disabled:cursor-not-allowed"
      )}
    >
      <motion.div
        animate={{ rotate: loading ? 360 : 0 }}
        transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
      >
        <RefreshCw className="h-4 w-4" />
      </motion.div>
      <span>{loading ? 'Syncing...' : 'Sync Device'}</span>
    </button>
  );
};

export default SyncButton;