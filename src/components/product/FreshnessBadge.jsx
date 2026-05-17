import React from 'react';

const FreshnessBadge = ({ freshness }) => {
  const getColors = () => {
    switch (freshness?.toLowerCase()) {
      case 'fresh':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'aged':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'premium':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getColors()} uppercase tracking-wider`}>
      {freshness}
    </span>
  );
};

export default FreshnessBadge;
