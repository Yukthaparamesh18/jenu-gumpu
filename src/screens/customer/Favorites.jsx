import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import BottomNav from '../../components/common/BottomNav';
import EmptyState from '../../components/common/EmptyState';
// In a real app, favorites would be fetched from Firestore or local storage.
// For now, we show an empty state.

const Favorites = () => {
  const [favorites] = useState([]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="min-h-screen bg-background-light dark:bg-background-dark pb-24 flex flex-col"
    >
      <div className="pt-12 px-6 pb-4">
        <h1 className="text-2xl font-heading font-bold text-secondary dark:text-amber-50">Favorites</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Honey you've saved for later.</p>
      </div>

      <div className="flex-grow px-6">
        {favorites.length > 0 ? (
          <div>{/* Render favorites list */}</div>
        ) : (
          <EmptyState 
            icon={Heart} 
            title="No Favorites Yet" 
            message="Tap the heart icon on any honey to save it here." 
            actionLabel="Browse Honey"
            onAction={() => window.history.back()}
          />
        )}
      </div>

      <BottomNav role="customer" />
    </motion.div>
  );
};

export default Favorites;
