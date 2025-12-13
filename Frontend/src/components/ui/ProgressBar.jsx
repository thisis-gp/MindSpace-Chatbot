import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils";

const ProgressBar = ({ 
  value, 
  max = 100, 
  showLabel = true,
  color = "primary",
  className,
  animated = true 
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colors = {
    primary: "bg-gradient-primary",
    success: "bg-status-well",
    warning: "bg-status-moderate",
    attention: "bg-status-attention",
    urgent: "bg-status-urgent",
  };
  
  const progressBar = (
    <div className={cn("w-full h-2 bg-gray-200 rounded-full overflow-hidden", className)}>
      <motion.div
        className={cn("h-full rounded-full", colors[color])}
        initial={animated ? { width: 0 } : { width: `${percentage}%` }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
  
  if (showLabel) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-semibold text-gray-700">{Math.round(percentage)}%</span>
        </div>
        {progressBar}
      </div>
    );
  }
  
  return progressBar;
};

export default ProgressBar;
