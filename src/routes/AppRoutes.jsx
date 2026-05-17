import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Auth Screens
import SplashScreen from '../screens/auth/SplashScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelectionScreen';
import PhoneEntryScreen from '../screens/auth/PhoneEntryScreen';
import OtpVerificationScreen from '../screens/auth/OtpVerificationScreen';
import ProfileSetupScreen from '../screens/auth/ProfileSetupScreen';

// Customer Screens
import CustomerHome from '../screens/customer/CustomerHome';
import SearchFilter from '../screens/customer/SearchFilter';
import NearbyVendors from '../screens/customer/NearbyVendors';
import ProductDetail from '../screens/customer/ProductDetail';
import ReviewsScreen from '../screens/customer/ReviewsScreen';
import CustomerProfile from '../screens/customer/CustomerProfile';
import Favorites from '../screens/customer/Favorites';
import Notifications from '../screens/customer/Notifications';

// Vendor Screens
import VendorDashboard from '../screens/vendor/VendorDashboard';
import AddProduct from '../screens/vendor/AddProduct';
import ManageProducts from '../screens/vendor/ManageProducts';
import EditProduct from '../screens/vendor/EditProduct';
import Inquiries from '../screens/vendor/Inquiries';
import Analytics from '../screens/vendor/Analytics';
import HarvestLog from '../screens/vendor/HarvestLog';
import VendorProfile from '../screens/vendor/VendorProfile';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';

const AppRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public / Auth Routes */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="/role-select" element={<RoleSelectionScreen />} />
        <Route path="/auth/phone" element={<PhoneEntryScreen />} />
        <Route path="/auth/otp" element={<OtpVerificationScreen />} />
        <Route path="/auth/profile-setup" element={<ProfileSetupScreen />} />

        {/* Customer Routes */}
        <Route element={<RoleBasedRoute allowedRoles={['customer']} />}>
          <Route path="/customer/home" element={<CustomerHome />} />
          <Route path="/customer/search" element={<SearchFilter />} />
          <Route path="/customer/nearby" element={<NearbyVendors />} />
          <Route path="/customer/product/:id" element={<ProductDetail />} />
          <Route path="/customer/reviews/:productId" element={<ReviewsScreen />} />
          <Route path="/customer/favorites" element={<Favorites />} />
          <Route path="/customer/notifications" element={<Notifications />} />
          <Route path="/customer/profile" element={<CustomerProfile />} />
        </Route>

        {/* Vendor & Seller Routes */}
        <Route element={<RoleBasedRoute allowedRoles={['vendor', 'seller']} />}>
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/vendor/products" element={<ManageProducts />} />
          <Route path="/vendor/add-product" element={<AddProduct />} />
          <Route path="/vendor/edit/:id" element={<EditProduct />} />
          <Route path="/vendor/inquiries" element={<Inquiries />} />
          <Route path="/vendor/analytics" element={<Analytics />} />
          <Route path="/vendor/harvest-log" element={<HarvestLog />} />
          <Route path="/vendor/profile" element={<VendorProfile />} />
          
          {/* Alias Seller routes to Vendor routes for simplicity as per SOP */}
          <Route path="/seller/dashboard" element={<VendorDashboard />} />
          <Route path="/seller/products" element={<ManageProducts />} />
          <Route path="/seller/profile" element={<VendorProfile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
