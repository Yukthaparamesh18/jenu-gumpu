import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { db } from '../../services/firebase';
import useAuthStore from '../../store/authStore';
import BottomNav from '../../components/common/BottomNav';
import GlassCard from '../../components/common/GlassCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import FreshnessBadge from '../../components/product/FreshnessBadge';

const ManageProducts = () => {
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(collection(db, 'products'), where('vendorId', '==', user.uid));
    
    const unsub = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(prods);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  const toggleAvailability = async (id, currentStatus) => {
    await updateDoc(doc(db, 'products', id), { availability: !currentStatus });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, 'products', id));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-background-light dark:bg-background-dark pb-24"
    >
      <div className="pt-12 px-6 pb-4 flex justify-between items-center bg-white/50 dark:bg-black/50 backdrop-blur-xl border-b border-amber-100 dark:border-amber-900/30 sticky top-0 z-10">
        <h1 className="text-2xl font-heading font-bold text-secondary dark:text-amber-50">My Products</h1>
        <button 
          onClick={() => navigate('/vendor/add-product')}
          className="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="px-6 mt-6">
        {loading ? (
          <Loader fullScreen={false} />
        ) : products.length > 0 ? (
          <div className="flex flex-col gap-4">
            {products.map(product => (
              <GlassCard key={product.id} className="p-4 flex gap-4 overflow-hidden relative">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-amber-50 flex-shrink-0">
                  <img src={product.images?.[0] || 'https://via.placeholder.com/150'} alt={product.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-secondary dark:text-amber-50 text-sm line-clamp-1">{product.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{product.quantity}kg • ₹{product.price}/kg</p>
                    <div className="mt-1">
                      <FreshnessBadge freshness={product.freshness} />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    {/* Toggle Switch for Availability */}
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input type="checkbox" className="sr-only" checked={product.availability} onChange={() => toggleAvailability(product.id, product.availability)} />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${product.availability ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${product.availability ? 'transform translate-x-4' : ''}`}></div>
                      </div>
                      <span className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                        {product.availability ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </label>

                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/vendor/edit/${product.id}`)} className="p-1.5 text-amber-600 bg-amber-100 rounded-lg">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-1.5 text-red-600 bg-red-100 rounded-lg">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={Plus} 
            title="No products yet" 
            message="Add your first honey product to start selling." 
            actionLabel="Add Product"
            onAction={() => navigate('/vendor/add-product')}
          />
        )}
      </div>

      <BottomNav role={user?.role} />
    </motion.div>
  );
};

export default ManageProducts;
