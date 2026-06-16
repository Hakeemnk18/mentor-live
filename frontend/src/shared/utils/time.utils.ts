/**
 * Converts "HH:MM" or ISO date strings to "h:mm AM/PM" display format.
 * Falls back to the raw string if neither format is recognised.
 */
export const formatTimeAMPM = (time: string | undefined | null): string => {
  if (!time) return "—";

  // "HH:MM" — pure arithmetic, no timezone ambiguity
  const hhmmMatch = time.match(/^(\d{1,2}):(\d{2})$/);
  if (hhmmMatch) {
    const h = parseInt(hhmmMatch[1], 10);
    const m = parseInt(hhmmMatch[2], 10);
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, "0")} ${period}`;
  }

  // ISO / full date string — slot times are stored as UTC digits that
  // represent the intended IST wall-clock time, so always read them
  // back in UTC regardless of the viewer's browser timezone
  const d = new Date(time);
  if (!isNaN(d.getTime())) {
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    });
  }

  return time;
};

/**
 * Converts "HH:MM" or ISO date strings to minutes-since-midnight.
 * ISO strings are read via UTC getters, matching `formatTimeAMPM`.
 * Returns null if the value can't be parsed.
 */
export const toMinutesSinceMidnight = (time: string | undefined | null): number | null => {
  if (!time) return null;

  const hhmmMatch = time.match(/^(\d{1,2}):(\d{2})$/);
  if (hhmmMatch) {
    return parseInt(hhmmMatch[1], 10) * 60 + parseInt(hhmmMatch[2], 10);
  }

  const d = new Date(time);
  if (!isNaN(d.getTime())) {
    return d.getUTCHours() * 60 + d.getUTCMinutes();
  }

  return null;
};
