import React from "react";
import { cn } from "../../utils";

const Badge = ({ 
  children, 
  variant = "default", 
  size = "md",
  className 
}) => {
  const variants = {
    default: "bg-gradient-primary text-white",
    success: "bg-status-well text-white",
    warning: "bg-status-moderate text-white",
    attention: "bg-status-attention text-white",
    urgent: "bg-status-urgent text-white",
    outline: "border-2 border-primary-500 text-primary-600 bg-transparent",
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };
  
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold transition-all hover:scale-105",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
