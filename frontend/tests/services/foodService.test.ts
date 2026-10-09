import { describe, expect, it, vi, beforeEach } from 'vitest';
import api from '../../src/services/api';
import { foodService } from '../../src/services/foodService';

vi.mock('../../src/services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('foodService', () => {
  beforeEach(() => {
    vi.mocked(api.post).mockReset();
    vi.mocked(api.get).mockReset();
    vi.mocked(api.delete).mockReset();
  });

  it('createLog posts to /food and returns the created log', async () => {
    const payload = { food_name: 'Toast', calories: 120, logged_date: '2026-10-08' };
    vi.mocked(api.post).mockResolvedValueOnce({ data: { id: '1', ...payload } });

    const result = await foodService.createLog(payload);

    expect(api.post).toHaveBeenCalledWith('/food', payload);
    expect(result).toEqual({ id: '1', ...payload });
  });

  it('getLogs sends the date filter and pagination params', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [] });

    await foodService.getLogs('2026-10-08', 0, 50);

    expect(api.get).toHaveBeenCalledWith('/food', {
      params: { logged_date: '2026-10-08', skip: 0, limit: 50 },
    });
  });

  it('deleteLog calls DELETE on /food/:id', async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({});

    await foodService.deleteLog('abc-123');

    expect(api.delete).toHaveBeenCalledWith('/food/abc-123');
  });
});
