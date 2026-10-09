import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useFoodLogs } from '../../src/hooks/useFoodLogs';
import { foodService } from '../../src/services/foodService';
import { FoodLog } from '../../src/types';

vi.mock('../../src/services/foodService', () => ({
  foodService: {
    getLogs: vi.fn(),
    deleteLog: vi.fn(),
  },
}));

const makeLog = (id: string, food_name: string, date: string): FoodLog => ({
  id,
  user_id: 'u1',
  food_name,
  calories: 100,
  logged_date: date,
  created_at: `${date}T12:00:00Z`,
});

describe('useFoodLogs', () => {
  beforeEach(() => {
    vi.mocked(foodService.getLogs).mockReset();
    vi.mocked(foodService.deleteLog).mockReset();
  });

  it('loads logs for the given date', async () => {
    vi.mocked(foodService.getLogs).mockResolvedValueOnce([makeLog('1', 'Toast', '2026-10-08')]);

    const { result } = renderHook(() => useFoodLogs('2026-10-08'));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(foodService.getLogs).toHaveBeenCalledWith('2026-10-08');
    expect(result.current.logs).toHaveLength(1);
  });

  it('sets an error when loading fails', async () => {
    vi.mocked(foodService.getLogs).mockRejectedValueOnce(new Error('boom'));

    const { result } = renderHook(() => useFoodLogs('2026-10-08'));

    await waitFor(() => expect(result.current.error).toMatch(/could not load/i));
  });

  it('ignores a stale response that arrives after the date changed', async () => {
    let resolveFirst: (logs: FoodLog[]) => void = () => {};
    vi.mocked(foodService.getLogs)
      .mockImplementationOnce(
        () => new Promise<FoodLog[]>((resolve) => { resolveFirst = resolve; })
      )
      .mockResolvedValueOnce([makeLog('2', 'Pasta', '2026-10-07')]);

    const { result, rerender } = renderHook(({ date }) => useFoodLogs(date), {
      initialProps: { date: '2026-10-08' },
    });

    rerender({ date: '2026-10-07' });
    await waitFor(() => expect(result.current.logs[0]?.food_name).toBe('Pasta'));

    // The slow request for the OLD date finally resolves.
    await act(async () => {
      resolveFirst([makeLog('1', 'Toast', '2026-10-08')]);
    });

    expect(result.current.logs[0].food_name).toBe('Pasta');
  });

  it('deletes a log and refreshes the list', async () => {
    vi.mocked(foodService.getLogs)
      .mockResolvedValueOnce([makeLog('1', 'Toast', '2026-10-08')])
      .mockResolvedValueOnce([]);
    vi.mocked(foodService.deleteLog).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useFoodLogs('2026-10-08'));
    await waitFor(() => expect(result.current.logs).toHaveLength(1));

    await act(async () => {
      await result.current.deleteLog('1');
    });

    expect(foodService.deleteLog).toHaveBeenCalledWith('1');
    await waitFor(() => expect(result.current.logs).toHaveLength(0));
  });

  it('sets an error when delete fails', async () => {
    vi.mocked(foodService.getLogs).mockResolvedValue([makeLog('1', 'Toast', '2026-10-08')]);
    vi.mocked(foodService.deleteLog).mockRejectedValueOnce(new Error('boom'));

    const { result } = renderHook(() => useFoodLogs('2026-10-08'));
    await waitFor(() => expect(result.current.logs).toHaveLength(1));

    await act(async () => {
      await result.current.deleteLog('1');
    });

    expect(result.current.error).toMatch(/could not delete/i);
  });
});
