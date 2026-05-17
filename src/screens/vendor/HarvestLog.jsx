import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Plus, NotebookPen } from 'lucide-react';
import { db } from '../../services/firebase';
import useAuthStore from '../../store/authStore';
import BottomNav from '../../components/common/BottomNav';
import GlassCard from '../../components/common/GlassCard';
import Input from '../../components/common/Input';
import GradientButton from '../../components/common/GradientButton';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

const HarvestLog = () => {
  const user = useAuthStore(state => state.user);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ date: '', quantity: '', floralSource: '', notes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(collection(db, 'harvestLogs'), where('vendorId', '==', user.uid));
    
    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      docs.sort((a, b) => new Date(b.date) - new Date(a.date));
      setLogs(docs);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addDoc(collection(db, 'harvestLogs'), {
        vendorId: user.uid,
        date: formData.date,
        quantity: Number(formData.quantity),
        floralSource: formData.floralSource,
        notes: formData.notes,
        createdAt: serverTimestamp()
      });
      setShowAdd(false);
      setFormData({ date: '', quantity: '', floralSource: '', notes: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="min-h-screen bg-background-light dark:bg-background-dark pb-24"
    >
      <div className="pt-12 px-6 pb-4 flex justify-between items-center bg-white/50 dark:bg-black/50 backdrop-blur-xl border-b border-amber-100 dark:border-amber-900/30 sticky top-0 z-10">
        <h1 className="text-2xl font-heading font-bold text-secondary dark:text-amber-50">Harvest Log</h1>
        <button onClick={() => setShowAdd(!showAdd)} className="p-2 bg-amber-500 text-white rounded-full shadow-lg">
          <Plus size={20} className={showAdd ? "rotate-45 transition-transform" : "transition-transform"} />
        </button>
      </div>

      <div className="px-6 mt-6">
        {showAdd && (
          <GlassCard className="p-4 mb-6">
            <h3 className="font-bold text-secondary dark:text-amber-50 mb-4">Log New Harvest</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <Input type="date" name="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
              <div className="grid grid-cols-2 gap-3">
                <Input type="number" label="Qty (kg)" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} required />
                <Input label="Floral Source" value={formData.floralSource} onChange={e => setFormData({...formData, floralSource: e.target.value})} required />
              </div>
              <textarea placeholder="Notes (e.g. weather conditions, location...)" rows={2} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-4 py-2 bg-white/50 dark:bg-black/20 border border-amber-200 dark:border-amber-900/50 rounded-xl text-sm" />
              <GradientButton type="submit" disabled={saving} fullWidth>{saving ? 'Saving...' : 'Save Log'}</GradientButton>
            </form>
          </GlassCard>
        )}

        {loading ? (
          <Loader fullScreen={false} />
        ) : logs.length > 0 ? (
          <div className="flex flex-col gap-3 border-l-2 border-amber-200 dark:border-amber-900/50 ml-4 pl-4 py-2">
            {logs.map(log => (
              <div key={log.id} className="relative">
                <div className="absolute -left-[23px] top-2 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-background-light dark:ring-background-dark"></div>
                <GlassCard className="p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-amber-600 dark:text-amber-400">{log.date}</span>
                    <span className="font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-100 px-2 py-0.5 rounded text-xs">{log.quantity} kg</span>
                  </div>
                  <p className="text-sm font-medium text-secondary dark:text-amber-50">{log.floralSource}</p>
                  {log.notes && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">{log.notes}</p>}
                </GlassCard>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={NotebookPen} title="No harvests logged" message="Keep track of your honey collection to maintain traceability." />
        )}
      </div>

      <BottomNav role={user?.role} />
    </motion.div>
  );
};

export default HarvestLog;
