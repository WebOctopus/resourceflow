import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { AppError } from '../utils/error';
import { UserRole } from '../types';

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

export class UserAuthService {
  private users: Map<string, any> = new Map();

  async register(data: z.infer<typeof userSchema>) {
    if (this.users.has(data.email)) {
      throw new AppError('Email already registered', 'AUTH_ERROR', 409);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = {
      id: Math.random().toString(36).substr(2, 9),
      email: data.email,
      name: data.name,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    this.users.set(data.email, user);
    return this.sanitizeUser(user);
  }

  async login(email: string, password: string) {
    const user = this.users.get(email);
    if (!user) {
      throw new AppError('Invalid credentials', 'AUTH_ERROR', 401);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new AppError('Invalid credentials', 'AUTH_ERROR', 401);
    }

    return this.sanitizeUser(user);
  }

  private sanitizeUser(user: any) {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}

export const userAuthService = new UserAuthService();