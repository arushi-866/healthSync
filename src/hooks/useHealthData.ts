import { useState, useCallback, useEffect } from 'react';

// Types for health data
export interface HealthData {
  mood: {
    value: number; // 1-5
    history: Array<{ date: string; value: number }>;
  };
  sleep: {
    value: number; // hours
    history: Array<{ date: string; value: number }>;
  };
  water: {
    value: number; // cups (0-8)
    goal: number;
    history: Array<{ date: string; value: number }>;
  };
  steps: {
    value: number;
    goal: number;
    history: Array<{ date: string; value: number }>;
  };
  heartRate: {
    value: number; // BPM
    history: Array<{ date: string; value: number }>;
  };
  weight: {
    value: number; // kg
    history: Array<{ date: string; value: number }>;
  };
  healthScore: number; // 0-100
}

// Function to generate past dates
const generatePastDates = (days: number) => {
  return Array.from({ length: days }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1) + i);
    return date.toISOString().split('T')[0];
  });
};

// Generate random data within realistic ranges
const generateMockData = (): HealthData => {
  const dates = generatePastDates(7);
  
  // Generate random mood values (1-5)
  const moodHistory = dates.map(date => ({
    date,
    value: Math.floor(Math.random() * 5) + 1,
  }));
  
  // Generate random sleep hours (4-10 hours)
  const sleepHistory = dates.map(date => ({
    date,
    value: Math.round((Math.random() * 6 + 4) * 10) / 10,
  }));
  
  // Generate random water intake (2-8 cups)
  const waterGoal = 8;
  const waterHistory = dates.map(date => ({
    date,
    value: Math.floor(Math.random() * 7) + 2,
  }));
  
  // Generate random step count (3000-12000 steps)
  const stepGoal = 10000;
  const stepsHistory = dates.map(date => ({
    date,
    value: Math.floor(Math.random() * 9000) + 3000,
  }));
  
  // Generate random heart rate (55-95 BPM)
  const heartRateHistory = dates.map(date => ({
    date,
    value: Math.floor(Math.random() * 40) + 55,
  }));
  
  // Generate random weight (65-75 kg with small variations)
  const baseWeight = 70;
  const weightHistory = dates.map(date => ({
    date,
    value: Math.round((baseWeight + (Math.random() * 10 - 5)) * 10) / 10,
  }));
  
  // Calculate health score based on metrics (simplified calculation)
  const calculateHealthScore = () => {
    const moodScore = (moodHistory[moodHistory.length - 1].value / 5) * 20;
    const sleepScore = Math.min(sleepHistory[sleepHistory.length - 1].value / 8, 1) * 20;
    const waterScore = (waterHistory[waterHistory.length - 1].value / waterGoal) * 20;
    const stepScore = Math.min(stepsHistory[stepsHistory.length - 1].value / stepGoal, 1) * 20;
    const heartRateScore = (1 - Math.abs(heartRateHistory[heartRateHistory.length - 1].value - 70) / 30) * 20;
    return Math.round(moodScore + sleepScore + waterScore + stepScore + heartRateScore);
  };
  
  return {
    mood: {
      value: moodHistory[moodHistory.length - 1].value,
      history: moodHistory,
    },
    sleep: {
      value: sleepHistory[sleepHistory.length - 1].value,
      history: sleepHistory,
    },
    water: {
      value: waterHistory[waterHistory.length - 1].value,
      goal: waterGoal,
      history: waterHistory,
    },
    steps: {
      value: stepsHistory[stepsHistory.length - 1].value,
      goal: stepGoal,
      history: stepsHistory,
    },
    heartRate: {
      value: heartRateHistory[heartRateHistory.length - 1].value,
      history: heartRateHistory,
    },
    weight: {
      value: weightHistory[weightHistory.length - 1].value,
      history: weightHistory,
    },
    healthScore: calculateHealthScore(),
  };
};

export const useHealthData = () => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize data on component mount
  useEffect(() => {
    // Simulate initial loading
    setLoading(true);
    setTimeout(() => {
      setHealthData(generateMockData());
      setLoading(false);
    }, 1000);
  }, []);

  // Sync function to update data
  const syncData = useCallback(() => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setHealthData(generateMockData());
      setLoading(false);
    }, 2000);
  }, []);

  return { healthData, loading, syncData };
};