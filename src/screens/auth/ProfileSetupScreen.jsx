import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import useAuthStore from '../../store/authStore';
import Input from '../../components/common/Input';
import GradientButton from '../../components/common/GradientButton';
import GlassCard from '../../components/common/GlassCard';
import ImageUploader from '../../components/common/ImageUploader';
import toast from 'react-hot-toast';

const ProfileSetupScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = useAuthStore((state) => state.role);
  const setUser = useAuthStore((state) => state.setUser);
  
  const uid = location.state?.uid;
  const phone = location.state?.phone;

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    bio: '',
  });
  const [profileImages, setProfileImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // If we arrived here without proper state, redirect back
  if (!uid || !role) {
    navigate('/role-select');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userData = {
        uid,
        phone,
        role,
        name: formData.name,
        location: { address: formData.address, lat: null, lng: null },
        language: 'en',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        profileImage: profileImages[0] || null,
        ...(role === 'vendor' ? { bio: formData.bio } : {})
      };

      await setDoc(doc(db, 'users', uid), userData);
      setUser(userData);
      
      // Route based on role
      if (role === 'customer') navigate('/customer/home');
      else navigate(`/${role}/dashboard`);
      
      
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-6 flex flex-col justify-center">
      <h1 className="text-3xl font-heading font-bold text-secondary dark:text-amber-50 mb-2">
        Complete your profile
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Tell us a bit about yourself as a {role}.
      </p>

      <GlassCard className="p-6">
        <form onSubmit={handleSave} className="flex flex-col gap-2">
          <div className="mb-4 flex flex-col items-center justify-center">
            <label className="mb-2 text-sm font-medium text-secondary dark:text-amber-100">Profile Photo</label>
            <div className="w-32">
              <ImageUploader onImagesChange={setProfileImages} maxImages={1} folder="profiles" />
            </div>
          </div>

          <Input
            id="name"
            label="Full Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
          
          <Input
            id="address"
            label="Location / Address"
            placeholder="Your city or specific area"
            value={formData.address}
            onChange={handleChange}
            required
          />

          {role === 'vendor' && (
            <div className="flex flex-col w-full mb-4">
              <label htmlFor="bio" className="mb-1 text-sm font-medium text-secondary dark:text-amber-100">
                Short Bio (Optional)
              </label>
              <textarea
                id="bio"
                rows={3}
                placeholder="Tell buyers about your honey harvesting process..."
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-amber-200 dark:border-amber-900/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-secondary dark:text-white transition-all backdrop-blur-sm"
              />
            </div>
          )}

          <div className="mt-4">
            <GradientButton type="submit" fullWidth disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Finish Setup'}
            </GradientButton>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default ProfileSetupScreen;
