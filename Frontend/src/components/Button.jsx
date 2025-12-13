import { motion } from "framer-motion";

const Button = ({ 
  className, 
  href, 
  onClick, 
  children, 
  px, 
  white, 
  variant = "primary",
  size = "md",
  disabled = false
}) => {
  const sizeClasses = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-12 px-8 text-lg",
  };

  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-md hover:shadow-lg",
    secondary: "bg-accent-sky text-white hover:bg-blue-600 active:bg-blue-700 shadow-md hover:shadow-lg",
    outline: "border-2 border-primary-600 text-primary-700 bg-transparent hover:bg-primary-50 active:bg-primary-100",
    ghost: "text-primary-700 bg-transparent hover:bg-primary-50 active:bg-primary-100",
    subtle: "bg-stone-100 text-stone-700 hover:bg-stone-200 active:bg-stone-300",
    success: "bg-status-well text-white hover:bg-green-700 active:bg-green-800 shadow-md hover:shadow-lg",
  };

  const baseClasses = `relative inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 ${
    px || sizeClasses[size]
  } ${variants[variant] || variants.primary} ${
    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
  }`;

  const classes = `${baseClasses} ${className || ""}`;

  const buttonContent = (
    <span className="relative z-10 flex items-center gap-2">
      {children}
    </span>
  );

  const renderButton = () => (
    <motion.button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
    >
      {buttonContent}
    </motion.button>
  );

  const renderLink = () => (
    <motion.a
      href={href}
      className={classes}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {buttonContent}
    </motion.a>
  );

  return href ? renderLink() : renderButton();
};

export default Button;
