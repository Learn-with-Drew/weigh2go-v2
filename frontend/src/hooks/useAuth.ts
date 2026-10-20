import { useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { getErrorMessage } from '../utils/errors';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      await authService.login({ email, password });
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed'));
      throw err;
    }
  };

  const register = async (email: string, password: string) => {
    setError(null);
    try {
      await authService.register({ email, password });
    } catch (err) {
      setError(getErrorMessage(err, 'Registration failed'));
      throw err;
    }

    // Registering doesn't sign you in (no cookie is set), so do that next.
    try {
      await authService.login({ email, password });
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      setError('Account created, but signing in failed. Please log in.');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      setError('Logout failed');
      throw err;
    }
  };

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
  };
};