import api from './api';
import { DashboardSummary } from '../types';

export const dashboardService = {
  async getSummary(logged_date?: string): Promise<DashboardSummary> {
    const response = await api.get('/dashboard/summary', {
      params: { logged_date },
    });
    return response.data;
  },
};