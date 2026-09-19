import { useState, useEffect } from 'react';
import { User } from './types';
import { authService } from './services/authService';

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
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
      throw err;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setError(null);
      const newUser = await authService.register({ email, password });
      setUser(newUser);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (err: any) {
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