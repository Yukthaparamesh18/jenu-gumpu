import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import { Hexagon } from 'lucide-react'; // Placeholder for honeycomb logo

const SplashScreen = () => {
  const navigate = useNavigate();
  const { isFirstLaunch, isAuthenticated, role } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isFirstLaunch) {
        navigate('/onboarding');
      } else if (isAuthenticated && role) {
        navigate(`/${role}/dashboard`); // Assuming base route for roles is /role/dashboard or similar
      } else {
        navigate('/role-select');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, isFirstLaunch, isAuthenticated, role]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 dark:from-background-dark dark:to-black">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="relative"
      >
        <Hexagon size={120} className="text-amber-500 fill-amber-100 dark:fill-amber-900/30" strokeWidth={1} />
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* A simple bee representation */}
          <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center relative shadow-lg">
            <div className="absolute -top-1 -left-1 w-4 h-4 bg-white/80 rounded-full rotate-45" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-white/80 rounded-full -rotate-45" />
            <div className="w-8 h-1 bg-black absolute top-1/2 -translate-y-1/2" />
          </div>
        </motion.div>
      </motion.div>
      
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-4xl font-heading font-bold text-secondary dark:text-amber-400"
      >
        Jenu Gumpu
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-2 text-sm text-gray-600 dark:text-gray-400 font-medium tracking-wide"
      >
        From Hive to Home — Pure Honey, Real People.
      </motion.p>
    </div>
  );
};

export default SplashScreen;
