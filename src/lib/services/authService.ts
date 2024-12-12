import bcrypt from 'bcryptjs';
import { AuthUser, RegistrationData } from '../types/auth';
import { useUserStore } from '../store/userStore';

class AuthService {
  private readonly ADMIN_EMAIL = 'jamie@weboctopus.co.uk';
  private readonly ADMIN_PASSWORD = 'Tomatotable1*';

  async register(data: RegistrationData): Promise<AuthUser> {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // Create new user
    const newUser: AuthUser = {
      id: Math.random().toString(36).substr(2, 9),
      email: data.email,
      name: data.name,
      role: 'team_member',
      createdAt: new Date().toISOString(),
      emailVerified: false,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`,
    };

    // Add user to signup tracking
    const userStore = useUserStore.getState();
    userStore.addUser({
      name: data.name,
      email: data.email,
      role: 'team_member',
      avatar: newUser.avatar,
    });

    return newUser;
  }

  async login(email: string, password: string): Promise<AuthUser> {
    // For demo purposes, allow login with any credentials except admin
    if (email === this.ADMIN_EMAIL) {
      throw new Error('Please use the admin login page');
    }

    const demoUser: AuthUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      role: 'team_member',
      createdAt: new Date().toISOString(),
      emailVerified: true,
      avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`,
    };

    // Update last login time
    const userStore = useUserStore.getState();
    const existingUser = userStore.users.find(u => u.email === email);
    if (existingUser) {
      userStore.updateLastLogin(existingUser.id);
    }

    return demoUser;
  }

  async adminLogin(email: string, password: string): Promise<AuthUser> {
    if (email.toLowerCase() !== this.ADMIN_EMAIL.toLowerCase() || password !== this.ADMIN_PASSWORD) {
      throw new Error('Invalid admin credentials');
    }

    return {
      id: 'admin',
      email: this.ADMIN_EMAIL,
      name: 'System Administrator',
      role: 'admin',
      createdAt: new Date().toISOString(),
      emailVerified: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    };
  }
}

export const authService = new AuthService();