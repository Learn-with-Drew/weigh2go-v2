import api from './api';
import { User } from '../types';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<User> {
    const response = await api.post('/auth/register', payload);
    return response.data;
  },

  async login(payload: LoginPayload): Promise<{ access_token: string; token_type: string }> {
    const response = await api.post('/auth/login', payload);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data;
  },
};