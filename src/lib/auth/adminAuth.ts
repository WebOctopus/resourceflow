import { AppError } from '../utils/error';

interface AdminCredentials {
  email: string;
  password: string;
}

export class AdminAuthService {
  private readonly ADMIN_EMAIL = 'jamie@weboctopus.co.uk';
  private readonly ADMIN_PASSWORD = 'Tomatotable1*';

  async login(credentials: AdminCredentials) {
    if (credentials.email !== this.ADMIN_EMAIL || credentials.password !== this.ADMIN_PASSWORD) {
      throw new AppError('Invalid admin credentials', 'AUTH_ERROR', 401);
    }

    return {
      id: 'admin',
      email: this.ADMIN_EMAIL,
      role: 'admin',
      name: 'System Administrator',
    };
  }

  validateSession(token: string) {
    return token === 'admin-session';
  }
}

export const adminAuthService = new AdminAuthService();