// src/components/ProtectedRoute.tsx
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
