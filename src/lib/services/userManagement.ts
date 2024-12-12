import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { generateId } from '../utils';
import { UserRole } from '../types';

// Validation schemas
export const userInviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['team_member', 'project_manager', 'manager', 'client', 'freelancer']),
  department: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

export const passwordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export class UserManagementService {
  private invitations: Map<string, {
    token: string;
    email: string;
    name: string;
    role: UserRole;
    expiresAt: Date;
  }> = new Map();

  async createInvitation(data: z.infer<typeof userInviteSchema>) {
    const token = generateId();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48); // 48 hour expiration

    this.invitations.set(token, {
      token,
      email: data.email,
      name: data.name,
      role: data.role,
      expiresAt,
    });

    // In a real app, send email here
    return {
      inviteLink: `${window.location.origin}/accept-invite/${token}`,
      expiresAt,
    };
  }

  async verifyInvitation(token: string) {
    const invitation = this.invitations.get(token);
    if (!invitation) {
      throw new Error('Invalid invitation token');
    }

    if (invitation.expiresAt < new Date()) {
      this.invitations.delete(token);
      throw new Error('Invitation has expired');
    }

    return invitation;
  }

  async completeRegistration(token: string, password: string) {
    const invitation = await this.verifyInvitation(token);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = {
      id: generateId(),
      email: invitation.email,
      name: invitation.name,
      role: invitation.role,
      hashedPassword,
      createdAt: new Date().toISOString(),
      emailVerified: true,
    };

    // Remove used invitation
    this.invitations.delete(token);

    return user;
  }
}

export const userManagementService = new UserManagementService();