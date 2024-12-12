import { TimeEntry, Client, TeamMember, Analytics } from '../lib/types';

export function calculateAnalytics(
  timeEntries: TimeEntry[],
  clients: Client[],
  teamMembers: TeamMember[],
  dateRange: { start: Date; end: Date }
): Analytics {
  const filteredEntries = timeEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= dateRange.start && entryDate <= dateRange.end;
  });

  // Calculate revenue
  const revenue = {
    total: 0,
    byClient: {} as Record<string, number>,
    trend: 0,
  };

  // Calculate utilization
  const utilization = {
    team: 0,
    byMember: {} as Record<string, number>,
    trend: 0,
  };

  // Calculate project stats
  const projects = {
    total: clients.reduce((sum, client) => sum + client.projects.length, 0),
    completed: 0,
    atRisk: 0,
    onTrack: 0,
  };

  // Calculate hours
  const hours = {
    total: 0,
    billable: 0,
    nonBillable: 0,
    byProject: {} as Record<string, number>,
  };

  // Process time entries
  filteredEntries.forEach(entry => {
    const duration = entry.duration / 3600; // Convert seconds to hours
    hours.total += duration;
    
    if (entry.billable) {
      hours.billable += duration;
      
      // Find client and their rate
      const client = clients.find(c => 
        c.projects.some(p => p.id === entry.projectId)
      );
      
      if (client) {
        const rate = client.contractValue / 2000; // Simplified hourly rate calculation
        const revenue = duration * rate;
        
        revenue.total += revenue;
        revenue.byClient[client.id] = (revenue.byClient[client.id] || 0) + revenue;
      }
    } else {
      hours.nonBillable += duration;
    }
    
    hours.byProject[entry.projectId] = (hours.byProject[entry.projectId] || 0) + duration;
  });

  // Calculate team utilization
  teamMembers.forEach(member => {
    const memberEntries = filteredEntries.filter(entry => entry.userId === member.id);
    const totalHours = memberEntries.reduce((sum, entry) => sum + entry.duration / 3600, 0);
    const utilRate = (totalHours / (40 * 4)) * 100; // Assuming 4 weeks per month
    utilization.byMember[member.id] = utilRate;
  });

  utilization.team = Object.values(utilization.byMember).reduce((sum, rate) => sum + rate, 0) / 
    Object.keys(utilization.byMember).length;

  // Count project statuses
  clients.forEach(client => {
    client.projects.forEach(project => {
      if (project.status === 'Completed') projects.completed++;
      else if (project.status === 'At Risk') projects.atRisk++;
      else if (project.status === 'On Track') projects.onTrack++;
    });
  });

  return {
    revenue,
    utilization,
    projects,
    hours,
  };
}