import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      role: null, // 'vendor' | 'seller' | 'customer'
      isAuthenticated: false,
      isFirstLaunch: true, // Used for onboarding
      
      setUser: (userData) => set({ 
        user: userData, 
        role: userData?.role || null,
        isAuthenticated: !!userData 
      }),
      
      setRole: (role) => set({ role }),
      
      setFirstLaunchCompleted: () => set({ isFirstLaunch: false }),
      
      logout: () => set({ user: null, role: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // name of item in localStorage
      partialize: (state) => ({ 
        isFirstLaunch: state.isFirstLaunch,
        role: state.role // We might want to persist the chosen role during onboarding
      }),
    }
  )
);

export default useAuthStore;
