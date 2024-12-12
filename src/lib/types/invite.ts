export interface InviteDetails {
  token: string;
  email: string;
  managerId: string;
  managerName: string;
  companyName: string;
  role: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'expired';
}

export interface InviteToken {
  token: string;
  email: string;
  managerId: string;
  role: string;
  expiresAt: string;
}