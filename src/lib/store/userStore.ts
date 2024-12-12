import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserSignup, UserStats } from '../types/user';

interface UserStore {
  users: UserSignup[];
  addUser: (user: Omit<UserSignup, 'id' | 'createdAt' | 'status' | 'lastLoginAt'>) => void;
  updateUserStatus: (id: string, status: 'active' | 'inactive') => void;
  updateLastLogin: (id: string) => void;
  getUserStats: () => UserStats;
}

const initialState = {
  users: [],
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      addUser: (userData) => {
        const newUser: UserSignup = {
          ...userData,
          id: Math.random().toString(36).substr(2, 9),
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };

        set((state) => ({
          users: [...state.users, newUser],
        }));

        return newUser;
      },

      updateUserStatus: (id, status) => set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? { ...user, status } : user
        ),
      })),

      updateLastLogin: (id) => set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? { ...user, lastLoginAt: new Date().toISOString() } : user
        ),
      })),

      getUserStats: () => {
        const users = get().users;
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const newUsers = users.filter(user => 
          new Date(user.createdAt) >= monthStart
        ).length;

        const activeUsers = users.filter(user => user.status === 'active').length;

        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthSignups = users.filter(user => 
          new Date(user.createdAt) >= lastMonthStart &&
          new Date(user.createdAt) < monthStart
        ).length;

        const trend = lastMonthSignups === 0 
          ? 100 
          : ((newUsers - lastMonthSignups) / lastMonthSignups) * 100;

        return {
          totalUsers: users.length,
          activeUsers,
          newUsersThisMonth: newUsers,
          signupTrend: trend,
        };
      },
    }),
    {
      name: 'user-storage',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return initialState;
        }
        return persistedState;
      },
    }
  )
);