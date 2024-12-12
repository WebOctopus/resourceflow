import { Client, TeamMember, ResourceAllocation } from '../lib/types';

export function calculateOptimalAllocation(
  clients: Client[],
  teamMembers: TeamMember[]
): ResourceAllocation[] {
  const allocations: ResourceAllocation[] = [];
  
  // Sort clients by contract value (highest first)
  const sortedClients = [...clients].sort((a, b) => b.contractValue - a.contractValue);
  
  // Sort team members by utilization (lowest first to balance workload)
  const sortedTeamMembers = [...teamMembers].sort((a, b) => a.utilization - b.utilization);
  
  for (const client of sortedClients) {
    const totalProjectHours = client.projects.reduce((sum, project) => {
      // Estimate weekly hours needed based on project size
      const weeklyHours = Math.ceil(project.budget / 100); // Simplified calculation
      return sum + weeklyHours;
    }, 0);
    
    let remainingHours = totalProjectHours;
    let memberIndex = 0;
    
    while (remainingHours > 0 && memberIndex < sortedTeamMembers.length) {
      const member = sortedTeamMembers[memberIndex];
      
      // Calculate available hours for this member (assuming 40-hour work week)
      const availableHours = Math.floor(40 * (1 - member.utilization / 100));
      
      if (availableHours > 0) {
        const allocatedHours = Math.min(availableHours, remainingHours);
        
        client.projects.forEach(project => {
          allocations.push({
            teamMemberId: member.id,
            projectId: project.id,
            hoursPerWeek: allocatedHours / client.projects.length,
            startDate: new Date().toISOString(),
          });
        });
        
        // Update member utilization
        member.utilization += (allocatedHours / 40) * 100;
        remainingHours -= allocatedHours;
      }
      
      memberIndex++;
    }
  }
  
  return allocations;
}