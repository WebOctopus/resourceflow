import { TeamMember, TeamMemberInvite } from '../types/teamMember';
import { generateId } from '../utils';
import { useTeamMemberStore } from '../store/teamMemberStore';

export class TeamMemberService {
  static async createTeamMember(data: {
    name: string;
    email: string;
    role: string;
    managerId: string;
  }): Promise<TeamMember> {
    const newMember: TeamMember = {
      id: generateId(),
      name: data.name,
      email: data.email,
      role: data.role,
      managerId: data.managerId,
      status: 'active',
      createdAt: new Date().toISOString(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`,
    };

    useTeamMemberStore.getState().addTeamMember(newMember, data.managerId);
    return newMember;
  }

  static async validateInvitation(token: string): Promise<TeamMemberInvite> {
    // In a real app, validate against database
    // For demo, decode the token
    try {
      const decoded = JSON.parse(atob(token));
      if (new Date(decoded.expiresAt) < new Date()) {
        throw new Error('Invitation has expired');
      }
      return decoded;
    } catch (error) {
      throw new Error('Invalid invitation');
    }
  }

  static async acceptInvitation(token: string, userData: {
    name: string;
    password: string;
  }): Promise<TeamMember> {
    const invite = await this.validateInvitation(token);
    
    return this.createTeamMember({
      name: userData.name,
      email: invite.email,
      role: invite.role,
      managerId: invite.managerId,
    });
  }
}