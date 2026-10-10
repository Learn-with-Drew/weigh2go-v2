import axios from 'axios';

/**
 * Turn an unknown thrown value into a message that is safe to show a user.
 *
 * - Server replied with a string `detail` (e.g. "Email already registered") -> show it.
 * - No response at all (API down / proxy can't reach it)                    -> say so.
 * - Anything else (e.g. a 422 whose `detail` is a list of field errors)     -> fallback.
 */
export function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    if (!err.response) {
      return 'Could not reach the server. Please check that the API is running.';
    }
    const detail = err.response.data?.detail;
    if (typeof detail === 'string') {
      return detail;
    }
  }
  return fallback;
}
