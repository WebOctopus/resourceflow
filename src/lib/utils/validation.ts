import { z } from 'zod';

export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(255, 'Email must be less than 255 characters');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be less than 100 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  );

export const phoneSchema = z
  .string()
  .regex(
    /^\+?[1-9]\d{1,14}$/,
    'Phone number must be in international format (e.g., +1234567890)'
  );

export const urlSchema = z
  .string()
  .url('Invalid URL')
  .max(2048, 'URL must be less than 2048 characters');

export const currencySchema = z
  .number()
  .min(0, 'Amount must be greater than or equal to 0')
  .max(1000000000, 'Amount must be less than 1 billion');

export const durationSchema = z
  .number()
  .min(0, 'Duration must be greater than or equal to 0')
  .max(86400, 'Duration must be less than 24 hours');

export const dateSchema = z.coerce
  .date()
  .min(new Date('2000-01-01'), 'Date must be after 2000-01-01')
  .max(new Date('2100-01-01'), 'Date must be before 2100-01-01');