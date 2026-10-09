import { useCallback, useEffect, useRef, useState } from 'react';
import { FoodLog } from '../types';
import { foodService } from '../services/foodService';

export const useFoodLogs = (date: string) => {
  const [logs, setLogs] = useState<FoodLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const latestRequest = useRef(0);

  const refresh = useCallback(async () => {
    const requestId = ++latestRequest.current;
    setIsLoading(true);
    setError(null);
    try {
      const data = await foodService.getLogs(date);
      // Ignore the response if the user has since switched to another date.
      if (requestId === latestRequest.current) {
        setLogs(data);
      }
    } catch (err) {
      if (requestId === latestRequest.current) {
        setError('Could not load food logs.');
      }
    } finally {
      if (requestId === latestRequest.current) {
        setIsLoading(false);
      }
    }
  }, [date]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const deleteLog = async (id: string) => {
    try {
      await foodService.deleteLog(id);
      await refresh();
    } catch (err) {
      setError('Could not delete food log.');
    }
  };

  return { logs, isLoading, error, refresh, deleteLog };
};
