import api from './api';
import { WeightLog, WeightTrendPoint } from '../types';

interface CreateWeightLogPayload {
  weight: number;
  logged_date: string;
}

export const weightService = {
  async createLog(payload: CreateWeightLogPayload): Promise<WeightLog> {
    const response = await api.post('/weight', payload);
    return response.data;
  },

  async getLogs(skip: number = 0, limit: number = 100): Promise<WeightLog[]> {
    const response = await api.get('/weight', {
      params: { skip, limit },
    });
    return response.data;
  },

  async getTrend(days: number = 30): Promise<WeightTrendPoint[]> {
    const response = await api.get('/weight/trend', {
      params: { days },
    });
    return response.data;
  },

  async deleteLog(logId: string): Promise<void> {
    await api.delete(`/weight/${logId}`);
  },
};