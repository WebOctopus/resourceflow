import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';

export function useAuthMiddleware() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Handle admin routes
    if (location.pathname.startsWith('/guvlog')) {
      if (!isAuthenticated || user?.role !== 'admin') {
        navigate('/login');
        return;
      }
    }

    // Handle protected routes
    if (location.pathname.startsWith('/dashboard')) {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      // Check if role is selected
      const selectedRole = localStorage.getItem('selected_role');
      if (!selectedRole && location.pathname !== '/role-selection') {
        navigate('/role-selection');
        return;
      }
    }
  }, [location.pathname, isAuthenticated, user, navigate]);
}