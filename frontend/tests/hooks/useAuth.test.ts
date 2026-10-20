import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { AxiosError } from 'axios';
import { useAuth } from '../../src/hooks/useAuth';
import { authService } from '../../src/services/authService';

vi.mock('../../src/services/authService', () => ({
  authService: {
    getCurrentUser: vi.fn(),
    register: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
  },
}));

const user = { id: 'u1', email: 'a@example.com', created_at: '2026-10-12T00:00:00Z' };

const setup = async () => {
  // On mount useAuth checks the session; start logged out.
  vi.mocked(authService.getCurrentUser).mockRejectedValueOnce(new Error('401'));
  const hook = renderHook(() => useAuth());
  await waitFor(() => expect(hook.result.current.isLoading).toBe(false));
  return hook;
};

describe('useAuth.register', () => {
  beforeEach(() => {
    Object.values(authService).forEach((fn) => vi.mocked(fn).mockReset());
  });

  it('creates the account, signs in, then loads the user', async () => {
    const { result } = await setup();
    vi.mocked(authService.register).mockResolvedValueOnce(user);
    vi.mocked(authService.login).mockResolvedValueOnce({ access_token: 't', token_type: 'bearer' });
    vi.mocked(authService.getCurrentUser).mockResolvedValueOnce(user);

    await act(async () => {
      await result.current.register('a@example.com', 'securepassword123');
    });

    expect(authService.register).toHaveBeenCalledWith({
      email: 'a@example.com',
      password: 'securepassword123',
    });
    expect(authService.login).toHaveBeenCalledWith({
      email: 'a@example.com',
      password: 'securepassword123',
    });
    expect(result.current.user).toEqual(user);
    expect(result.current.error).toBeNull();
  });

  it('shows the API message and does not try to sign in when registration fails', async () => {
    const response = {
      status: 400,
      statusText: '',
      data: { detail: 'Email already registered' },
      headers: {},
      config: { headers: {} },
    } as never;
    vi.mocked(authService.register).mockRejectedValueOnce(
      new AxiosError('bad', 'ERR_BAD_REQUEST', undefined, undefined, response)
    );
    const { result } = await setup();

    await act(async () => {
      await expect(result.current.register('a@example.com', 'securepassword123')).rejects.toThrow();
    });

    expect(result.current.error).toBe('Email already registered');
    expect(authService.login).not.toHaveBeenCalled();
    expect(result.current.user).toBeNull();
  });

  it('explains when the account was created but sign-in failed', async () => {
    vi.mocked(authService.register).mockResolvedValueOnce(user);
    vi.mocked(authService.login).mockRejectedValueOnce(new Error('boom'));
    const { result } = await setup();

    await act(async () => {
      await expect(result.current.register('a@example.com', 'securepassword123')).rejects.toThrow();
    });

    expect(result.current.error).toMatch(/account created/i);
  });
});
