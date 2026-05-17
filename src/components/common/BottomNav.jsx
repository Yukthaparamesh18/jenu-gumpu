import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, MapPin, Heart, User, LayoutDashboard, Package, MessageCircle, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = ({ role = 'customer' }) => {
  const customerNav = [
    { name: 'Home', path: '/customer/home', icon: Home },
    { name: 'Search', path: '/customer/search', icon: Search },
    { name: 'Nearby', path: '/customer/nearby', icon: MapPin },
    { name: 'Favorites', path: '/customer/favorites', icon: Heart },
    { name: 'Profile', path: '/customer/profile', icon: User },
  ];

  const vendorNav = [
    { name: 'Dashboard', path: '/vendor/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/vendor/products', icon: Package },
    { name: 'Inquiries', path: '/vendor/inquiries', icon: MessageCircle },
    { name: 'Analytics', path: '/vendor/analytics', icon: BarChart2 },
    { name: 'Profile', path: '/vendor/profile', icon: User },
  ];

  const navItems = role === 'customer' ? customerNav : vendorNav;

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-card rounded-t-3xl rounded-b-none border-t border-white/20 dark:border-white/10 z-50 safe-area-bottom pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 ${
                isActive ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  animate={isActive ? { y: -2 } : { y: 0 }}
                >
                  <item.icon size={22} className={isActive ? 'fill-amber-100 dark:fill-amber-900/30' : ''} />
                </motion.div>
                <span className="text-[10px] font-medium">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute bottom-1 w-1 h-1 rounded-full bg-amber-500"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
