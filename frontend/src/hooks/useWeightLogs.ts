import { useCallback, useEffect, useState } from 'react';
import { WeightLog, WeightTrendPoint } from '../types';
import { weightService } from '../services/weightService';

export const useWeightLogs = () => {
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [trend, setTrend] = useState<WeightTrendPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [logsData, trendData] = await Promise.all([
        weightService.getLogs(),
        weightService.getTrend(30),
      ]);
      setLogs(logsData);
      setTrend(trendData);
    } catch (err) {
      setError('Could not load weight data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const deleteLog = async (id: string) => {
    await weightService.deleteLog(id);
    await refresh();
  };

  return { logs, trend, isLoading, error, refresh, deleteLog };
};