import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const registrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  confirmPassword: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegistrationData = z.infer<typeof registrationSchema>;

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  emailVerified: boolean;
  avatar?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}