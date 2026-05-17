import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import useAuthStore from '../../store/authStore';
import OtpInput from '../../components/auth/OtpInput';
import GradientButton from '../../components/common/GradientButton';
import GlassCard from '../../components/common/GlassCard';

const OtpVerificationScreen = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const role = useAuthStore((state) => state.role);
  
  const phoneNumber = location.state?.phoneNumber || 'your number';

  const handleVerify = async (otp) => {
    setIsLoading(true);
    setError('');

    try {
      const confirmationResult = window.confirmationResult;
      if (!confirmationResult) {
        throw new Error("No confirmation result. Please request OTP again.");
      }

      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      // Check if user exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setUser({ uid: user.uid, ...userData });
        navigate(`/${userData.role}/dashboard`);
      } else {
        // User is new, redirect to profile setup
        navigate('/auth/profile-setup', { state: { uid: user.uid, phone: user.phoneNumber } });
      }
    } catch (err) {
      console.error(err);
      setError('Invalid OTP. Please check and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-6 flex flex-col justify-center">
      <GlassCard className="p-8">
        <h2 className="text-2xl font-heading font-bold text-center text-secondary dark:text-amber-50 mb-2">
          Verify OTP
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-8">
          Code sent to <span className="font-bold text-secondary dark:text-white">{phoneNumber}</span>
        </p>

        <OtpInput length={6} onComplete={handleVerify} />
        
        {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
        {isLoading && <p className="text-amber-500 text-sm text-center mt-4">Verifying...</p>}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Didn't receive the code?{' '}
            <button className="text-amber-600 dark:text-amber-400 font-semibold" onClick={() => navigate(-1)}>
              Resend
            </button>
          </p>
        </div>
      </GlassCard>
    </div>
  );
};

export default OtpVerificationScreen;
