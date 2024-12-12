import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Client, TeamMember, TimeEntry, Project, ProjectRequest, AbsenceEntry } from '../types';
import { demoTeamMembers, demoClients } from '../demoData';

interface MainState {
  clients: Client[];
  teamMembers: TeamMember[];
  timeEntries: TimeEntry[];
  projectRequests: ProjectRequest[];
  absences: AbsenceEntry[];

  // Client actions
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  deleteClient: (clientId: string) => void;

  // Project actions
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;

  // Team member actions
  addTeamMember: (member: TeamMember) => void;
  updateTeamMember: (member: TeamMember) => void;
  deleteTeamMember: (memberId: string) => void;

  // Time entry actions
  addTimeEntry: (entry: TimeEntry) => void;
  updateTimeEntry: (entry: TimeEntry) => void;
  deleteTimeEntry: (entryId: string) => void;

  // Project request actions
  addProjectRequest: (request: ProjectRequest) => void;
  updateProjectRequest: (request: ProjectRequest) => void;
  deleteProjectRequest: (requestId: string) => void;

  // Absence actions
  addAbsence: (absence: AbsenceEntry) => void;
  updateAbsence: (absence: AbsenceEntry) => void;
  deleteAbsence: (absenceId: string) => void;
  getAbsencesForMonth: (userId: string, month: number, year: number) => AbsenceEntry[];
}

const initialState = {
  clients: demoClients,
  teamMembers: demoTeamMembers,
  timeEntries: [],
  projectRequests: [],
  absences: [],
};

export const useStore = create<MainState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Client actions
      addClient: (client) => set((state) => ({
        clients: [...state.clients, client],
      })),

      updateClient: (client) => set((state) => ({
        clients: state.clients.map((c) => (c.id === client.id ? client : c)),
      })),

      deleteClient: (clientId) => set((state) => ({
        clients: state.clients.filter((c) => c.id !== clientId),
      })),

      // Project actions
      addProject: (project) => set((state) => ({
        clients: state.clients.map((client) =>
          client.id === project.clientId
            ? { ...client, projects: [...client.projects, project] }
            : client
        ),
      })),

      updateProject: (project) => set((state) => ({
        clients: state.clients.map((client) =>
          client.id === project.clientId
            ? {
                ...client,
                projects: client.projects.map((p) =>
                  p.id === project.id ? project : p
                ),
              }
            : client
        ),
      })),

      deleteProject: (projectId) => set((state) => ({
        clients: state.clients.map((client) => ({
          ...client,
          projects: client.projects.filter((p) => p.id !== projectId),
        })),
      })),

      // Team member actions
      addTeamMember: (member) => set((state) => ({
        teamMembers: [...state.teamMembers, member],
      })),

      updateTeamMember: (member) => set((state) => ({
        teamMembers: state.teamMembers.map((m) => (m.id === member.id ? member : m)),
      })),

      deleteTeamMember: (memberId) => set((state) => ({
        teamMembers: state.teamMembers.filter((m) => m.id !== memberId),
      })),

      // Time entry actions
      addTimeEntry: (entry) => set((state) => ({
        timeEntries: [...state.timeEntries, entry],
      })),

      updateTimeEntry: (entry) => set((state) => ({
        timeEntries: state.timeEntries.map((e) => (e.id === entry.id ? entry : e)),
      })),

      deleteTimeEntry: (entryId) => set((state) => ({
        timeEntries: state.timeEntries.filter((e) => e.id !== entryId),
      })),

      // Project request actions
      addProjectRequest: (request) => set((state) => ({
        projectRequests: [...state.projectRequests, request],
      })),

      updateProjectRequest: (request) => set((state) => ({
        projectRequests: state.projectRequests.map((r) => 
          r.id === request.id ? request : r
        ),
      })),

      deleteProjectRequest: (requestId) => set((state) => ({
        projectRequests: state.projectRequests.filter((r) => r.id !== requestId),
      })),

      // Absence actions
      addAbsence: (absence) => set((state) => ({
        absences: [...state.absences, absence],
      })),

      updateAbsence: (absence) => set((state) => ({
        absences: state.absences.map((a) => (a.id === absence.id ? absence : a)),
      })),

      deleteAbsence: (absenceId) => set((state) => ({
        absences: state.absences.filter((a) => a.id !== absenceId),
      })),

      getAbsencesForMonth: (userId: string, month: number, year: number) => {
        const absences = get().absences;
        return absences.filter((absence) => {
          const absenceDate = new Date(absence.date);
          return (
            absence.userId === userId &&
            absenceDate.getMonth() === month &&
            absenceDate.getFullYear() === year
          );
        });
      },
    }),
    {
      name: 'resource-flow-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            ...initialState,
            ...persistedState,
            absences: [], // Add new state field
          };
        }
        return persistedState as MainState;
      },
    }
  )
);