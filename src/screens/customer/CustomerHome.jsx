import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, limit, onSnapshot } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { db } from '../../services/firebase';
import BottomNav from '../../components/common/BottomNav';
import ProductCard from '../../components/product/ProductCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ThemeToggle from '../../components/common/ThemeToggle';
import { PackageOpen } from 'lucide-react';

const CATEGORIES = ['All', 'Wild', 'Eucalyptus', 'Multi-flora', 'Tulsi', 'Jamun'];

const CustomerHome = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time listener for trending products
    const q = query(collection(db, 'products'), limit(10));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(prods);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.floralSource === activeCategory);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-background-light dark:bg-background-dark pb-24"
    >
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 pt-12 pb-8 rounded-b-3xl shadow-lg relative overflow-hidden flex flex-col">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="flex justify-between items-start z-10 mb-4">
          <h1 className="text-3xl font-heading font-bold text-white max-w-[70%] leading-tight">{t('welcome')}</h1>
          <ThemeToggle />
        </div>
        <p className="text-amber-100 text-sm max-w-xs z-10">{t('home_subtitle')}</p>
      </div>

      {/* Category Chips */}
      <div className="px-6 mt-6">
        <h2 className="text-lg font-heading font-bold text-secondary dark:text-amber-50 mb-3">{t('floral_sources')}</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                activeCategory === cat
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-white/50 dark:bg-black/30 text-gray-600 dark:text-gray-300 border border-amber-200 dark:border-amber-900/50 backdrop-blur-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Products */}
      <div className="px-6 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-heading font-bold text-secondary dark:text-amber-50">{t('trending_honey')}</h2>
          <button className="text-sm font-semibold text-amber-600 dark:text-amber-400">{t('see_all')}</button>
        </div>

        {loading ? (
          <Loader fullScreen={false} message="Loading fresh honey..." />
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={PackageOpen} 
            title="No Honey Found" 
            message={`We couldn't find any honey matching '${activeCategory}'.`} 
          />
        )}
      </div>

      <BottomNav role="customer" />
    </motion.div>
  );
};

export default CustomerHome;
