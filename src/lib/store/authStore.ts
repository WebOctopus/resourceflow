import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthState, AuthUser, RegistrationData } from '../types/auth';
import { authService } from '../auth';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      register: async (data: RegistrationData) => {
        set({ isLoading: true, error: null });
        try {
          const user = await authService.register(data);
          set({ user, isAuthenticated: true });
          return user;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Registration failed' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { user } = await authService.login(email, password);
          set({ user, isAuthenticated: true });
          return { user };
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Login failed' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set(initialState);
        localStorage.removeItem('auth-storage');
      },

      updateUser: async (updates: Partial<AuthUser>) => {
        set({ isLoading: true, error: null });
        try {
          const currentUser = get().user;
          if (!currentUser) throw new Error('No user logged in');

          const updatedUser = { ...currentUser, ...updates };
          await authService.updateProfile(updatedUser);
          set({ user: updatedUser, isLoading: false });
          return updatedUser;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Update failed',
            isLoading: false 
          });
          throw error;
        }
      },

      updatePassword: async (currentPassword: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        try {
          const user = get().user;
          if (!user) throw new Error('No user logged in');
          
          await authService.updatePassword(user.id, currentPassword, newPassword);
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Password update failed',
            isLoading: false 
          });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return initialState;
        }
        return persistedState as AuthState;
      },
    }
  )
);