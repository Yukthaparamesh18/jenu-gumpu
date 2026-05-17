import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { MessageCircle, Phone } from 'lucide-react';
import { db } from '../../services/firebase';
import useAuthStore from '../../store/authStore';
import BottomNav from '../../components/common/BottomNav';
import GlassCard from '../../components/common/GlassCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

const Inquiries = () => {
  const user = useAuthStore(state => state.user);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    
    // In a real app, you'd orderBy timestamp. Removing orderBy here to avoid needing a composite index for the mock
    const q = query(collection(db, 'inquiries'), where('vendorId', '==', user.uid));
    
    const unsub = onSnapshot(q, (snapshot) => {
      const inqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort locally
      inqs.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));
      setInquiries(inqs);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  const handleWhatsApp = (phone) => window.open(`https://wa.me/${phone}`, '_blank');
  const handleCall = (phone) => window.location.href = `tel:${phone}`;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="min-h-screen bg-background-light dark:bg-background-dark pb-24"
    >
      <div className="pt-12 px-6 pb-4 bg-white/50 dark:bg-black/50 backdrop-blur-xl border-b border-amber-100 dark:border-amber-900/30 sticky top-0 z-10">
        <h1 className="text-2xl font-heading font-bold text-secondary dark:text-amber-50">Inquiries</h1>
      </div>

      <div className="px-6 mt-6">
        {loading ? (
          <Loader fullScreen={false} />
        ) : inquiries.length > 0 ? (
          <div className="flex flex-col gap-4">
            {inquiries.map(inq => (
              <GlassCard key={inq.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-secondary dark:text-amber-50">{inq.customerName}</h3>
                  <span className="text-[10px] text-gray-400">
                    {inq.timestamp ? new Date(inq.timestamp.toMillis()).toLocaleDateString() : 'Just now'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 bg-white/50 dark:bg-black/20 p-3 rounded-xl border border-amber-100 dark:border-amber-900/30">
                  "{inq.message}"
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleWhatsApp(inq.customerPhone)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#25D366] py-2 rounded-xl font-semibold border border-[#25D366]/30"
                  >
                    <MessageCircle size={16} /> WhatsApp
                  </button>
                  <button 
                    onClick={() => handleCall(inq.customerPhone)}
                    className="flex-1 flex items-center justify-center gap-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 py-2 rounded-xl font-semibold border border-amber-500/30"
                  >
                    <Phone size={16} /> Call
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <EmptyState icon={MessageCircle} title="No Inquiries Yet" message="When customers are interested in your honey, their messages will appear here." />
        )}
      </div>
      <BottomNav role={user?.role} />
    </motion.div>
  );
};

export default Inquiries;
