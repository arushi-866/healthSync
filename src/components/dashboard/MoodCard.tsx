import React from 'react';
import { Smile } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import MetricCard from './MetricCard';
import { motion } from 'framer-motion';

interface MoodCardProps {
  value: number;
  history: Array<{ date: string; value: number }>;
}

const MoodCard: React.FC<MoodCardProps> = ({ value, history }) => {
  // Emoji mapping for mood values
  const moodEmojis = ["😢", "😔", "😐", "🙂", "😄"];
  
  // Format dates for display
  const formattedData = history.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
  }));
  
  return (
    <MetricCard title="Mood" icon={<Smile />}>
      <div className="flex flex-col">
        <div className="flex justify-center mb-4">
          <motion.div
            key={value}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-4xl"
          >
            {moodEmojis[value - 1]}
          </motion.div>
        </div>
        
        <div className="h-32 md:h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData}>
              <XAxis dataKey="date" axisLine={false} tickLine={false} />
              <YAxis domain={[0, 5]} hide />
              <Tooltip 
                formatter={(value) => [`Mood: ${moodEmojis[Number(value) - 1]}`, '']}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  border: 'none',
                }}
              />
              <Bar 
                dataKey="value" 
                fill="#f97316" 
                radius={[4, 4, 0, 0]} 
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </MetricCard>
  );
};

export default MoodCard;