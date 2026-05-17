import React from 'react';
import { motion } from 'framer-motion';
import { User, LogOut, Shield, ChevronRight } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { auth } from '../../services/firebase';
import BottomNav from '../../components/common/BottomNav';
import GlassCard from '../../components/common/GlassCard';
import ThemeToggle from '../../components/common/ThemeToggle';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';

const CustomerProfile = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      logout();
      // Router will naturally push to role-select because of auth state change
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
      <div className="pt-16 pb-8 px-6 bg-gradient-to-b from-amber-200 to-transparent dark:from-amber-900/30">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-white dark:bg-black/50 p-1 shadow-xl mb-4">
            <div className="w-full h-full rounded-full bg-amber-100 flex items-center justify-center text-amber-600 overflow-hidden">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={40} />
              )}
            </div>
          </div>
          <h1 className="text-2xl font-heading font-bold text-secondary dark:text-amber-50">{user?.name || 'Customer User'}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.phone}</p>
        </div>
      </div>

      <div className="px-6 flex flex-col gap-4">
        <GlassCard className="p-2">
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-white/10">
            <span className="font-medium text-secondary dark:text-amber-50">Theme</span>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between p-3">
            <span className="font-medium text-secondary dark:text-amber-50">Language</span>
            <LanguageSwitcher />
          </div>
        </GlassCard>

        <GlassCard className="p-2">
          <button className="w-full flex items-center justify-between p-3 border-b border-gray-200 dark:border-white/10 active:bg-black/5 rounded-t-xl transition-colors">
            <div className="flex items-center gap-3 text-secondary dark:text-amber-50">
              <User size={18} className="text-amber-500" />
              <span className="font-medium">Edit Profile</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-3 active:bg-black/5 rounded-b-xl transition-colors">
            <div className="flex items-center gap-3 text-secondary dark:text-amber-50">
              <Shield size={18} className="text-amber-500" />
              <span className="font-medium">Privacy & Security</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </GlassCard>

        <button 
          onClick={handleLogout}
          className="mt-4 flex items-center justify-center gap-2 p-4 text-red-500 font-bold bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 active:scale-95 transition-transform"
        >
          <LogOut size={20} />
          Log Out
        </button>
      </div>

      <BottomNav role="customer" />
    </motion.div>
  );
};

export default CustomerProfile;
