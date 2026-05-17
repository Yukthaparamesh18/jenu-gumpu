import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'kn' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleLanguage}
      className="px-3 py-1.5 rounded-full glass-card hover:bg-white/40 dark:hover:bg-black/40 transition-colors text-sm font-semibold text-primary dark:text-amber-400"
    >
      {i18n.language === 'en' ? 'ಕನ್ನಡ' : 'English'}
    </motion.button>
  );
};

export default LanguageSwitcher;
