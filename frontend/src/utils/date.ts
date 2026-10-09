/**
 * Today's date as YYYY-MM-DD in the user's LOCAL timezone.
 *
 * Don't use `new Date().toISOString().split('T')[0]` for this: toISOString()
 * is always UTC, so in the evening (e.g. after 5pm Pacific) it returns
 * tomorrow's date.
 */
export const todayLocal = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
