import React, { useState, useEffect, useRef } from 'react';
import { Medal, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, Info } from 'lucide-react';
import MetricCard from './MetricCard';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

interface HealthScoreCardProps {
  score: number;
  onClick?: () => void;
  previousScore?: number;
  lastUpdated?: string;
}

const HealthScoreCard: React.FC<HealthScoreCardProps> = ({ 
  score, 
  onClick, 
  previousScore = 78, 
  lastUpdated = 'Today at 12:00 AM' 
}) => {
  const [prevScore, setPrevScore] = useState(score);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const controls = useAnimation();
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  // Sound effect for score changes
  const playSound = (isPositive: boolean) => {
    if (typeof window !== 'undefined') {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(isPositive ? 800 : 400, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        isPositive ? 1200 : 200, 
        context.currentTime + 0.1
      );
      
      gainNode.gain.setValueAtTime(0.1, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.start();
      oscillator.stop(context.currentTime + 0.2);
    }
  };
  
  useEffect(() => {
    // Detect score changes and animate
    if (prevScore !== score) {
      setIsAnimating(true);
      controls.start({
        scale: [1, 1.12, 1],
        transition: { duration: 0.7, type: "spring", stiffness: 300 }
      });
      
      // Play sound effect based on score change
      playSound(score > prevScore);
      
      // Reset animation state after completion
      setTimeout(() => setIsAnimating(false), 800);
      setPrevScore(score);
    }
  }, [score, prevScore, controls]);
  
  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [tooltipRef]);
  
  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 80) return 'text-success-500 dark:text-success-400';
    if (score >= 60) return 'text-primary-500 dark:text-primary-400';
    if (score >= 40) return 'text-warning-500 dark:text-warning-400';
    return 'text-error-500 dark:text-error-400';
  };
  
  // Determine background color based on score (lighter version)
  const getScoreBgColor = () => {
    if (score >= 80) return 'bg-success-100 dark:bg-success-900/30';
    if (score >= 60) return 'bg-primary-100 dark:bg-primary-900/30';
    if (score >= 40) return 'bg-warning-100 dark:bg-warning-900/30';
    return 'bg-error-100 dark:bg-error-900/30';
  };
  
  // Determine stroke color for progress circle
  const getStrokeColor = () => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#0ca5e9';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };
  
  // Get gradient colors for the pulse effect
  const getGradientColors = () => {
    if (score >= 80) return ['#22c55e', '#16a34a'];
    if (score >= 60) return ['#0ca5e9', '#0284c7'];
    if (score >= 40) return ['#f59e0b', '#d97706'];
    return ['#ef4444', '#dc2626'];
  };
  
  // Determine message based on score
  const getScoreMessage = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };
  
  // Get detailed message based on score
  const getDetailedMessage = () => {
    if (score >= 80) return 'Your health metrics are outstanding! Keep up the great work.';
    if (score >= 60) return 'Your health is on track. Small improvements can help you reach excellence.';
    if (score >= 40) return 'Your health needs attention. Focus on the lowest factors for improvement.';
    return 'Immediate health improvements recommended. Check the detailed breakdown.';
  };
  
  // Calculate score increase/decrease indicators
  const getScoreTrend = () => {
    const changeValue = score - previousScore;
    
    if (changeValue > 0) {
      return {
        icon: <TrendingUp size={16} className="text-success-500" />,
        value: `+${changeValue}`,
        color: 'text-success-500',
        isPositive: true
      };
    } else if (changeValue < 0) {
      return {
        icon: <TrendingDown size={16} className="text-error-500" />,
        value: changeValue.toString(),
        color: 'text-error-500',
        isPositive: false
      };
    } else {
      return {
        icon: <Minus size={16} className="text-gray-500" />,
        value: '0',
        color: 'text-gray-500',
        isPositive: null
      };
    }
  };
  
  const scoreTrend = getScoreTrend();
  const gradientColors = getGradientColors();
  
  // Mock health score factors with more detailed information
  const healthFactors = [
    { 
      name: 'Activity', 
      score: 85, 
      weight: 0.3,
      trend: '+5',
      details: 'You completed 8,500 steps daily on average' 
    },
    { 
      name: 'Sleep', 
      score: 72, 
      weight: 0.25,
      trend: '-2',
      details: '7.2 hours average, 88% sleep quality' 
    },
    { 
      name: 'Nutrition', 
      score: 68, 
      weight: 0.25,
      trend: '+3',
      details: 'Balanced macros, could use more vegetables' 
    },
    { 
      name: 'Mental Health', 
      score: 90, 
      weight: 0.2,
      trend: '+8',
      details: 'Stress levels down 15% this week' 
    }
  ];
  
  const toggleTooltip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTooltip(!showTooltip);
  };
  
  // Calculate a weighted average of factors to show contribution
  const calculateContribution = (factor: typeof healthFactors[0]) => {
    return Math.round(factor.weight * factor.score);
  };
  
  // Dynamic arc path generator for fancy gauge
  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };
  
  function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }
  
  // Calculate arc angle based on score
  const scoreToAngle = () => {
    return score * 1.8; // Convert 0-100 to 0-180 degrees
  };
  
  return (
    <MetricCard 
      title="Health Score" 
      icon={
        <motion.div 
          whileHover={{ rotate: [0, -15, 15, -5, 0], scale: 1.2 }}
          transition={{ duration: 0.5 }}
        >
          <Medal className="text-amber-500" />
        </motion.div>
      }
      extraControls={
        <div className="flex space-x-1 relative">
          <motion.button
            onClick={toggleTooltip}
            className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors relative z-50"
            style={{ position: 'relative', zIndex: 50 }}
          >
            <Info size={16} />
          </motion.button>
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                ref={tooltipRef}
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.22 }}
                // Remove any opacity utility classes that might affect hover
                className="absolute right-full top-0 mr-4 w-[320px] max-w-[90vw] min-w-[220px] p-6 bg-gray-900 rounded-lg shadow-2xl text-left z-[9999] border border-gray-700"
                style={{ pointerEvents: 'auto', opacity: 1 }}
              >
                <h5 className="font-semibold mb-2 text-gray-100">About Health Score</h5>
                <p className="text-base text-gray-300 leading-relaxed">
                  Your Health Score combines activity, sleep quality, nutrition, and mental wellness
                  into a single metric. Scores update daily based on your data.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      }
    >
      <div className="flex flex-col items-center">
        <motion.div 
          className="relative mb-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.6 
          }}
        >
          <svg width="140" height="140" viewBox="0 0 140 140">
            {/* Defs with gradients and filters */}
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={gradientColors[0]} />
                <stop offset="100%" stopColor={gradientColors[1]} />
              </linearGradient>
              
              {/* Glowing effect */}
              <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              
              {/* Drop shadow */}
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={getStrokeColor()} floodOpacity="0.4" />
              </filter>
              
              {/* Inner shadow for depth */}
              <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feOffset dx="0" dy="2" />
                <feGaussianBlur stdDeviation="2" result="offset-blur" />
                <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                <feFlood floodColor="black" floodOpacity="0.2" result="color" />
                <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                <feComposite operator="over" in="shadow" in2="SourceGraphic" />
              </filter>
            </defs>
            
            {/* Fancy background elements */}
            <g className="dark:opacity-20 opacity-10">
              {[...Array(3)].map((_, i) => (
                <motion.circle
                  key={`bg-circle-${i}`}
                  cx="70"
                  cy="70"
                  r={60 - i * 10}
                  fill="none"
                  stroke="#000"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                  initial={{ rotate: 0 }}
                  animate={{ 
                    rotate: 360 * (i % 2 === 0 ? 1 : -1)
                  }}
                  transition={{ 
                    duration: 120 + i * 30, 
                    ease: "linear", 
                    repeat: Infinity 
                  }}
                />
              ))}
            </g>
            
            {/* Background arc - semi-circle */}
            <path
              d={describeArc(70, 70, 54, 0, 180)}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
              strokeLinecap="round"
              className="dark:stroke-gray-700"
              filter="url(#innerShadow)"
            />
            
            {/* Score arc - progress semi-circle */}
            <motion.path
              d={describeArc(70, 70, 54, 0, 0)}
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              filter="url(#shadow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: score / 100 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
            />
            
            {/* Pulse effect on score arc */}
            <motion.path
              d={describeArc(70, 70, 54, 0, scoreToAngle())}
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#glow)"
              initial={{ opacity: 0.6 }}
              animate={{ 
                opacity: [0.6, 0.2, 0.6],
                scale: [1, 1.03, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Score marker dot that moves along the arc */}
            <motion.circle
              cx="70"
              cy="16"
              r="6"
              fill={getStrokeColor()}
              filter="url(#shadow)"
              initial={{ rotate: 0 }}
              animate={{ rotate: scoreToAngle() }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              style={{ transformOrigin: '70px 70px' }}
            />
            
            {/* Add tick marks */}
            {[0, 45, 90, 135, 180].map((angle, i) => (
              <g key={`tick-${i}`} style={{ transform: `rotate(${angle}deg)`, transformOrigin: '70px 70px' }}>
                <line
                  x1="70"
                  y1="16"
                  x2="70"
                  y2="20"
                  stroke="#9ca3af"
                  strokeWidth="2"
                  className="dark:stroke-gray-500"
                />
                <text
                  x="70"
                  y="12"
                  textAnchor="middle"
                  fontSize="8"
                  fill="#6b7280"
                  className="dark:fill-gray-400"
                  style={{ transform: `rotate(-${angle}deg)`, transformOrigin: '70px 12px' }}
                >
                  {Math.round(angle / 1.8)}
                </text>
              </g>
            ))}
          </svg>
          
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center"
            animate={controls}
          >
            <motion.div
              className="relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                <motion.span 
                  key={score}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`text-4xl font-bold ${getScoreColor()}`}
                >
                  {score}
                </motion.span>
              </AnimatePresence>
              
              {/* Animated ring when score changes */}
              {isAnimating && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ 
                    boxShadow: `0 0 0 2px ${getStrokeColor()}`,
                  }}
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.8 }}
                  transition={{ duration: 0.8 }}
                />
              )}
            </motion.div>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-1">
                out of 100
              </span>
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex items-center ml-1"
              >
                <motion.div
                  animate={scoreTrend.isPositive !== null ? { 
                    y: [0, -2, 0, -2, 0],
                    x: scoreTrend.isPositive ? [0, 1, 0, 1, 0] : [0, -1, 0, -1, 0]
                  } : {}}
                  transition={{ 
                    repeat: Infinity, 
                    repeatDelay: 5,
                    duration: 1
                  }}
                >
                  {scoreTrend.icon}
                </motion.div>
                <motion.span 
                  className={`text-xs ml-0.5 ${scoreTrend.color} font-medium`}
                  animate={scoreTrend.isPositive !== null ? { 
                    scale: [1, 1.1, 1] 
                  } : {}}
                  transition={{
                    repeat: Infinity,
                    repeatDelay: 5,
                    duration: 0.8
                  }}
                >
                  {scoreTrend.value}
                </motion.span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.3 }}
          className={`${getScoreColor()} text-lg font-medium flex items-center`}
        >
          <span>{getScoreMessage()}</span>
          
          {/* Animated pulse dot for real-time indication */}
          <motion.div 
            className={`w-2 h-2 rounded-full ml-2 ${getScoreColor().replace('text-', 'bg-')}`}
            animate={{ 
              opacity: [1, 0.5, 1],
              scale: [1, 0.8, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.3 }}
          className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 mb-1"
        >
          {getDetailedMessage()}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-xs text-gray-400 dark:text-gray-500 mt-1"
        >
          Last updated: {lastUpdated}
        </motion.div>
        
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full overflow-hidden mt-4"
        >
          <motion.div 
            className={`${getScoreBgColor()} rounded-lg p-4 w-full shadow-inner`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}  
          >
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex justify-between items-center">
              <span>Contributing Factors</span>
              <motion.div 
                className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Weighted
              </motion.div>
            </h4>
            
            <div className="space-y-3">
              {healthFactors.map((factor, index) => (
                <motion.div 
                  key={factor.name}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15 * index }}
                  className="flex flex-col"
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{factor.name}</span>
                      <motion.div 
                        className={`ml-1.5 text-xs px-1.5 rounded-full 
                          ${factor.trend.startsWith('+') ? 'bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400' : 
                            factor.trend.startsWith('-') ? 'bg-error-100 text-error-600 dark:bg-error-900/30 dark:text-error-400' :
                            'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 * index + 0.2 }}
                      >
                        {factor.trend}
                      </motion.div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mr-1">{factor.score}</span>
                      <span className="text-xs text-gray-500">({calculateContribution(factor)})</span>
                    </div>
                  </div>
                  
                  <div className="relative h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full rounded-full ${
                        factor.score >= 80 ? 'bg-gradient-to-r from-success-400 to-success-500' :
                        factor.score >= 60 ? 'bg-gradient-to-r from-primary-400 to-primary-500' :
                        factor.score >= 40 ? 'bg-gradient-to-r from-warning-400 to-warning-500' :
                        'bg-gradient-to-r from-error-400 to-error-500'
                      }`}
                      initial={{ width: '0%' }}
                      animate={{ width: `${factor.score}%` }}
                      transition={{ duration: 0.8, delay: 0.2 * index, ease: "easeOut" }}
                    />
                    
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent"
                      initial={{ opacity: 0, x: '-100%' }}
                      animate={{ opacity: 0.3, x: '100%' }}
                      transition={{ 
                        duration: 1.5, 
                        delay: 0.4 * index, 
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    />
                  </div>
                  
                  <motion.div 
                    className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 * index }}
                  >
                    {factor.details}
                  </motion.div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Daily update at midnight
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </MetricCard>
  );
};

export default HealthScoreCard;