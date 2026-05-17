import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { db } from '../../services/firebase';
import useAuthStore from '../../store/authStore';
import Input from '../../components/common/Input';
import GradientButton from '../../components/common/GradientButton';
import GlassCard from '../../components/common/GlassCard';
import ImageUploader from '../../components/common/ImageUploader';

const FLORAL_SOURCES = ['Wild', 'Multi-flora', 'Eucalyptus', 'Tulsi', 'Jamun', 'Mustard', 'Other'];
const GRADES = ['A', 'B', 'C'];
const FRESHNESS_OPTS = ['Fresh', 'Aged', 'Premium'];

const AddProduct = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    floralSource: 'Multi-flora',
    grade: 'A',
    freshness: 'Fresh',
    price: '',
    quantity: '',
  });
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const detectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, address: 'Detected Location' }),
        (err) => alert("Could not detect location. Please enable location services.")
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!images.length) return alert("Please add at least one image.");
    setLoading(true);

    try {
      // Images are already uploaded by ImageUploader which passes back URLs
      const imageUrls = images;

      // 2. Save Product
      await addDoc(collection(db, 'products'), {
        vendorId: user.uid,
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        images: imageUrls,
        location: location || user.location, // Fallback to user profile location
        availability: true,
        rating: 0,
        reviewCount: 0,
        views: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      navigate('/vendor/products');
    } catch (err) {
      console.error(err);
      alert("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-background-light dark:bg-background-dark pb-8"
    >
      <div className="pt-12 px-6 pb-6">
        <h1 className="text-2xl font-heading font-bold text-secondary dark:text-amber-50">Add Product</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">List your freshly harvested honey.</p>
      </div>

      <div className="px-6">
        <GlassCard className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            <div className="mb-2">
              <label className="mb-1 text-sm font-medium text-secondary dark:text-amber-100 block">Product Images</label>
              <ImageUploader onImagesChange={setImages} maxImages={4} folder="products" />
            </div>

            <Input name="title" label="Product Title" placeholder="e.g., Pure Wild Forest Honey" value={formData.title} onChange={handleChange} required />
            
            <div className="flex flex-col w-full">
              <label className="mb-1 text-sm font-medium text-secondary dark:text-amber-100 block">Description</label>
              <textarea name="description" rows={3} value={formData.description} onChange={handleChange} required
                className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-amber-200 dark:border-amber-900/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm backdrop-blur-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col w-full">
                <label className="mb-1 text-sm font-medium text-secondary dark:text-amber-100 block">Floral Source</label>
                <select name="floralSource" value={formData.floralSource} onChange={handleChange} className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-amber-200 dark:border-amber-900/50 rounded-xl text-sm backdrop-blur-sm">
                  {FLORAL_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex flex-col w-full">
                <label className="mb-1 text-sm font-medium text-secondary dark:text-amber-100 block">Freshness</label>
                <select name="freshness" value={formData.freshness} onChange={handleChange} className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-amber-200 dark:border-amber-900/50 rounded-xl text-sm backdrop-blur-sm">
                  {FRESHNESS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input name="price" type="number" label="Price (₹/kg)" placeholder="500" value={formData.price} onChange={handleChange} required />
              <Input name="quantity" type="number" label="Available Qty (kg)" placeholder="50" value={formData.quantity} onChange={handleChange} required />
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-1 text-sm font-medium text-secondary dark:text-amber-100 block">Grade</label>
              <select name="grade" value={formData.grade} onChange={handleChange} className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-amber-200 dark:border-amber-900/50 rounded-xl text-sm backdrop-blur-sm">
                {GRADES.map(s => <option key={s} value={s}>Grade {s}</option>)}
              </select>
            </div>

            <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-900/50">
              <div className="flex items-center gap-2 text-sm text-secondary dark:text-amber-50">
                <MapPin size={16} className="text-amber-500" />
                <span>{location ? "Location Detected" : "Use current location"}</span>
              </div>
              {!location && (
                <button type="button" onClick={detectLocation} className="text-xs font-bold text-amber-600 bg-amber-100 px-3 py-1.5 rounded-lg">
                  Detect
                </button>
              )}
            </div>

            <GradientButton type="submit" disabled={loading} fullWidth className="mt-4">
              {loading ? 'Publishing...' : 'Publish Product'}
            </GradientButton>
          </form>
        </GlassCard>
      </div>
    </motion.div>
  );
};

export default AddProduct;
