import { describe, expect, it } from 'vitest';
import { AxiosError, AxiosHeaders } from 'axios';
import { getErrorMessage } from '../../src/utils/errors';

const axiosErrorWithResponse = (status: number, data: unknown) =>
  new AxiosError('request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
    status,
    statusText: '',
    data,
    headers: {},
    config: { headers: new AxiosHeaders() },
  });

describe('getErrorMessage', () => {
  it("returns the server's string detail", () => {
    const err = axiosErrorWithResponse(400, { detail: 'Email already registered' });
    expect(getErrorMessage(err, 'fallback')).toBe('Email already registered');
  });

  it('falls back when detail is a list of validation errors (422)', () => {
    const err = axiosErrorWithResponse(422, { detail: [{ loc: ['body', 'email'], msg: 'bad' }] });
    expect(getErrorMessage(err, 'fallback')).toBe('fallback');
  });

  it('says the server is unreachable when there is no response', () => {
    const err = new AxiosError('Network Error', 'ERR_NETWORK');
    expect(getErrorMessage(err, 'fallback')).toMatch(/could not reach the server/i);
  });

  it('falls back for errors that are not from axios', () => {
    expect(getErrorMessage(new Error('boom'), 'fallback')).toBe('fallback');
    expect(getErrorMessage('weird', 'fallback')).toBe('fallback');
  });
});
