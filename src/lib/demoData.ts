import { Client, TeamMember } from './types';

export const demoClients: Client[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    email: 'contact@techcorp.com',
    phone: '+1 (555) 123-4567',
    totalHours: 45.5,
    contractValue: 50000,
    billingModel: 'contract',
    currency: 'USD',
    status: 'active',
    projects: [
      {
        id: '1',
        clientId: '1',
        name: 'Website Redesign',
        description: 'Complete overhaul of company website',
        startDate: '2024-01-01',
        budget: 25000,
        totalHours: 25.5,
        status: 'On Track',
      },
      {
        id: '2',
        clientId: '1',
        name: 'Mobile App Development',
        description: 'Native mobile app for iOS and Android',
        startDate: '2024-02-01',
        budget: 25000,
        totalHours: 20,
        status: 'At Risk',
      }
    ]
  },
  {
    id: '2',
    name: 'Global Retail Inc',
    email: 'info@globalretail.com',
    phone: '+44 20 7123 4567',
    totalHours: 32,
    contractValue: 35000,
    billingModel: 'hourly',
    hourlyRate: 150,
    currency: 'GBP',
    status: 'active',
    projects: [
      {
        id: '3',
        clientId: '2',
        name: 'E-commerce Platform',
        description: 'Custom e-commerce solution',
        startDate: '2024-01-15',
        estimatedHours: 200,
        totalHours: 32,
        status: 'On Track',
      }
    ]
  }
];

export const demoTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Jamie Smith',
    email: 'jamie@example.com',
    role: 'Project Manager',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '+1 (555) 123-4567',
    hoursThisMonth: 142,
    utilization: 85,
    projectIds: ['1', '2', '3']
  }
];