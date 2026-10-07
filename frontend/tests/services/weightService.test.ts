import { describe, expect, it, vi, beforeEach } from 'vitest';
import api from '../../src/services/api';
import { weightService } from '../../src/services/weightService';

vi.mock('../../src/services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('weightService', () => {
  beforeEach(() => {
    vi.mocked(api.post).mockReset();
    vi.mocked(api.get).mockReset();
    vi.mocked(api.delete).mockReset();
  });

  it('createLog posts to /weight and returns the created log', async () => {
    const mockLog = { id: '1', weight: 180, logged_date: '2026-01-01' };
    vi.mocked(api.post).mockResolvedValueOnce({ data: mockLog });

    const result = await weightService.createLog({ weight: 180, logged_date: '2026-01-01' });

    expect(api.post).toHaveBeenCalledWith('/weight', { weight: 180, logged_date: '2026-01-01' });
    expect(result).toEqual(mockLog);
  });

  it('getLogs fetches from /weight with pagination params', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [] });

    await weightService.getLogs(0, 50);

    expect(api.get).toHaveBeenCalledWith('/weight', { params: { skip: 0, limit: 50 } });
  });

  it('getTrend fetches from /weight/trend with days param', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [] });

    await weightService.getTrend(7);

    expect(api.get).toHaveBeenCalledWith('/weight/trend', { params: { days: 7 } });
  });

  it('deleteLog calls DELETE on /weight/:id', async () => {
    vi.mocked(api.delete).mockResolvedValueOnce({});

    await weightService.deleteLog('abc-123');

    expect(api.delete).toHaveBeenCalledWith('/weight/abc-123');
  });
});