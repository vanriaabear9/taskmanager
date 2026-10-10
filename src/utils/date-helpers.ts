/**
 * Date helper utilities for weekly tracking
 */

/**
 * Get the current week key in 'YYYY-WW' format (ISO week)
 * @returns Week key string like '2024-01'
 */
export function getCurrentWeekKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  
  // Calculate ISO week number
  const startOfYear = new Date(year, 0, 1);
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  
  // Format as YYYY-WW with zero-padding
  const weekString = weekNumber.toString().padStart(2, '0');
  return `${year}-${weekString}`;
}

/**
 * Check if a given week key matches the current week
 * @param weekKey - Week key in 'YYYY-WW' format (optional)
 * @returns True if weekKey matches current week, false otherwise
 */
export function isCurrentWeek(weekKey: string | undefined): boolean {
  if (!weekKey) {
    return false;
  }
  return weekKey === getCurrentWeekKey();
}
