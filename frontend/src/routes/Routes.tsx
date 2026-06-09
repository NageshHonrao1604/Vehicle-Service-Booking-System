import React from 'react';
import { BrowserRouter as Router, Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '@hooks/useAuth';

// Auth Pages
import LoginPage from '@features/auth/LoginPage';
import RegisterPage from '@features/auth/RegisterPage';

function Routes() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <RouterRoutes>
        {/* Public Auth Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />}
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute requiredRole="CUSTOMER" />}>
          <Route path="/customer/*" element={<div>Customer Dashboard</div>} />
        </Route>

        <Route element={<ProtectedRoute requiredRole="MECHANIC" />}>
          <Route path="/mechanic/*" element={<div>Mechanic Dashboard</div>} />
        </Route>

        <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
          <Route path="/admin/*" element={<div>Admin Dashboard</div>} />
        </Route>

        {/* Fallback */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </RouterRoutes>
    </Router>
  );
}

export default Routes;
