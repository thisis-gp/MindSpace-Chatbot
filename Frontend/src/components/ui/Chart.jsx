import React from "react";
import { motion } from "framer-motion";

// Simple Line Chart Component
export const LineChart = ({ data, width = "100%", height = 200, color = "#5A9B7A" }) => {
  if (!data || data.length === 0) return null;
  
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1 || 1)) * 100;
    const y = 100 - ((point.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(" ");
  
  return (
    <div className="w-full" style={{ width, height }}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <motion.polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        {data.map((point, index) => {
          const x = (index / (data.length - 1 || 1)) * 100;
          const y = 100 - ((point.value - minValue) / range) * 100;
          return (
            <motion.circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill={color}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            />
          );
        })}
      </svg>
    </div>
  );
};

// Bar Chart Component
export const BarChart = ({ data, width = "100%", height = 200 }) => {
  if (!data || data.length === 0) return null;
  
  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = 100 / data.length;
  
  return (
    <div className="w-full flex items-end justify-between gap-2" style={{ width, height }}>
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * 100;
        const colors = [
          "bg-gradient-primary",
          "bg-gradient-secondary",
          "bg-gradient-energetic",
          "bg-status-well",
          "bg-status-moderate",
        ];
        const colorClass = colors[index % colors.length];
        
        return (
          <motion.div
            key={index}
            className={`flex-1 ${colorClass} rounded-t-lg`}
            initial={{ height: 0 }}
            animate={{ height: `${barHeight}%` }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
            title={`${item.label}: ${item.value}`}
          />
        );
      })}
    </div>
  );
};

// Area Chart Component
export const AreaChart = ({ data, width = "100%", height = 200, color = "#5A9B7A" }) => {
  if (!data || data.length === 0) return null;
  
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1 || 1)) * 100;
    const y = 100 - ((point.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(" ");
  
  const areaPoints = `${points} 100,100 0,100`;
  
  return (
    <div className="w-full" style={{ width, height }}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <motion.polygon
          fill="url(#areaGradient)"
          points={areaPoints}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        <motion.polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
};

export default { LineChart, BarChart, AreaChart };
