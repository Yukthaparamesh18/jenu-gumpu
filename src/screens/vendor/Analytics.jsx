import React from 'react';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import BottomNav from '../../components/common/BottomNav';
import ChartCard from '../../components/vendor/ChartCard';
import GlassCard from '../../components/common/GlassCard';

const Analytics = () => {
  const user = useAuthStore(state => state.user);

  // Mock data for charts
  const salesData = [
    { name: 'Jan', value: 4000 }, { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 }, { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 }, { name: 'Jun', value: 8000 }
  ];

  const viewsData = [
    { name: 'Mon', value: 120 }, { name: 'Tue', value: 200 },
    { name: 'Wed', value: 150 }, { name: 'Thu', value: 300 },
    { name: 'Fri', value: 250 }, { name: 'Sat', value: 400 },
    { name: 'Sun', value: 380 }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="min-h-screen bg-background-light dark:bg-background-dark pb-24"
    >
      <div className="pt-12 px-6 pb-4 bg-white/50 dark:bg-black/50 backdrop-blur-xl border-b border-amber-100 dark:border-amber-900/30 sticky top-0 z-10">
        <h1 className="text-2xl font-heading font-bold text-secondary dark:text-amber-50">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Track your business performance.</p>
      </div>

      <div className="px-6 mt-6 flex flex-col gap-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Revenue</p>
            <h3 className="text-xl font-bold text-green-600 dark:text-green-400">₹30,500</h3>
          </GlassCard>
          <GlassCard className="p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Honey Sold</p>
            <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400">142 kg</h3>
          </GlassCard>
        </div>

        <ChartCard title="Monthly Sales (₹)" data={salesData} type="line" color="#10B981" />
        <ChartCard title="Daily Profile Views" data={viewsData} type="bar" color="#D97706" />
      </div>

      <BottomNav role={user?.role} />
    </motion.div>
  );
};

export default Analytics;
