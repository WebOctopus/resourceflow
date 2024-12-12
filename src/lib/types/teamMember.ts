export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  managerId: string;
  status: 'active' | 'inactive';
  avatar?: string;
  createdAt: string;
  lastActive?: string;
}

export interface TeamMemberInvite {
  token: string;
  email: string;
  managerId: string;
  role: string;
  status: 'pending' | 'accepted' | 'expired';
  expiresAt: string;
}