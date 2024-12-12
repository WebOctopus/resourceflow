import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminUser, UserMetrics, FeedbackMetrics, AuditLog } from '../types/admin';

interface AdminState {
  adminUser: AdminUser | null;
  userMetrics: UserMetrics;
  feedbackMetrics: FeedbackMetrics;
  auditLogs: AuditLog[];
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AdminState = {
  adminUser: null,
  userMetrics: {
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    signupTrend: 0,
  },
  feedbackMetrics: {
    totalFeedback: 0,
    averageRating: 0,
    bugReports: 0,
    featureRequests: 0,
    improvements: 0,
  },
  auditLogs: [],
  isAuthenticated: false,
  error: null,
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      ...initialState,

      login: async (email: string, password: string) => {
        try {
          if (email === 'jamie@weboctopus.co.uk' && password === 'Tomatotable1*') {
            const adminUser: AdminUser = {
              id: 'admin',
              email,
              name: 'Admin User',
              role: 'admin',
              permissions: ['all'],
              createdAt: new Date().toISOString(),
            };
            set({ adminUser, isAuthenticated: true, error: null });
          } else {
            throw new Error('Invalid admin credentials');
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Login failed' });
          throw error;
        }
      },

      logout: () => {
        set(initialState);
      },

      updateUserMetrics: (metrics) => {
        set((state) => ({
          userMetrics: { ...state.userMetrics, ...metrics },
        }));
      },

      updateFeedbackMetrics: (metrics) => {
        set((state) => ({
          feedbackMetrics: { ...state.feedbackMetrics, ...metrics },
        }));
      },

      addAuditLog: (log) => {
        const newLog: AuditLog = {
          ...log,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          auditLogs: [newLog, ...state.auditLogs],
        }));
      },
    }),
    {
      name: 'admin-storage',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return initialState;
        }
        return persistedState as AdminState;
      },
    }
  )
);