import {
  differenceInDays,
  differenceInMonths,
  format,
  isToday,
  isYesterday,
} from "date-fns";

export function renderDateSeparator(date: Date): string {
  const now = new Date();
  const daysDiff = differenceInDays(now, date);
  const monthsDiff = differenceInMonths(now, date);

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (daysDiff < 7) return format(date, "EEEE");
  if (monthsDiff < 6) return format(date, "EEE. d MMM");
  return format(date, "d MMM, yyyy");
}
