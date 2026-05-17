import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({ icon: Icon, title, message, actionLabel, onAction }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center p-8 h-full min-h-[300px]"
    >
      <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4 text-amber-500">
        {Icon && <Icon size={40} strokeWidth={1.5} />}
      </div>
      <h3 className="text-xl font-heading font-semibold text-secondary dark:text-amber-50 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-[250px]">
        {message}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="text-sm font-semibold text-amber-600 dark:text-amber-400 border border-amber-500 dark:border-amber-400 px-6 py-2 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
