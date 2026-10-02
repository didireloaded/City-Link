const DAY = 86400000;
const OFFSET = 2 * 3600000;

export function windhoekTime(now = Date.now()) {
  const local = new Date(now + OFFSET).toISOString();
  return { date: local.slice(0, 10), time: local.slice(11, 16) };
}

export function validateSchedule(date: string, time: string, now = Date.now()): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return "Choose a valid pickup date and time.";
  const timestamp = Date.parse(date + "T" + time + ":00+02:00");
  if (!Number.isFinite(timestamp) || windhoekTime(timestamp).date !== date) return "Choose a valid pickup date.";
  if (timestamp <= now) return "Pickup must be in the future.";
  if (timestamp > now + 30 * DAY) return "Schedule a ride within the next 30 days.";
  return null;
}
