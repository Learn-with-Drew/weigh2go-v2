import axios from 'axios';

/**
 * Turn an unknown thrown value into a message that is safe to show a user.
 *
 * - String `detail` from the API (e.g. "Email already registered")  -> show it.
 * - 422 validation errors (`detail` is a list)                       -> show the first message.
 * - 5xx (API crashed, or the dev proxy can't reach it)               -> say so, with the status.
 * - No response at all (network down)                                -> say so.
 * - Anything else                                                    -> fallback + status.
 */
export function getErrorMessage(err: unknown, fallback: string): string {
  if (!axios.isAxiosError(err)) {
    return fallback;
  }
  if (!err.response) {
    return 'Could not reach the server. Please check that the API is running.';
  }

  const { status, data } = err.response;
  const detail = data?.detail;

  if (typeof detail === 'string') {
    return detail;
  }
  if (Array.isArray(detail) && typeof detail[0]?.msg === 'string') {
    return detail[0].msg;
  }
  if (status >= 500) {
    return `The server had a problem (HTTP ${status}). Check that the API is running and look at its logs.`;
  }
  return `${fallback} (HTTP ${status}).`;
}
