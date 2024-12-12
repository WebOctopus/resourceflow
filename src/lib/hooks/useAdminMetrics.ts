import { useEffect } from 'react';
import { useAdminStore } from '../store/adminStore';
import { useAuthStore } from '../store';

export function useAdminMetrics() {
  const { user } = useAuthStore();
  const { addUserSession, updateUserSession, updateSystemMetrics } = useAdminStore();

  useEffect(() => {
    if (user) {
      // Start a new session
      const session = {
        userId: user.id,
        startTime: new Date().toISOString(),
        duration: 0,
      };
      addUserSession(session);

      // Update metrics periodically
      const intervalId = setInterval(() => {
        updateSystemMetrics({
          activeUsers: document.visibilityState === 'visible' ? 1 : 0,
        });
      }, 60000); // Every minute

      // End session on unmount
      return () => {
        clearInterval(intervalId);
        updateUserSession(user.id, new Date().toISOString());
      };
    }
  }, [user, addUserSession, updateUserSession, updateSystemMetrics]);
}