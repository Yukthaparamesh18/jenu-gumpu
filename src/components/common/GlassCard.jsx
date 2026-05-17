import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', animateHover = false, onClick }) => {
  const hoverProps = animateHover ? { whileHover: { scale: 1.02, y: -4 }, transition: { type: 'spring', stiffness: 300 } } : {};
  
  return (
    <motion.div
      onClick={onClick}
      className={`glass-card p-4 ${className}`}
      {...hoverProps}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
