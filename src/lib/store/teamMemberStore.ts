import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TeamMember } from '../types';

interface TeamMemberState {
  teamMembers: TeamMember[];
  addTeamMember: (member: TeamMember, managerId: string) => void;
  getTeamMembersByManager: (managerId: string) => TeamMember[];
  updateTeamMember: (memberId: string, updates: Partial<TeamMember>) => void;
  deleteTeamMember: (memberId: string) => void;
}

export const useTeamMemberStore = create<TeamMemberState>()(
  persist(
    (set, get) => ({
      teamMembers: [],
      
      addTeamMember: (member, managerId) => set(state => ({
        teamMembers: [...state.teamMembers, { ...member, managerId }]
      })),

      getTeamMembersByManager: (managerId) => {
        return get().teamMembers.filter(member => member.managerId === managerId);
      },

      updateTeamMember: (memberId, updates) => set(state => ({
        teamMembers: state.teamMembers.map(member =>
          member.id === memberId ? { ...member, ...updates } : member
        )
      })),

      deleteTeamMember: (memberId) => set(state => ({
        teamMembers: state.teamMembers.filter(member => member.id !== memberId)
      }))
    }),
    {
      name: 'team-member-storage',
      version: 1,
    }
  )
);