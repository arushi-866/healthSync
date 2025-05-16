import React from 'react';
import { Activity, Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import SyncButton from './SyncButton';
import { cn } from '../utils/cn';

interface HeaderProps {
  onSync: () => void;
  loading: boolean;
}

const Header: React.FC<HeaderProps> = ({ onSync, loading }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className={cn(
      "sticky top-0 z-10 w-full",
      "bg-white dark:bg-gray-900",
      "border-b border-gray-200 dark:border-gray-800",
      "transition-colors duration-200",
      "px-4 py-3 sm:px-6"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            HealthSync
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <SyncButton onClick={onSync} loading={loading} />
          
          <button
            onClick={toggleTheme}
            className={cn(
              "p-2 rounded-full",
              "bg-gray-100 dark:bg-gray-800",
              "text-gray-700 dark:text-gray-300",
              "hover:bg-gray-200 dark:hover:bg-gray-700",
              "focus:outline-none focus:ring-2 focus:ring-primary-500",
              "transition-colors duration-200"
            )}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;