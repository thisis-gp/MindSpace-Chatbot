// src/components/ui/Card.jsx
import React from "react";
import { motion } from "framer-motion";

const Card = ({ onClick, children, className = "", hover = true }) => {
  const baseClasses = `bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
    hover ? "hover:shadow-xl hover-lift" : ""
  } ${onClick ? "cursor-pointer" : ""} ${className}`;

  if (hover && onClick) {
    return (
      <motion.div
        className={baseClasses}
        onClick={onClick}
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
