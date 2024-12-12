export type UserRole = 'team_member' | 'project_manager' | 'manager' | 'client' | 'freelancer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  clientId?: string;
  createdAt: string;
  lastActive?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Rest of the types remain the same