import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * RequireAdmin protects routes that should be accessible only by authenticated admin users.
 * If the user is not logged in or not an admin, they are redirected to the login page.
 */
export default function RequireAdmin({ children }) {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // wait for auth loading
    if (!user || !isAdmin) {
      navigate('/login', { replace: true });
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading || !user || !isAdmin) {
    return null; // could render a spinner
  }

  return <>{children}</>;
}
