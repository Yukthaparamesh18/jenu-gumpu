import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs, onSnapshot, limit } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { Package, Eye, Star, MessageCircle, ChevronRight } from 'lucide-react';
import { db } from '../../services/firebase';
import useAuthStore from '../../store/authStore';
import BottomNav from '../../components/common/BottomNav';
import GlassCard from '../../components/common/GlassCard';
import ChartCard from '../../components/vendor/ChartCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ThemeToggle from '../../components/common/ThemeToggle';

const VendorDashboard = () => {
  const { t } = useTranslation();
  const user = useAuthStore(state => state.user);
  const [stats, setStats] = useState({ products: 0, views: 0, rating: 0, inquiries: 0 });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock chart data for views
  const chartData = [
    { name: 'Mon', value: 120 }, { name: 'Tue', value: 200 },
    { name: 'Wed', value: 150 }, { name: 'Thu', value: 300 },
    { name: 'Fri', value: 250 }, { name: 'Sat', value: 400 },
    { name: 'Sun', value: 380 }
  ];

  useEffect(() => {
    if (!user?.uid) return;

    // Fetch Stats (mocked aggregations for simplicity, in production use Cloud Functions)
    const fetchStats = async () => {
      try {
        const prodQ = query(collection(db, 'products'), where('vendorId', '==', user.uid));
        const prodSnap = await getDocs(prodQ);
        const prodCount = prodSnap.size;
        
        // Mocking views and ratings for the dashboard UI
        setStats({
          products: prodCount,
          views: 1245,
          rating: 4.8,
          inquiries: 12
        });
      } catch (err) {
        console.error(err);
      }
    };

    // Listen to recent inquiries
    const inqQ = query(collection(db, 'inquiries'), where('vendorId', '==', user.uid), limit(3));
    const unsub = onSnapshot(inqQ, (snapshot) => {
      const inqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentInquiries(inqs);
      setLoading(false);
    });

    fetchStats();
    return () => unsub();
  }, [user]);

  if (loading) return <Loader />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-background-light dark:bg-background-dark pb-24"
    >
      <div className="pt-12 px-6 pb-6 bg-gradient-to-r from-amber-500 to-orange-600 rounded-b-3xl text-white shadow-lg flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-heading font-bold mb-1">{t('hello')}, {user?.name?.split(' ')[0] || 'Vendor'}</h1>
          <p className="text-amber-100 text-sm">{t('business_overview')}</p>
        </div>
        <ThemeToggle />
      </div>

      <div className="px-6 -mt-4">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <GlassCard className="p-4 flex flex-col items-center text-center">
            <Package size={24} className="text-amber-500 mb-2" />
            <span className="text-2xl font-bold text-secondary dark:text-amber-50">{stats.products}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{t('total_products')}</span>
          </GlassCard>
          <GlassCard className="p-4 flex flex-col items-center text-center">
            <Eye size={24} className="text-blue-500 mb-2" />
            <span className="text-2xl font-bold text-secondary dark:text-amber-50">{stats.views}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{t('total_views')}</span>
          </GlassCard>
          <GlassCard className="p-4 flex flex-col items-center text-center">
            <Star size={24} className="text-amber-400 mb-2" />
            <span className="text-2xl font-bold text-secondary dark:text-amber-50">{stats.rating}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{t('avg_rating')}</span>
          </GlassCard>
          <GlassCard className="p-4 flex flex-col items-center text-center">
            <MessageCircle size={24} className="text-green-500 mb-2" />
            <span className="text-2xl font-bold text-secondary dark:text-amber-50">{stats.inquiries}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{t('new_inquiries')}</span>
          </GlassCard>
        </div>

        {/* Chart */}
        <ChartCard title="Views this week" data={chartData} type="bar" color="#D97706" />

        {/* Recent Inquiries */}
        <div className="mt-6 mb-4 flex justify-between items-center">
          <h2 className="text-lg font-heading font-bold text-secondary dark:text-amber-50">{t('inquiries')}</h2>
          <button className="text-sm font-semibold text-amber-600 dark:text-amber-400">{t('see_all')}</button>
        </div>
        
        {recentInquiries.length > 0 ? (
          <div className="flex flex-col gap-3">
            {recentInquiries.map(inq => (
              <GlassCard key={inq.id} className="p-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-secondary dark:text-amber-50 text-sm">{inq.customerName}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{inq.message}</p>
                </div>
                <ChevronRight size={18} className="text-amber-500" />
              </GlassCard>
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={MessageCircle} 
            title="No recent inquiries" 
            message="When customers contact you, messages will appear here." 
          />
        )}
      </div>

      <BottomNav role={user?.role} />
    </motion.div>
  );
};

export default VendorDashboard;
