import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Phone, MapPin, Heart } from 'lucide-react';
import { db } from '../../services/firebase';
import Loader from '../../components/common/Loader';
import FreshnessBadge from '../../components/product/FreshnessBadge';
import RatingStars from '../../components/common/RatingStars';
import GlassCard from '../../components/common/GlassCard';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const unsub = onSnapshot(doc(db, 'products', id), async (docSnap) => {
      if (docSnap.exists()) {
        const prodData = { id: docSnap.id, ...docSnap.data() };
        setProduct(prodData);
        
        // Fetch vendor info
        if (prodData.vendorId) {
          const vDoc = await getDoc(doc(db, 'users', prodData.vendorId));
          if (vDoc.exists()) setVendor(vDoc.data());
        }
      }
      setLoading(false);
    });

    return () => unsub();
  }, [id]);

  if (loading) return <Loader />;
  if (!product) return <div>Product not found</div>;

  const handleWhatsApp = () => {
    if (vendor?.phone) {
      window.open(`https://wa.me/${vendor.phone}?text=Hi, I'm interested in ${product.title}`, '_blank');
    }
  };

  const handleCall = () => {
    if (vendor?.phone) {
      window.location.href = `tel:${vendor.phone}`;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background-light dark:bg-background-dark pb-32"
    >
      {/* Header / Image Gallery (Simplified to single image for now) */}
      <div className="relative w-full aspect-[4/3] bg-amber-100 dark:bg-black/50">
        <img 
          src={product.images?.[0] || 'https://via.placeholder.com/600?text=Honey'} 
          alt={product.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
            <ArrowLeft size={20} />
          </button>
          <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
            <Heart size={20} />
          </button>
        </div>
      </div>

      <div className="px-6 pt-6">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-heading font-bold text-secondary dark:text-amber-50 leading-tight">
            {product.title}
          </h1>
          <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            ₹{product.price}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <FreshnessBadge freshness={product.freshness || 'Fresh'} />
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
            {product.quantity}kg Available
          </span>
        </div>

        <div className="flex items-center gap-2 mb-6" onClick={() => navigate(`/customer/reviews/${product.id}`)}>
          <RatingStars rating={product.rating || 0} />
          <span className="text-sm font-semibold text-secondary dark:text-amber-100">
            {product.rating || 0}
          </span>
          <span className="text-sm text-amber-600 dark:text-amber-400 font-medium underline">
            ({product.reviewCount || 0} reviews)
          </span>
        </div>

        <h3 className="font-heading font-bold text-secondary dark:text-amber-50 mb-2">Description</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
          {product.description || 'Pure natural honey.'}
        </p>

        {/* Vendor Card */}
        {vendor && (
          <GlassCard className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-amber-100 overflow-hidden">
              <img src={vendor.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${vendor.name}`} alt={vendor.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-bold text-secondary dark:text-amber-50 text-sm">Harvested by {vendor.name}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                <MapPin size={12} /> {vendor.location?.address || 'Unknown location'}
              </p>
            </div>
          </GlassCard>
        )}
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-6 glass-card rounded-t-3xl border-t border-white/20 dark:border-white/10 flex gap-4 bg-white/80 dark:bg-black/80">
        <button 
          onClick={handleWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-green-500/20 active:scale-95 transition-transform"
        >
          <MessageCircle size={20} />
          WhatsApp
        </button>
        <button 
          onClick={handleCall}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
        >
          <Phone size={20} />
          Call Vendor
        </button>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
