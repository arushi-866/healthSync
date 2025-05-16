import React from 'react';
import { Heart } from 'lucide-react';
import { LineChart, Line, XAxis, ResponsiveContainer } from 'recharts';
import MetricCard from './MetricCard';
import { motion } from 'framer-motion';

interface HeartRateCardProps {
  value: number;
  history: Array<{ date: string; value: number }>;
}

const HeartRateCard: React.FC<HeartRateCardProps> = ({ value, history }) => {
  // Generate data for the pulse graph (more detailed points for visualization)
  const generatePulseData = () => {
    // Base on the current heart rate value but add some random variation
    const points = [];
    const cycles = 15; // Number of heartbeat cycles to show
    
    for (let i = 0; i < cycles * 10; i++) {
      const x = i / 10;
      
      // Create a heartbeat-like wave pattern
      let y;
      const mod = x % 1;
      
      if (mod < 0.1) {
        y = mod * 10; // Rising edge
      } else if (mod < 0.2) {
        y = 1 - (mod - 0.1) * 10; // Falling edge 1
      } else if (mod < 0.4) {
        y = 0; // Flat line
      } else if (mod < 0.5) {
        y = (mod - 0.4) * 8; // Rising edge 2
      } else if (mod < 0.6) {
        y = 0.8 - (mod - 0.5) * 8; // Falling edge 2
      } else {
        y = 0; // Flat line
      }
      
      // Add some random variation
      y = y * (0.8 + Math.random() * 0.4);
      
      points.push({ x, y });
    }
    
    return points;
  };
  
  const pulseData = generatePulseData();
  
  return (
    <MetricCard 
      title="Heart Rate" 
      icon={<Heart className="text-error-500" />}
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-center mb-2">
          <motion.div
            key={value}
            initial={{ scale: 1, opacity: 1 }}
            animate={[
              { scale: 1.1, opacity: 1, transition: { duration: 0.15 } },
              { scale: 1, opacity: 1, transition: { duration: 0.15 } },
            ]}
            className="flex items-baseline"
          >
            <span className="text-3xl font-semibold text-error-500">
              {value}
            </span>
            <span className="ml-1 text-gray-500 dark:text-gray-400 text-lg">
              BPM
            </span>
          </motion.div>
        </div>
        
        {/* Heartbeat animation */}
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pulseData}>
              <XAxis dataKey="x" hide />
              <Line 
                type="monotone" 
                dataKey="y" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Resting heart rate label */}
        <div className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          Resting Heart Rate
        </div>
      </div>
    </MetricCard>
  );
};

export default HeartRateCard;