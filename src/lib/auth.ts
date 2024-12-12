import { User, AuthResponse, UserRole, AuthUser } from './types';

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

const defaultManagerUser: User = {
  id: '3',
  email: 'manager@example.com',
  name: 'Michael Chen',
  role: 'manager',
  avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  createdAt: new Date().toISOString(),
};

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // For demo purposes, always return manager user
    return {
      user: {
        ...defaultManagerUser,
        email: email,
        name: email.split('@')[0],
      },
      token: 'demo-token',
    };
  },

  register: async (data: { email: string; name: string }): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      ...defaultManagerUser,
      email: data.email,
      name: data.name,
      id: Math.random().toString(36).substr(2, 9),
    };
  },

  updateProfile: async (user: AuthUser): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    // In a real app, this would make an API call to update the user profile
    return;
  },

  updatePassword: async (userId: string, currentPassword: string, newPassword: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    // In a real app, this would verify the current password and update to the new one
    return;
  },

  validateSession: () => {
    try {
      const session = localStorage.getItem('auth-storage');
      if (!session) return false;
      
      const { state } = JSON.parse(session);
      return state.isAuthenticated && state.user;
    } catch {
      return false;
    }
  },
};