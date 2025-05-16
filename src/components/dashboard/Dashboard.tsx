import React from 'react';
import { HealthData } from '../../hooks/useHealthData';
import MoodCard from './MoodCard';
import SleepCard from './SleepCard';
import WaterCard from './WaterCard';
import StepsCard from './StepsCard';
import HeartRateCard from './HeartRateCard';
import WeightCard from './WeightCard';
import HealthScoreCard from './HealthScoreCard';
import OverlayChart from './OverlayChart';
import { motion } from 'framer-motion';

interface DashboardProps {
  healthData: HealthData;
}

const Dashboard: React.FC<DashboardProps> = ({ healthData }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto py-6 px-4 sm:px-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Health Score */}
        <HealthScoreCard score={healthData.healthScore} />
        
        {/* Mood Card */}
        <MoodCard 
          value={healthData.mood.value} 
          history={healthData.mood.history} 
        />
        
        {/* Sleep Card */}
        <SleepCard 
          value={healthData.sleep.value}
          history={healthData.sleep.history}
        />
        
        {/* Water Card */}
        <WaterCard 
          value={healthData.water.value}
          goal={healthData.water.goal}
        />
        
        {/* Steps Card */}
        <StepsCard 
          value={healthData.steps.value}
          goal={healthData.steps.goal}
          history={healthData.steps.history}
        />
        
        {/* Heart Rate Card */}
        <HeartRateCard 
          value={healthData.heartRate.value}
          history={healthData.heartRate.history}
        />
        
        {/* Weight Card */}
        <WeightCard 
          value={healthData.weight.value}
          history={healthData.weight.history}
        />
        
        {/* Metrics Overlay Chart */}
        <OverlayChart healthData={healthData} />
      </div>
    </motion.div>
  );
};

export default Dashboard;