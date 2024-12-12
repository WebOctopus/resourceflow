export const ROLES = {
  TEAM_MEMBER: 'team_member',
  PROJECT_MANAGER: 'project_manager',
  MANAGER: 'manager',
  CLIENT: 'client',
  FREELANCER: 'freelancer',
} as const;

export const ROLE_PERMISSIONS = {
  team_member: {
    allowedRoutes: ['/dashboard/my-projects', '/dashboard/time', '/dashboard/projects'],
    defaultRoute: '/dashboard/my-projects',
  },
  project_manager: {
    allowedRoutes: ['/dashboard', '/dashboard/clients', '/dashboard/team', '/dashboard/time'],
    defaultRoute: '/dashboard',
  },
  manager: {
    allowedRoutes: ['/dashboard', '/dashboard/clients', '/dashboard/team', '/dashboard/time', '/dashboard/analytics', '/dashboard/settings'],
    defaultRoute: '/dashboard',
  },
  client: {
    allowedRoutes: ['/client-portal'],
    defaultRoute: '/client-portal',
  },
  freelancer: {
    allowedRoutes: ['/dashboard', '/dashboard/clients', '/dashboard/team', '/dashboard/time', '/dashboard/analytics', '/dashboard/settings', '/dashboard/my-projects'],
    defaultRoute: '/dashboard',
    restrictions: {
      maxTeamMembers: 2,
    },
  },
} as const;

export const ROLE_LABELS = {
  team_member: 'Team Member',
  project_manager: 'Project Manager',
  manager: 'Manager',
  client: 'Client',
  freelancer: 'Freelancer',
} as const;