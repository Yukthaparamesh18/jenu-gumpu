import React from 'react';
import { motion } from 'framer-motion';

const GradientButton = ({ children, onClick, type = 'button', className = '', disabled = false, fullWidth = false }) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`relative overflow-hidden font-heading font-semibold text-white py-3 px-6 rounded-2xl shadow-lg transition-all duration-300 ${
        disabled 
          ? 'bg-gray-400 cursor-not-allowed shadow-none' 
          : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-orange-500/30'
      } ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default GradientButton;
