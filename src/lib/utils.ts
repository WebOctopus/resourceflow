import { Currency } from './store/settingsStore';

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const formatCurrency = (amount: number, currency: Currency = 'USD'): string => {
  const formatter = new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-GB', {
    style: 'currency',
    currency,
  });
  return formatter.format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const calculateTotalHours = (seconds: number): number => {
  return Math.round((seconds / 3600) * 100) / 100;
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];
  
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0 || hours > 0) {
    parts.push(`${minutes}m`);
  }
  parts.push(`${remainingSeconds}s`);

  return parts.join(' ');
};

export const calculateAbsenceDuration = (duration: { days: number; hours: number; minutes: number }) => {
  return (duration.days * 24 * 60 * 60) + (duration.hours * 60 * 60) + (duration.minutes * 60);
};