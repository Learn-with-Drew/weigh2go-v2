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

  it('shows the first validation message for a 422', () => {
    const err = axiosErrorWithResponse(422, {
      detail: [{ loc: ['body', 'email'], msg: 'value is not a valid email address' }],
    });
    expect(getErrorMessage(err, 'fallback')).toBe('value is not a valid email address');
  });

  it('reports the status for a 5xx with no message (API down / proxy failure)', () => {
    const err = axiosErrorWithResponse(500, '');
    expect(getErrorMessage(err, 'fallback')).toMatch(/server had a problem \(HTTP 500\)/i);
  });

  it('includes the status in the fallback for other errors', () => {
    const err = axiosErrorWithResponse(404, {});
    expect(getErrorMessage(err, 'Registration failed')).toBe('Registration failed (HTTP 404).');
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
