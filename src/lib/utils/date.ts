import { format, parseISO, isValid } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsedDate)) return 'Invalid date';
  return format(parsedDate, 'PPP');
};

export const formatShortDate = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsedDate)) return 'Invalid date';
  return format(parsedDate, 'PP');
};

export const formatTime = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsedDate)) return 'Invalid time';
  return format(parsedDate, 'p');
};

export const formatDateTime = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsedDate)) return 'Invalid date/time';
  return format(parsedDate, 'PPp');
};

export const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

export const getWeekRange = (date: Date): { start: Date; end: Date } => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
};