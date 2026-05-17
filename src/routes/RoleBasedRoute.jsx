import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const RoleBasedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/role-select" replace />;
  }

  if (!allowedRoles.includes(role)) {
    // If they are authenticated but have the wrong role, send them to their own dashboard
    return <Navigate to={`/${role === 'customer' ? 'customer/home' : role + '/dashboard'}`} replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;
