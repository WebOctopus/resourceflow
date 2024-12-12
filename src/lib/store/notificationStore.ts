import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Notification } from '../types/notification';

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

const initialState = {
  notifications: [],
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          read: false,
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }));
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },

      deleteNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      clearAll: () => {
        set({ notifications: [] });
      },
    }),
    {
      name: 'notification-storage',
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