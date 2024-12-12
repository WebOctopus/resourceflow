export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  category: 'bug' | 'feature' | 'improvement' | 'other';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'new' | 'under-review' | 'in-progress' | 'completed' | 'declined';
  createdAt: string;
  updatedAt: string;
}