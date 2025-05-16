import React from 'react';
import { Moon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import MetricCard from './MetricCard';
import { motion } from 'framer-motion';

interface SleepCardProps {
  value: number;
  history: Array<{ date: string; value: number }>;
}

const SleepCard: React.FC<SleepCardProps> = ({ value, history }) => {
  // Format dates for display
  const formattedData = history.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
  }));
  
  return (
    <MetricCard title="Sleep" icon={<Moon />}>
      <div className="flex flex-col">
        <motion.div 
          key={value}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center items-center mb-4"
        >
          <span className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
            {value}
          </span>
          <span className="ml-1 text-gray-500 dark:text-gray-400 text-lg">
            hours
          </span>
        </motion.div>
        
        <div className="h-32 md:h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                stroke="#9ca3af"
              />
              <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip 
                formatter={(value) => [`${value} hours`, 'Sleep']}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  border: 'none',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#0ca5e9" 
                strokeWidth={2}
                dot={{ fill: '#0ca5e9', r: 4 }}
                activeDot={{ r: 6, fill: '#0ca5e9' }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </MetricCard>
  );
};

export default SleepCard;