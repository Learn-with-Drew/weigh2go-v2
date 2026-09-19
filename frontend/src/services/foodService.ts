import api from './api';
import { FoodLog } from '../types';

interface CreateFoodLogPayload {
  food_name: string;
  calories: number;
  logged_date: string;
}

export const foodService = {
  async createLog(payload: CreateFoodLogPayload): Promise<FoodLog> {
    const response = await api.post('/food', payload);
    return response.data;
  },

  async getLogs(logged_date?: string, skip: number = 0, limit: number = 100): Promise<FoodLog[]> {
    const response = await api.get('/food', {
      params: {
        logged_date,
        skip,
        limit,
      },
    });
    return response.data;
  },

  async deleteLog(logId: string): Promise<void> {
    await api.delete(`/food/${logId}`);
  },
};