import { doc, updateDoc, increment, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export const analyticsService = {
  /**
   * Atomically increments the view count of a product
   */
  incrementView: async (productId) => {
    try {
      if (!productId) return;
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        views: increment(1)
      });
    } catch (error) {
      console.error("Error incrementing view:", error);
      // Fail silently to not disrupt UX
    }
  },

  /**
   * Logs a customer inquiry into the database
   */
  logInquiry: async (vendorId, productId, customerId, customerName, customerPhone, message, method = 'whatsapp') => {
    try {
      await addDoc(collection(db, 'inquiries'), {
        vendorId,
        productId,
        customerId,
        customerName,
        customerPhone,
        message,
        method,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Error logging inquiry:", error);
      throw error;
    }
  },

  /**
   * Placeholder for fetching complex vendor analytics.
   * Real implementation would require Cloud Functions aggregating data into an `analytics` collection
   * or client-side calculation from multiple queries.
   */
  getVendorAnalytics: async (vendorId) => {
    // Mock response matching the SOP schema
    return {
      totalSales: 30500,
      totalViews: 1245,
      totalProducts: 5,
      monthlyData: [
        { month: 'Jan', sales: 4000 },
        { month: 'Feb', sales: 3000 }
      ]
    };
  }
};
