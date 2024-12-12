import { User } from './auth';

export interface AdminUser extends User {
  role: 'admin';
  lastLogin?: string;
  permissions: string[];
}

export interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  signupTrend: number;
}

export interface FeedbackMetrics {
  totalFeedback: number;
  averageRating: number;
  bugReports: number;
  featureRequests: number;
  improvements: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}