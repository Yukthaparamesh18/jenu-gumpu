import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp, limit } from 'firebase/firestore';
import { db } from './firebase';

export const productService = {
  addProduct: async (productData) => {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        rating: 0,
        reviewCount: 0,
        views: 0,
        availability: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  },

  updateProduct: async (productId, updates) => {
    try {
      await updateDoc(doc(db, 'products', productId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  getProductById: async (productId) => {
    try {
      const docSnap = await getDoc(doc(db, 'products', productId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  getProducts: async () => {
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  getProductsByVendor: async (vendorId) => {
    try {
      const q = query(collection(db, 'products'), where('vendorId', '==', vendorId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching vendor products:", error);
      throw error;
    }
  },

  searchProducts: async (searchTerm) => {
    try {
      // Basic client-side filtering approach for simple implementation
      // Production apps should use Algolia or Typesense
      const snapshot = await getDocs(collection(db, 'products'));
      const term = searchTerm.toLowerCase();
      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(p => p.title?.toLowerCase().includes(term) || p.floralSource?.toLowerCase().includes(term));
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  },

  getTrending: async (limitCount = 10) => {
    try {
      // Mocking trending by fetching first X products. Production should sort by views/rating
      const q = query(collection(db, 'products'), limit(limitCount));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching trending products:", error);
      throw error;
    }
  },

  getNearby: async (lat, lng) => {
    // In a real app, you would use GeoFire or a cloud function to query within a radius.
    // We export a placeholder that simply fetches all active products for the mock.
    return productService.getProducts();
  }
};
