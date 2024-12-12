import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Feedback } from '../types/feedback';
import { useAdminStore } from './adminStore';

interface FeedbackState {
  feedback: Feedback[];
  addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateFeedbackStatus: (id: string, status: Feedback['status'], note?: string) => void;
  deleteFeedback: (id: string) => void;
  getFeedbackStats: () => {
    totalFeedback: number;
    bugReports: number;
    featureRequests: number;
    improvements: number;
    averageRating: number;
  };
}

const initialState = {
  feedback: [],
};

export const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addFeedback: (newFeedback) => {
        const feedback = {
          ...newFeedback,
          id: Math.random().toString(36).substr(2, 9),
          status: 'new',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          feedback: [feedback, ...state.feedback],
        }));

        // Update admin metrics
        const stats = get().getFeedbackStats();
        useAdminStore.getState().updateFeedbackMetrics(stats);
      },

      updateFeedbackStatus: (id, status, note) => {
        set((state) => ({
          feedback: state.feedback.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status,
                  statusNotes: note,
                  updatedAt: new Date().toISOString(),
                }
              : item
          ),
        }));
      },

      deleteFeedback: (id) => {
        set((state) => ({
          feedback: state.feedback.filter((item) => item.id !== id),
        }));
      },

      getFeedbackStats: () => {
        const feedback = get().feedback;
        return {
          totalFeedback: feedback.length,
          bugReports: feedback.filter(f => f.category === 'bug').length,
          featureRequests: feedback.filter(f => f.category === 'feature').length,
          improvements: feedback.filter(f => f.category === 'improvement').length,
          averageRating: feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.length || 0,
        };
      },
    }),
    {
      name: 'feedback-storage',
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