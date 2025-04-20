import React from 'react';
import { motion } from 'framer-motion';

interface ProgressCircleProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showValue?: boolean;
  valueClassName?: string;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  value,
  size = 80,
  strokeWidth = 8,
  className = '',
  showValue = true,
  valueClassName = ''
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference - (value / 100) * circumference;

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0" // light gray background
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashoffset }}
          transition={{ duration: 1, ease: "easeInOut" }}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="text-blue-600"
        />
      </svg>
      
      {showValue && (
        <div className={`absolute inset-0 flex items-center justify-center ${valueClassName}`}>
          <span className="text-lg font-semibold">{value}%</span>
        </div>
      )}
    </div>
  );
};

export default ProgressCircle;