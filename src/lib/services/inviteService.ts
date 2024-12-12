import { InviteToken } from '../types/invite';

export class InviteService {
  private static generateToken(): string {
    return Math.random().toString(36).substr(2);
  }

  static createInviteToken(email: string, managerId: string, role: string): string {
    const token: InviteToken = {
      token: this.generateToken(),
      email,
      managerId,
      role,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours
    };

    // In a real app, save this to the database
    // For demo, we'll encode it in the URL
    return btoa(JSON.stringify(token));
  }

  static getInviteUrl(token: string): string {
    return `${window.location.origin}/accept-invite/${token}`;
  }
}