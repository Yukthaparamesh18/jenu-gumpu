import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import BottomNav from '../../components/common/BottomNav';
import EmptyState from '../../components/common/EmptyState';

const Notifications = () => {
  const [notifications] = useState([]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="min-h-screen bg-background-light dark:bg-background-dark pb-24 flex flex-col"
    >
      <div className="pt-12 px-6 pb-4">
        <h1 className="text-2xl font-heading font-bold text-secondary dark:text-amber-50">Notifications</h1>
      </div>

      <div className="flex-grow px-6">
        {notifications.length > 0 ? (
          <div>{/* Render notifications list */}</div>
        ) : (
          <EmptyState 
            icon={Bell} 
            title="All caught up!" 
            message="You don't have any new notifications." 
          />
        )}
      </div>

      <BottomNav role="customer" />
    </motion.div>
  );
};

export default Notifications;
