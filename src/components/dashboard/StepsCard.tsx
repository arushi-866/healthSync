import React from 'react';
import { FootprintsIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import MetricCard from './MetricCard';
import { motion } from 'framer-motion';

interface StepsCardProps {
  value: number;
  goal: number;
  history: Array<{ date: string; value: number }>;
}

const StepsCard: React.FC<StepsCardProps> = ({ value, goal, history }) => {
  // Format dates for display
  const formattedData = history.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
    // Add percentage calculation for each day
    percentage: Math.round((item.value / goal) * 100),
  }));
  
  // Calculate progress percentage
  const progress = Math.min((value / goal) * 100, 100);
  
  return (
    <MetricCard title="Steps" icon={<FootprintsIcon />}>
      <div className="flex flex-col">
        <div className="flex justify-between items-baseline mb-2">
          <motion.div 
            key={value}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-baseline"
          >
            <span className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              {value.toLocaleString()}
            </span>
            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
              steps
            </span>
          </motion.div>
          
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Goal: {goal.toLocaleString()}
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
          <motion.div
            className="h-2 bg-success-500 rounded-full"
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        
        <div className="h-32 md:h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData}>
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false}
                fontSize={12}
              />
              <YAxis hide />
              <Tooltip 
                formatter={(value) => [`${value.toLocaleString()} steps`, '']}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  border: 'none',
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={1000}>
                {formattedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.percentage >= 100 ? '#22c55e' : '#0ca5e9'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </MetricCard>
  );
};

export default StepsCard;