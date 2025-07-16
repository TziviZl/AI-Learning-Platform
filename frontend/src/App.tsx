import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store, RootState } from './store';
import { setInitialAuthLoaded } from './store/slices/authSlice';

import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Settings from './pages/Settings';
import Admin from './pages/Admin';

const AppContent: React.FC = () => {
  const dispatch = useDispatch();
  const { token, user, initialLoading } = useSelector((state: RootState) => state.auth);

  const getAuthenticatedRedirectPath = () => {
    if (user?.role?.toLowerCase() === 'admin') {
      console.log('getAuthenticatedRedirectPath: User is Admin, redirecting to /admin');
      return '/admin';
    }
    console.log('getAuthenticatedRedirectPath: User is NOT Admin or role not found, redirecting to /dashboard');
    return '/dashboard';
  };

  useEffect(() => {
    if (initialLoading) {
      dispatch(setInitialAuthLoaded());
    }
  }, [dispatch, initialLoading]);

  useEffect(() => {
    if (!initialLoading && token) {
      console.log('AppContent: Initial loading complete and token present.');
      console.log('AppContent: User object at redirect decision:', user);
      console.log('AppContent: Calculated redirect path:', getAuthenticatedRedirectPath());
    }
  }, [initialLoading, token, user]);

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-lg text-gray-700">Loading user data...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to={getAuthenticatedRedirectPath()} replace /> : <Login />}
      />
      <Route
        path="/register"
        element={token ? <Navigate to={getAuthenticatedRedirectPath()} replace /> : <Register />}
      />

      <Route 
        path="/admin" 
        element={<ProtectedRoute requireAdmin={true}><Admin /></ProtectedRoute>} 
      />
      
      <Route 
        path="/dashboard" 
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
      />
      <Route 
        path="/history" 
        element={<ProtectedRoute><History /></ProtectedRoute>} 
      />
      <Route 
        path="/settings" 
        element={<ProtectedRoute><Settings /></ProtectedRoute>} 
      />
      
      <Route
        path="/"
        element={token ? <Navigate to={getAuthenticatedRedirectPath()} replace /> : <Navigate to="/login" replace />}
      />

      <Route
        path="*"
        element={token ? <Navigate to={getAuthenticatedRedirectPath()} replace /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;