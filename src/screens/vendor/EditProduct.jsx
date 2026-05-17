import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { db } from '../../services/firebase';
import useAuthStore from '../../store/authStore';
import Input from '../../components/common/Input';
import GradientButton from '../../components/common/GradientButton';
import GlassCard from '../../components/common/GlassCard';
import Loader from '../../components/common/Loader';

const FLORAL_SOURCES = ['Wild', 'Multi-flora', 'Eucalyptus', 'Tulsi', 'Jamun', 'Mustard', 'Other'];
const GRADES = ['A', 'B', 'C'];
const FRESHNESS_OPTS = ['Fresh', 'Aged', 'Premium'];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const docSnap = await getDoc(doc(db, 'products', id));
      if (docSnap.exists() && docSnap.data().vendorId === user?.uid) {
        setFormData(docSnap.data());
      } else {
        alert("Product not found or unauthorized");
        navigate(-1);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id, user, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDoc(doc(db, 'products', id), {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        updatedAt: serverTimestamp(),
      });
      navigate('/vendor/products');
    } catch (err) {
      console.error(err);
      alert("Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-background-light dark:bg-background-dark pb-8"
    >
      <div className="pt-12 px-6 pb-6">
        <h1 className="text-2xl font-heading font-bold text-secondary dark:text-amber-50">Edit Product</h1>
      </div>

      <div className="px-6">
        <GlassCard className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            <Input name="title" label="Product Title" value={formData?.title || ''} onChange={handleChange} required />
            
            <div className="flex flex-col w-full">
              <label className="mb-1 text-sm font-medium text-secondary dark:text-amber-100 block">Description</label>
              <textarea name="description" rows={3} value={formData?.description || ''} onChange={handleChange} required
                className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-amber-200 dark:border-amber-900/50 rounded-xl text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col w-full">
                <label className="mb-1 text-sm font-medium text-secondary dark:text-amber-100 block">Floral Source</label>
                <select name="floralSource" value={formData?.floralSource || ''} onChange={handleChange} className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-amber-200 dark:border-amber-900/50 rounded-xl text-sm">
                  {FLORAL_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex flex-col w-full">
                <label className="mb-1 text-sm font-medium text-secondary dark:text-amber-100 block">Freshness</label>
                <select name="freshness" value={formData?.freshness || ''} onChange={handleChange} className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-amber-200 dark:border-amber-900/50 rounded-xl text-sm">
                  {FRESHNESS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input name="price" type="number" label="Price (₹/kg)" value={formData?.price || ''} onChange={handleChange} required />
              <Input name="quantity" type="number" label="Available Qty (kg)" value={formData?.quantity || ''} onChange={handleChange} required />
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-1 text-sm font-medium text-secondary dark:text-amber-100 block">Grade</label>
              <select name="grade" value={formData?.grade || ''} onChange={handleChange} className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-amber-200 dark:border-amber-900/50 rounded-xl text-sm">
                {GRADES.map(s => <option key={s} value={s}>Grade {s}</option>)}
              </select>
            </div>

            <GradientButton type="submit" disabled={saving} fullWidth className="mt-4">
              {saving ? 'Saving...' : 'Save Changes'}
            </GradientButton>
            <button type="button" onClick={() => navigate(-1)} className="mt-2 py-3 text-gray-500 font-semibold w-full text-center">
              Cancel
            </button>
          </form>
        </GlassCard>
      </div>
    </motion.div>
  );
};

export default EditProduct;
