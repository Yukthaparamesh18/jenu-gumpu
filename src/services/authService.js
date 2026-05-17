import { signInWithPhoneNumber, signOut as firebaseSignOut, RecaptchaVerifier } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export const authService = {
  /**
   * Initializes recaptcha and sends OTP to the given phone number
   */
  sendOtp: async (phoneNumber, recaptchaContainerId = 'recaptcha-container') => {
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
          size: 'invisible'
        });
      }
      
      const formatPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const confirmationResult = await signInWithPhoneNumber(auth, formatPhone, window.recaptchaVerifier);
      window.confirmationResult = confirmationResult;
      return confirmationResult;
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw error;
    }
  },

  /**
   * Verifies the OTP and returns the user
   */
  verifyOtp: async (otpCode) => {
    try {
      const confirmationResult = window.confirmationResult;
      if (!confirmationResult) throw new Error("No OTP request found. Please request again.");
      
      const result = await confirmationResult.confirm(otpCode);
      return result.user;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  },

  /**
   * Signs out the current user
   */
  signOut: async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  },

  /**
   * Gets the current user's full profile from Firestore
   */
  getCurrentUser: async (uid) => {
    try {
      if (!uid) return null;
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() };
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  }
};
