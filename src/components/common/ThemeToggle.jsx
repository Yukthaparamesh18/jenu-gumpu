import React, { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import useThemeStore from '../../store/themeStore';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="p-2 rounded-full glass-card hover:bg-white/40 dark:hover:bg-black/40 transition-colors shadow-sm"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400" />
      ) : (
        <Moon className="w-5 h-5 text-secondary" />
      )}
    </motion.button>
  );
};

export default ThemeToggle;
