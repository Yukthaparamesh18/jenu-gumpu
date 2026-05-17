import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Filter } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import BottomNav from '../../components/common/BottomNav';
import ProductCard from '../../components/product/ProductCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

const SearchFilter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In a real app, Algolia or similar is better for full text search.
    // For now, we'll fetch some products and filter client-side for simplicity,
    // or just listen to all products if it's a small dataset.
    setLoading(true);
    const q = query(collection(db, 'products'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(prods);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProducts = products.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.floralSource?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-background-light dark:bg-background-dark pb-24 flex flex-col"
    >
      <div className="pt-12 px-6 pb-4 bg-white/50 dark:bg-black/50 backdrop-blur-xl border-b border-amber-100 dark:border-amber-900/30 sticky top-0 z-10">
        <h1 className="text-2xl font-heading font-bold text-secondary dark:text-amber-50 mb-4">Search</h1>
        
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search honey, floral source..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/70 dark:bg-black/40 border border-amber-200 dark:border-amber-900/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-secondary dark:text-white transition-all backdrop-blur-sm text-sm"
            />
          </div>
          <button className="p-3 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-200 dark:border-amber-900/50">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="px-6 mt-6 flex-grow">
        {loading ? (
          <Loader fullScreen={false} />
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={SearchIcon} 
            title="No results found" 
            message="Try adjusting your search or filters." 
          />
        )}
      </div>

      <BottomNav role="customer" />
    </motion.div>
  );
};

export default SearchFilter;
