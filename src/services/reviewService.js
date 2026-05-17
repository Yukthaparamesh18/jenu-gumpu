import { collection, query, where, getDocs, addDoc, serverTimestamp, runTransaction, doc } from 'firebase/firestore';
import { db } from './firebase';

export const reviewService = {
  /**
   * Adds a review and uses a transaction to update the product's average rating atomically
   */
  addReview: async (productId, customerId, customerName, rating, comment, vendorId, images = []) => {
    try {
      const productRef = doc(db, 'products', productId);
      const reviewsRef = collection(db, 'reviews');

      await runTransaction(db, async (transaction) => {
        // 1. Read product document
        const productDoc = await transaction.get(productRef);
        if (!productDoc.exists()) throw new Error("Product does not exist!");
        
        const data = productDoc.data();
        const newReviewCount = (data.reviewCount || 0) + 1;
        const currentTotalRating = (data.rating || 0) * (data.reviewCount || 0);
        const newAvgRating = (currentTotalRating + rating) / newReviewCount;

        // 2. Write new review document
        const newReviewRef = doc(reviewsRef); // Creates a new document reference with an auto ID
        transaction.set(newReviewRef, {
          productId,
          vendorId,
          customerId,
          customerName,
          rating,
          comment,
          images,
          createdAt: serverTimestamp()
        });

        // 3. Update product document with new averages
        transaction.update(productRef, {
          rating: Number(newAvgRating.toFixed(1)),
          reviewCount: newReviewCount
        });
      });

      return true;
    } catch (error) {
      console.error("Error adding review:", error);
      throw error;
    }
  },

  /**
   * Gets all reviews for a specific product
   */
  getReviewsForProduct: async (productId) => {
    try {
      const q = query(collection(db, 'reviews'), where('productId', '==', productId));
      const snapshot = await getDocs(q);
      
      const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort client side for now
      return reviews.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  },

  /**
   * Helper to manually recalculate average if needed
   */
  calculateAvgRating: async (productId) => {
    try {
      const q = query(collection(db, 'reviews'), where('productId', '==', productId));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return { rating: 0, count: 0 };
      
      let sum = 0;
      snapshot.forEach(doc => { sum += doc.data().rating; });
      
      return {
        rating: Number((sum / snapshot.size).toFixed(1)),
        count: snapshot.size
      };
    } catch (error) {
      console.error("Error calculating avg rating:", error);
      throw error;
    }
  }
};
