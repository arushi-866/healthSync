import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, ReferenceDot } from 'recharts';
import { RefreshCcw, TrendingUp, TrendingDown, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';
import MetricCard from './MetricCard';
import { HealthData } from '../../hooks/useHealthData';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

interface OverlayChartProps {
  healthData: HealthData;
}

interface MetricOption {
  id: keyof HealthData;
  label: string;
  color: string;
  valueKey: string;
  unit?: string;
  icon?: React.ReactNode;
}

const OverlayChart: React.FC<OverlayChartProps> = ({ healthData }) => {
  // Available metrics for overlay with enhanced info
  const metricOptions: MetricOption[] = [
    { id: 'sleep', label: 'Sleep', color: '#0ca5e9', valueKey: 'value', unit: 'hours', icon: <span className="text-blue-400">😴</span> },
    { id: 'mood', label: 'Mood', color: '#f97316', valueKey: 'value', icon: <span>😊</span> },
    { id: 'water', label: 'Water', color: '#0d9488', valueKey: 'value', unit: 'cups', icon: <span className="text-teal-500">💧</span> },
    { id: 'heartRate', label: 'Heart Rate', color: '#ef4444', valueKey: 'value', unit: 'BPM', icon: <span className="text-red-500">❤️</span> },
  ];
  
  // Selected metrics state with animation control
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['sleep', 'mood']);
  const [isHovered, setIsHovered] = useState(false);
  const [highlightedMetric, setHighlightedMetric] = useState<string | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  const [animateChart, setAnimateChart] = useState(false);
  
  // Correlation insights
  const [correlations, setCorrelations] = useState<{metric1: string, metric2: string, strength: number, direction: 'positive' | 'negative'}[]>([]);
  
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Toggle metric selection with animation
  const toggleMetric = (metricId: string) => {
    setAnimateChart(true);
    
    if (selectedMetrics.includes(metricId)) {
      setSelectedMetrics(selectedMetrics.filter(id => id !== metricId));
    } else {
      setSelectedMetrics([...selectedMetrics, metricId]);
    }
    
    // Reset animation flag
    setTimeout(() => setAnimateChart(false), 1000);
  };
  
  // Calculate correlations between metrics
  useEffect(() => {
    if (selectedMetrics.length < 2 || !healthData) return;
    
    const newCorrelations: any[] = [];
    
    // Simple correlation calculation
    for (let i = 0; i < selectedMetrics.length; i++) {
      for (let j = i + 1; j < selectedMetrics.length; j++) {
        const metric1 = selectedMetrics[i];
        const metric2 = selectedMetrics[j];
        
        const metric1Data = (healthData as any)[metric1].history.map((item: any) => ({
          date: item.date,
          value: item.value
        }));
        
        const metric2Data = (healthData as any)[metric2].history.map((item: any) => ({
          date: item.date,
          value: item.value
        }));
        
        // Calculate a simple correlation coefficient
        const correlation = calculateCorrelation(metric1Data, metric2Data);
        
        if (Math.abs(correlation) > 0.3) {  // Only show significant correlations
          newCorrelations.push({
            metric1,
            metric2,
            strength: Math.abs(correlation),
            direction: correlation > 0 ? 'positive' : 'negative'
          });
        }
      }
    }
    
    setCorrelations(newCorrelations);
  }, [selectedMetrics, healthData]);
  
  // Calculate correlation between two metrics
  const calculateCorrelation = (data1: any[], data2: any[]) => {
    // Map to common dates
    const commonData = data1.map(item1 => {
      const match = data2.find(item2 => item2.date === item1.date);
      if (match) {
        return { date: item1.date, value1: item1.value, value2: match.value };
      }
      return null;
    }).filter(item => item !== null);
    
    if (commonData.length < 3) return 0;
    
    // Calculate means
    const mean1 = commonData.reduce((sum, item) => sum + item!.value1, 0) / commonData.length;
    const mean2 = commonData.reduce((sum, item) => sum + item!.value2, 0) / commonData.length;
    
    // Calculate covariance and variances
    let covariance = 0;
    let variance1 = 0;
    let variance2 = 0;
    
    commonData.forEach(item => {
      const diff1 = item!.value1 - mean1;
      const diff2 = item!.value2 - mean2;
      covariance += diff1 * diff2;
      variance1 += diff1 * diff1;
      variance2 += diff2 * diff2;
    });
    
    const denominator = Math.sqrt(variance1 * variance2);
    
    return denominator === 0 ? 0 : covariance / denominator;
  };
  
  // Prepare combined data for the chart
  const prepareData = () => {
    if (!healthData) return [];
    
    // Get all unique dates from selected metrics
    let allDates = new Set<string>();
    selectedMetrics.forEach(metricId => {
      const metricData = (healthData as any)[metricId].history;
      metricData.forEach((item: any) => allDates.add(item.date));
    });
    
    // Convert to array and sort
    const dates = Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    
    // Create combined data array
    return dates.map(date => {
      const dataPoint: any = { date };
      
      // Add each selected metric's value for this date
      metricOptions.forEach(metric => {
        if (selectedMetrics.includes(metric.id)) {
          const metricData = (healthData as any)[metric.id].history;
          const dayData = metricData.find((item: any) => item.date === date);
          if (dayData) {
            dataPoint[metric.id] = dayData.value;
          }
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
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };
  
  const insightVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { duration: 0.3 } 
    }
  };
  
  return (
    <MetricCard 
      title="Health Metrics Comparison" 
      icon={
        <motion.div
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <RefreshCcw className="text-purple-500" />
        </motion.div>
      }
      className="col-span-full"
    >
      <motion.div 
        className="flex flex-col"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="flex justify-between items-center mb-4">
          <motion.div className="flex flex-wrap gap-2" variants={containerVariants}>
            {metricOptions.map(metric => (
              <motion.button
                key={metric.id}
                onClick={() => toggleMetric(metric.id)}
                className={cn(
                  "px-3 py-1 rounded-full transition-all flex items-center gap-1.5",
                  "border shadow-sm",
                  selectedMetrics.includes(metric.id)
                    ? "text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700",
                )}
                style={{
                  backgroundColor: selectedMetrics.includes(metric.id) ? metric.color : '',
                  borderColor: selectedMetrics.includes(metric.id) ? metric.color : '',
                  opacity: highlightedMetric && highlightedMetric !== metric.id && selectedMetrics.includes(metric.id) ? 0.6 : 1,
                  transform: `scale(${selectedMetrics.includes(metric.id) ? 1 : 0.95})`
                }}
                whileHover={{ scale: selectedMetrics.includes(metric.id) ? 1.05 : 1, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                variants={itemVariants}
                onMouseEnter={() => setHighlightedMetric(metric.id)}
                onMouseLeave={() => setHighlightedMetric(null)}
              >
                {metric.icon && <span className="mr-1">{metric.icon}</span>}
                {metric.label}
                {selectedMetrics.includes(metric.id) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={14} />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </motion.div>
          
          <motion.button
            onClick={() => setShowInsights(!showInsights)}
            className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            whileHover={{ scale: 1.03 }}
          >
            {showInsights ? <EyeOff size={16} /> : <Eye size={16} />}
            {showInsights ? "Hide Insights" : "Show Insights"}
          </motion.button>
        </div>
        
        {/* Insights section */}
        <AnimatePresence>
          {showInsights && correlations.length > 0 && (
            <motion.div 
              className="mb-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 text-sm"
              variants={insightVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <h4 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2 flex items-center">
                <TrendingUp size={16} className="mr-1" />
                Data Insights & Correlations
              </h4>
              <ul className="space-y-2">
                {correlations.map((correlation, idx) => {
                  const metric1 = metricOptions.find(m => m.id === correlation.metric1);
                  const metric2 = metricOptions.find(m => m.id === correlation.metric2);
                  
                  if (!metric1 || !metric2) return null;
                  
                  return (
                    <motion.li 
                      key={idx} 
                      className="flex items-start gap-2 text-gray-700 dark:text-gray-200"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      {correlation.direction === 'positive' ? (
                        <TrendingUp size={16} style={{ color: metric1.color }} className="mt-1 flex-shrink-0" />
                      ) : (
                        <TrendingDown size={16} style={{ color: metric1.color }} className="mt-1 flex-shrink-0" />
                      )}
                      <span>
                        <span style={{ color: metric1.color }} className="font-medium">{metric1.label}</span>
                        {correlation.direction === 'positive' ? ' increases ' : ' decreases '}
                        as <span style={{ color: metric2.color }} className="font-medium">{metric2.label}</span>
                        {correlation.direction === 'positive' ? ' increases' : ' decreases'}
                        <span className="text-xs ml-2 text-gray-500">
                          ({Math.round(correlation.strength * 100)}% correlation)
                        </span>
                      </span>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div 
          className="h-64 md:h-96"
          ref={chartRef}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMetrics.join('-')}
              className="w-full h-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={combinedData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    padding={{ left: 10, right: 10 }}
                  />
                  
                  <YAxis 
                    yAxisId="left" 
                    orientation="left" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    width={30}
                  />
                  
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    width={30}
                  />
                  
                  <Tooltip 
                    formatter={(value, name) => {
                      const metric = metricOptions.find(m => m.id === name);
                      return [
                        <span style={{ color: metric?.color }}>
                          {value} {metric?.unit || ''}
                        </span>, 
                        <span style={{ color: metric?.color }}>{metric?.label || name}</span>
                      ];
                    }}
                    labelFormatter={formatDate}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                      padding: '12px',
                    }}
                    cursor={{ strokeDasharray: '3 3', stroke: '#9ca3af' }}
                    animationDuration={300}
                  />
                  
                  <Legend 
                    formatter={(value, entry) => {
                      const metric = metricOptions.find(m => m.id === entry.dataKey);
                      return <span style={{ color: metric?.color, fontWeight: highlightedMetric === entry.dataKey ? 'bold' : 'normal' }}>{value}</span>;
                    }}
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '10px' }}
                    onMouseEnter={(props) => setHighlightedMetric(props.dataKey as string)}
                    onMouseLeave={() => setHighlightedMetric(null)}
                  />
                  
                  {metricOptions.map(metric => (
                    selectedMetrics.includes(metric.id) && (
                      <Line 
                        key={metric.id}
                        yAxisId={metric.id === 'heartRate' ? 'right' : 'left'}
                        type="monotone" 
                        dataKey={metric.id} 
                        name={metric.label}
                        stroke={metric.color} 
                        strokeWidth={highlightedMetric === metric.id ? 3 : 2}
                        strokeOpacity={highlightedMetric && highlightedMetric !== metric.id ? 0.5 : 1}
                        dot={{
                          fill: metric.color,
                          r: highlightedMetric === metric.id ? 5 : 4,
                          strokeWidth: 1,
                          stroke: '#fff'
                        }}
                        activeDot={{
                          r: 6,
                          fill: metric.color,
                          stroke: '#fff',
                          strokeWidth: 2,
                          className: "animate-ping"
                        }}
                        animationDuration={animateChart ? 1500 : 0}
                        animationEasing="ease-in-out"
                      />
                    )
                  ))}
                  
                  {/* Add last value reference dots */}
                  {selectedMetrics.map(metricId => {
                    const metric = metricOptions.find(m => m.id === metricId);
                    if (!metric) return null;
                    
                    const lastDataPoint = [...combinedData].reverse().find(data => data[metricId] !== undefined);
                    if (!lastDataPoint) return null;
                    
                    return (
                      <ReferenceDot
                        key={`ref-${metricId}`}
                        x={lastDataPoint.date}
                        y={lastDataPoint[metricId]}
                        r={highlightedMetric === metricId ? 8 : 6}
                        fill={metric.color}
                        stroke="#fff"
                        strokeWidth={2}
                        yAxisId={metricId === 'heartRate' ? 'right' : 'left'}
                        isFront={true}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Current values dashboard */}
        <motion.div 
          className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2"
          variants={containerVariants}
        >
          {selectedMetrics.map(metricId => {
            const metric = metricOptions.find(m => m.id === metricId);
            if (!metric) return null;
            
            const currentValue = (healthData as any)[metricId].value;
            const history = (healthData as any)[metricId].history;
            const previousValue = history[history.length - 2]?.value || 0;
            const change = currentValue - previousValue;
            const percentChange = previousValue ? Math.round((change / previousValue) * 100) : 0;
            
            return (
              <motion.div
                key={metricId}
                className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700"
                style={{
                  borderLeft: `3px solid ${metric.color}`
                }}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                }}
                variants={itemVariants}
              >
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    {metric.icon && <span className="mr-1.5">{metric.icon}</span>}
                    {metric.label}
                  </span>
                  
                  {change !== 0 && (
                    <motion.div
                      className={`flex items-center text-xs font-medium px-1.5 py-0.5 rounded-full ${
                        change > 0 ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-red-600 bg-red-50 dark:bg-red-900/20'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      {change > 0 ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      {Math.abs(percentChange)}%
                    </motion.div>
                  )}
                </div>
                
                <div className="mt-1 flex items-baseline">
                  <motion.span
                    key={currentValue}
                    className="text-xl font-semibold text-gray-800 dark:text-gray-100"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {currentValue}
                  </motion.span>
                  {metric.unit && (
                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                      {metric.unit}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </MetricCard>
  );
};

export default OverlayChart;