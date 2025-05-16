import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RefreshCcw } from 'lucide-react';
import MetricCard from './MetricCard';
import { HealthData } from '../../hooks/useHealthData';
import { cn } from '../../utils/cn';

interface OverlayChartProps {
  healthData: HealthData;
}

interface MetricOption {
  id: keyof HealthData;
  label: string;
  color: string;
  valueKey: string;
}

const OverlayChart: React.FC<OverlayChartProps> = ({ healthData }) => {
  // Available metrics for overlay
  const metricOptions: MetricOption[] = [
    { id: 'sleep', label: 'Sleep', color: '#0ca5e9', valueKey: 'value' },
    { id: 'mood', label: 'Mood', color: '#f97316', valueKey: 'value' },
    { id: 'water', label: 'Water', color: '#0d9488', valueKey: 'value' },
    { id: 'heartRate', label: 'Heart Rate', color: '#ef4444', valueKey: 'value' },
  ];
  
  // Selected metrics state
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['sleep', 'mood']);
  
  // Toggle metric selection
  const toggleMetric = (metricId: string) => {
    if (selectedMetrics.includes(metricId)) {
      setSelectedMetrics(selectedMetrics.filter(id => id !== metricId));
    } else {
      setSelectedMetrics([...selectedMetrics, metricId]);
    }
  };
  
  // Prepare combined data for the chart
  const prepareData = () => {
    if (!healthData) return [];
    
    // Start with dates from sleep history
    const dates = healthData.sleep.history.map(item => item.date);
    
    // Create combined data array
    return dates.map(date => {
      const dataPoint: any = { date };
      
      // Add each selected metric's value for this date
      metricOptions.forEach(metric => {
        const metricData = (healthData as any)[metric.id].history;
        const dayData = metricData.find((item: any) => item.date === date);
        if (dayData) {
          dataPoint[metric.id] = dayData.value;
        }
      });
      
      return dataPoint;
    });
  };
  
  const combinedData = prepareData();
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <MetricCard 
      title="Health Metrics Comparison" 
      icon={<RefreshCcw />}
      className="col-span-full"
    >
      <div className="flex flex-col">
        <div className="flex flex-wrap gap-2 mb-4">
          {metricOptions.map(metric => (
            <button
              key={metric.id}
              onClick={() => toggleMetric(metric.id)}
              className={cn(
                "px-3 py-1 text-sm rounded-full transition-colors",
                "border",
                selectedMetrics.includes(metric.id)
                  ? `bg-${metric.color} text-white border-${metric.color}`
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700",
              )}
              style={{
                backgroundColor: selectedMetrics.includes(metric.id) ? metric.color : '',
                borderColor: selectedMetrics.includes(metric.id) ? metric.color : ''
              }}
            >
              {metric.label}
            </button>
          ))}
        </div>
        
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={combinedData}>
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                axisLine={false} 
                tickLine={false}
              />
              <YAxis yAxisId="left" orientation="left" hide />
              <YAxis yAxisId="right" orientation="right" hide />
              <Tooltip 
                formatter={(value, name) => {
                  const metric = metricOptions.find(m => m.id === name);
                  return [`${value} ${name === 'heartRate' ? 'BPM' : name === 'sleep' ? 'hours' : ''}`, metric?.label || name];
                }}
                labelFormatter={formatDate}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  border: 'none',
                }}
              />
              <Legend />
              
              {metricOptions.map(metric => (
                selectedMetrics.includes(metric.id) && (
                  <Line 
                    key={metric.id}
                    yAxisId={metric.id === 'heartRate' ? 'right' : 'left'}
                    type="monotone" 
                    dataKey={metric.id} 
                    name={metric.label}
                    stroke={metric.color} 
                    strokeWidth={2}
                    dot={{ fill: metric.color, r: 4 }}
                    activeDot={{ r: 6, fill: metric.color }}
                    animationDuration={1500}
                  />
                )
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </MetricCard>
  );
};

export default OverlayChart;