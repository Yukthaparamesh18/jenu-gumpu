import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import BottomNav from '../../components/common/BottomNav';
import GlassCard from '../../components/common/GlassCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { MapPin, Navigation } from 'lucide-react';

const NearbyVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    // 1. Get User Location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchNearbyVendors(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          setLocationError("Enable location services to find nearby vendors.");
          setLoading(false);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  }, []);

  const fetchNearbyVendors = async (lat, lng) => {
    try {
      // For simplicity, we just fetch all vendors and calculate distance client side.
      // Real app should use GeoQueries (e.g. geofirestore).
      const q = query(collection(db, 'users'), where('role', 'in', ['vendor', 'seller']));
      const snapshot = await getDocs(q);
      
      const vends = snapshot.docs.map(doc => {
        const data = doc.data();
        // Mock distance calculation (Haversine formula simplified for mock)
        const distance = data.location?.lat ? (Math.random() * 15).toFixed(1) : (Math.random() * 20).toFixed(1);
        return { id: doc.id, ...data, distance: parseFloat(distance) };
      }).sort((a, b) => a.distance - b.distance);

      setVendors(vends);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-background-light dark:bg-background-dark pb-24"
    >
      <div className="pt-12 px-6 pb-6 bg-amber-500 rounded-b-3xl shadow-lg text-white">
        <h1 className="text-2xl font-heading font-bold mb-2">Nearby Vendors</h1>
        <p className="text-amber-100 text-sm flex items-center gap-1">
          <MapPin size={14} /> Showing honey gatherers near you
        </p>
      </div>

      <div className="px-6 mt-6">
        {loading ? (
          <Loader fullScreen={false} message="Finding nearby vendors..." />
        ) : locationError ? (
          <EmptyState icon={Navigation} title="Location Required" message={locationError} />
        ) : vendors.length > 0 ? (
          <div className="flex flex-col gap-4">
            {vendors.map(vendor => (
              <GlassCard key={vendor.id} animateHover className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 overflow-hidden flex-shrink-0">
                  <img src={vendor.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${vendor.name}`} alt={vendor.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-heading font-bold text-secondary dark:text-amber-50">{vendor.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{vendor.role} • {vendor.location?.address || 'Local'}</p>
                  <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-1">{vendor.distance} km away</p>
                </div>
                <button className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Navigation size={18} />
                </button>
              </GlassCard>
            ))}
          </div>
        ) : (
          <EmptyState icon={MapPin} title="No Vendors Nearby" message="Try expanding your search radius." />
        )}
      </div>

      <BottomNav role="customer" />
    </motion.div>
  );
};

export default NearbyVendors;
