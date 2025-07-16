import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store'; 

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  console.log('ProtectedRoute - Path:', location.pathname);
  console.log('ProtectedRoute - User:', user);
  console.log('ProtectedRoute - Token:', token ? 'Present' : 'Missing');
  console.log('ProtectedRoute - Require Admin:', requireAdmin);
  console.log('ProtectedRoute - User Role (from state):', user?.role);

  if (!token || !user) {
    console.log('ProtectedRoute: No token or user, redirecting to /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user && user.role && user.role.toLowerCase() !== 'admin') {
    console.log('ProtectedRoute: Admin access required but user is not admin, redirecting to /dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('ProtectedRoute: Access granted.');
  return <>{children}</>;
};

export default ProtectedRoute;