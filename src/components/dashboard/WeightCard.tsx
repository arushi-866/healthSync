import React, { useState, useEffect, useRef } from 'react';
import { Scale, ArrowUp, ArrowDown, Calendar, Activity, Award, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import MetricCard from './MetricCard';
import { motion, AnimatePresence } from 'framer-motion';

interface WeightCardProps {
  value: number;
  history: Array<{ date: string; value: number }>;
  goalWeight?: number;
  startingWeight?: number;
}

function getMonthYear(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.toLocaleString('en-US', { month: 'short' })} ${date.getFullYear()}`;
}

// Group history by month, take the last entry for each month
function getMonthlyHistory(history: Array<{ date: string; value: number }>) {
  // Group all weights by month
  const monthlyMap = new Map<string, { date: string; value: number; month: string }>();
  history.forEach(item => {
    const key = getMonthYear(item.date);
    // Always overwrite so the last entry in the month is used
    monthlyMap.set(key, { ...item, month: key });
  });
  // Return sorted by date
  return Array.from(monthlyMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// Helper to ensure all months from January to May are present in the graph
function ensureJanToMay(history: Array<{ date: string; value: number }>) {
  // Months: 0=Jan, 1=Feb, 2=Mar, 3=Apr, 4=May
  const monthsToEnsure = [
    { month: 0, year: 2024, value: 78 }, // January
    { month: 1, year: 2024, value: 77 }, // February
    { month: 2, year: 2024, value: 76 }, // March
    { month: 3, year: 2024, value: 75 }, // April
    { month: 4, year: 2024, value: 74 }, // May
  ];

  const existing = new Set(history.map(item => {
    const d = new Date(item.date);
    return `${d.getMonth()}-${d.getFullYear()}`;
  }));

  const filled = [...history];
  monthsToEnsure.forEach(({ month, year, value }) => {
    const key = `${month}-${year}`;
    if (!existing.has(key)) {
      filled.push({
        date: new Date(year, month, 15).toISOString(),
        value,
      });
    }
  });

  return filled;
}

const weightTips = [
  "Tip: Track your weight at the same time each day for consistency.",
  "Tip: Small, steady changes are healthier than rapid weight loss.",
  "Tip: Hydration and sleep can affect daily weight fluctuations.",
  "Tip: Celebrate non-scale victories like energy and mood.",
  "Tip: Use trends, not single days, to judge progress."
];

const WeightCard: React.FC<WeightCardProps> = ({ 
  value, 
  history, 
  goalWeight,
  startingWeight
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tipIndex, setTipIndex] = useState(() => Math.floor(Math.random() * weightTips.length));

  // Ensure Jan-May data is present for the graph
  const filledHistory = ensureJanToMay(history);

  // Monthly data (including previous months)
  const monthlyHistory = getMonthlyHistory(filledHistory);

  // Use first month as starting weight if not provided
  const startWeight = startingWeight ?? monthlyHistory[0]?.value ?? value;

  // Format for recharts
  const formattedData = monthlyHistory.map(item => ({
    ...item,
    fullDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  }));

  // Calculate moving average (3-month window)
  const movingAverage = formattedData.map((item, index, array) => {
    const pointsToAverage = array.slice(Math.max(0, index - 2), index + 1);
    const sum = pointsToAverage.reduce((acc, point) => acc + point.value, 0);
    const avg = sum / pointsToAverage.length;
    return {
      month: item.month,
      fullDate: item.fullDate,
      average: parseFloat(avg.toFixed(1)),
    };
  });

  // Insights
  const totalChange = value - startWeight;
  const percentChange = ((totalChange / startWeight) * 100).toFixed(1);
  const lastMonthChange = formattedData.length > 1
    ? value - formattedData[formattedData.length - 2].value
    : totalChange;

  // Previous month weight (second last entry in formattedData)
  const prevMonthWeight =
    formattedData.length > 1
      ? formattedData[formattedData.length - 2].value
      : null;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInsights(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Tooltip close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTooltip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTooltip(!showTooltip);
  };

  const containerVariants = {
    collapsed: { height: 280 },
    expanded: { height: 480, transition: { duration: 0.5, ease: "easeInOut" } }
  };

  // Custom tooltip for month
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div 
          className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <p className="font-medium text-sm text-gray-700 dark:text-gray-300">{payload[0].payload.fullDate}</p>
          <div className="flex items-center space-x-2 mt-1">
            <div className="w-3 h-3 rounded-full bg-teal-500" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Weight: <span className="font-semibold text-teal-600 dark:text-teal-400">{payload[0].value} kg</span>
            </p>
          </div>
          {payload[1] && (
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-3 h-3 rounded-full bg-teal-700" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Avg: <span className="font-semibold text-teal-700 dark:text-teal-500">{payload[1].value} kg</span>
              </p>
            </div>
          )}
        </motion.div>
      );
    }
    return null;
  };

  return (
    <MetricCard 
      title="Weight Tracker (Monthly)" 
      icon={<Scale className="text-teal-500" />}
      className="relative"
      extraControls={
        <div className="flex space-x-1">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTooltip}
            className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors relative z-50"
            style={{ position: 'relative', zIndex: 50 }}
          >
            <Info size={16} />
            <AnimatePresence>
              {showTooltip && (
                <motion.div 
                  ref={tooltipRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-2 right-0 w-72 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-[9999] text-left border border-gray-200 dark:border-gray-700"
                  style={{ pointerEvents: 'auto' }}
                >
                  <h5 className="font-medium mb-1 text-gray-800 dark:text-gray-200">About Weight Tracker</h5>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    This card tracks your monthly weight trend. The chart shows your progress and moving average. 
                    Use the insights to understand your journey and stay motivated!
                  </p>
                  <ul className="mt-2 text-xs text-gray-500 dark:text-gray-400 list-disc pl-4">
                    <li>Click the chart for more details.</li>
                    <li>Hover over points to see exact values.</li>
                    <li>Click the tip below for more advice!</li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      }
    >
      <motion.div 
        variants={containerVariants}
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
        className="overflow-hidden"
      >
        <div className="flex flex-col">
          {/* Current weight with trend indicator */}
          <div className="flex items-center justify-center mb-2 relative">
            <motion.div
              key={value}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="flex items-baseline"
            >
              <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-400 dark:from-teal-400 dark:to-teal-200">
                {value}
              </span>
              <span className="ml-1 text-gray-500 dark:text-gray-400 text-lg">
                kg
              </span>
              
              {/* Show trend arrow */}
              {totalChange !== 0 && (
                <motion.div 
                  className={`ml-3 flex items-center ${totalChange < 0 ? 'text-green-500' : 'text-red-500'}`}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {totalChange < 0 ? (
                    <ArrowDown size={18} className="mr-1" />
                  ) : (
                    <ArrowUp size={18} className="mr-1" />
                  )}
                  <span className="text-sm font-medium">
                    {Math.abs(totalChange).toFixed(1)} kg
                  </span>
                </motion.div>
              )}
            </motion.div>
          </div>
          
          {/* Last updated date */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center items-center text-xs text-gray-500 dark:text-gray-400 mb-4"
          >
            <Calendar size={12} className="mr-1" />
            Last updated: {formattedData[formattedData.length - 1]?.fullDate}
          </motion.div>
          
          {/* Enhanced chart section */}
          <div 
            ref={chartRef} 
            className="h-40 md:h-48 relative" 
            onMouseLeave={() => setActiveIndex(null)}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={formattedData}
                onMouseMove={(data: any) => {
                  if (data && data.activeTooltipIndex !== undefined) {
                    setActiveIndex(data.activeTooltipIndex);
                  }
                }}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="avgGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#115e59" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#115e59" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  dy={10}
                />
                <YAxis 
                  domain={[ 
                    (dataMin: number) => Math.floor(dataMin - 1),
                    (dataMax: number) => Math.ceil(dataMax + 1)
                  ]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  width={30}
                />
                <Tooltip content={<CustomTooltip />} />
                
                {/* Goal weight reference line if provided */}
                {goalWeight && (
                  <ReferenceLine 
                    y={goalWeight} 
                    stroke="#14b8a6" 
                    strokeDasharray="3 3"
                    label={{ 
                      value: `Goal: ${goalWeight}kg`, 
                      position: 'insideBottomRight',
                      fill: '#14b8a6',
                      fontSize: 12
                    }}
                  />
                )}
                
                {/* Weight line with gradient area */}
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0d9488"
                  strokeWidth={3}
                  dot={(props: any) => {
                    const { cx, cy, index, payload } = props;
                    // Use a unique key: prefer payload.date if available, else fallback to index
                    const key = payload && payload.date ? payload.date : index;
                    const radius = typeof index === 'number' ? (activeIndex === index ? 6 : 4) : 4;
                    // Always return a valid SVG element; if cx/cy are invalid, render an invisible circle
                    return (
                      <motion.circle
                        key={key}
                        cx={typeof cx === 'number' ? cx : 0}
                        cy={typeof cy === 'number' ? cy : 0}
                        r={radius}
                        fill="#0d9488"
                        strokeWidth={activeIndex === index ? 2 : 0}
                        stroke="#fff"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        style={{ opacity: typeof cx === 'number' && typeof cy === 'number' ? 1 : 0 }}
                      />
                    );
                  }}
                  activeDot={{ 
                    r: 6, 
                    stroke: '#fff', 
                    strokeWidth: 2,
                    fill: '#0d9488' 
                  }}
                  animationDuration={1500}
                />
                
                {/* Moving average line */}
                <Line 
                  type="monotone" 
                  data={movingAverage}
                  dataKey="average" 
                  stroke="#115e59" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  animationDuration={2000}
                />
              </LineChart>
            </ResponsiveContainer>
            
            {/* Chart interactions overlay */}
            <motion.div 
              className="absolute inset-0 pointer-events-none flex items-center justify-center"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              <motion.div
                className="bg-teal-50 dark:bg-teal-900/30 rounded-full px-3 py-1 text-xs text-teal-600 dark:text-teal-300"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                Hover for details
              </motion.div>
            </motion.div>
          </div>
          
          {/* Insights section (expanded view) */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4"
              >
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <Activity size={16} className="mr-1 text-teal-500" />
                  Weight Insights
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Total change card */}
                  <motion.div 
                    className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 rounded-lg p-3 shadow-sm"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <p className="text-xs text-teal-700 dark:text-teal-300 mb-1">Total Change</p>
                    <div className="flex items-baseline">
                      <span className={`text-lg font-semibold ${totalChange < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {totalChange > 0 ? '+' : ''}{totalChange.toFixed(1)}
                      </span>
                      <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">kg</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {percentChange}% from start
                    </p>
                  </motion.div>
                  
                  {/* Last month change card */}
                  <motion.div 
                    className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 rounded-lg p-3 shadow-sm"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-xs text-teal-700 dark:text-teal-300 mb-1">Last Month Change</p>
                    <div className="flex items-baseline">
                      <span className={`text-lg font-semibold ${lastMonthChange <= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {lastMonthChange > 0 ? '+' : ''}{lastMonthChange.toFixed(1)}
                      </span>
                      <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">kg</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Compared to previous month
                    </p>
                  </motion.div>
                  
                  {/* Achievement card */}
                  <motion.div 
                    className="col-span-2 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 rounded-lg p-3 shadow-sm flex items-center"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Award size={24} className="text-yellow-500 mr-3" />
                    <div>
                      <p className="text-xs text-teal-700 dark:text-teal-300">Achievement</p>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {Math.abs(totalChange) > 0 
                          ? `${monthlyHistory.length} months of consistent tracking!` 
                          : 'Start your weight journey!'}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Toggle button */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mx-auto mt-4 px-4 py-1.5 text-xs font-medium text-teal-600 dark:text-teal-400 border border-teal-300 dark:border-teal-700 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {isExpanded ? 'Hide Details' : 'Show Insights'}
          </motion.button>
          
          {/* Quick stats pills */}
          <AnimatePresence>
            {!isExpanded && showInsights && (
              <motion.div 
                className="flex justify-center mt-4 space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className={`text-xs px-2 py-1 rounded-full ${
                    totalChange < 0 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 }}
                >
                  {totalChange < 0 ? 'Lost' : 'Gained'} {Math.abs(totalChange).toFixed(1)}kg
                </motion.div>

                {prevMonthWeight !== null && (
                  <motion.div
                    className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.05 }}
                  >
                    Prev month: {prevMonthWeight.toFixed(1)}kg
                  </motion.div>
                )}
                
                {goalWeight && (
                  <motion.div 
                    className="text-xs px-2 py-1 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.1 }}
                  >
                    {Math.abs(value - goalWeight).toFixed(1)}kg to goal
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Weight tip section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tipIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.8, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400 italic px-4"
            onClick={() => setTipIndex((prev) => (prev + 1) % weightTips.length)}
            style={{ cursor: 'pointer' }}
            title="Click for another tip"
          >
            {weightTips[tipIndex]}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </MetricCard>
  );
};

export default WeightCard;