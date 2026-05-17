import React from 'react';
import { motion } from 'framer-motion';
import { Store, LogOut, Settings, MapPin, ChevronRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { auth } from '../../services/firebase';
import BottomNav from '../../components/common/BottomNav';
import GlassCard from '../../components/common/GlassCard';
import ThemeToggle from '../../components/common/ThemeToggle';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';

const VendorProfile = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-background-light dark:bg-background-dark pb-24"
    >
      <div className="pt-16 pb-8 px-6 bg-gradient-to-b from-amber-500/20 to-transparent">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-white dark:bg-black/50 p-1 shadow-xl mb-4 relative">
            <div className="w-full h-full rounded-full bg-amber-100 flex items-center justify-center text-amber-600 overflow-hidden">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Store size={40} />
              )}
            </div>
            <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white dark:border-black"></div>
          </div>
          <h1 className="text-2xl font-heading font-bold text-secondary dark:text-amber-50">{user?.name || 'Business Name'}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
        </div>
      </div>

      <div className="px-6 flex flex-col gap-4">
        <GlassCard className="p-4">
          <h3 className="font-bold text-secondary dark:text-amber-50 mb-2 text-sm flex items-center gap-2"><MapPin size={16} className="text-amber-500" /> Location</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{user?.location?.address || 'Not specified'}</p>
          
          <h3 className="font-bold text-secondary dark:text-amber-50 mb-1 mt-4 text-sm">Bio / About</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{user?.bio || 'Tell your customers about your honey gathering process.'}</p>
        </GlassCard>

        <GlassCard className="p-2">
          {user?.role === 'vendor' && (
            <button onClick={() => navigate('/vendor/harvest-log')} className="w-full flex items-center justify-between p-3 border-b border-gray-200 dark:border-white/10 active:bg-black/5 transition-colors">
              <div className="flex items-center gap-3 text-secondary dark:text-amber-50">
                <BookOpen size={18} className="text-amber-500" />
                <span className="font-medium">Harvest Log</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          )}
          <button className="w-full flex items-center justify-between p-3 border-b border-gray-200 dark:border-white/10 active:bg-black/5 transition-colors">
            <div className="flex items-center gap-3 text-secondary dark:text-amber-50">
              <Settings size={18} className="text-amber-500" />
              <span className="font-medium">Account Settings</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
          
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-white/10">
            <span className="font-medium text-secondary dark:text-amber-50">Theme</span>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between p-3">
            <span className="font-medium text-secondary dark:text-amber-50">Language</span>
            <LanguageSwitcher />
          </div>
        </GlassCard>

        <button 
          onClick={handleLogout}
          className="mt-4 flex items-center justify-center gap-2 p-4 text-red-500 font-bold bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 active:scale-95 transition-transform"
        >
          <LogOut size={20} />
          Log Out
        </button>
      </div>

      <BottomNav role={user?.role} />
    </motion.div>
  );
};

export default VendorProfile;
