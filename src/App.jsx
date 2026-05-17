import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './services/firebase';
import useAuthStore from './store/authStore';
import useThemeStore from './store/themeStore';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';
import './i18n';

function App() {
  const setUser = useAuthStore(state => state.setUser);
  const logout = useAuthStore(state => state.logout);
  const theme = useThemeStore(state => state.theme);

  useEffect(() => {
    // Listen to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in to Firebase. Check if they have a Firestore profile.
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser({ uid: firebaseUser.uid, ...userDoc.data() });
          } else {
            // They are authenticated but haven't finished profile setup
            // AppRoutes logic handles this by allowing access to profile setup
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        // User is signed out
        logout();
      }
    });

    return () => unsubscribe();
  }, [setUser, logout]);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <div className="font-body text-secondary dark:text-amber-50">
        <Toaster position="top-center" />
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
