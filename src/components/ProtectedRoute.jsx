import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProtectedRoute = () => {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsAuthChecked(true);
  }, []);

  if (!isAuthChecked) {
    return <div className="loading-screen">Verificando autenticação...</div>;
  }

  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    localStorage.setItem('redirectPath', location.pathname);
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;