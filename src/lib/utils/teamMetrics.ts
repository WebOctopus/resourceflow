import { TeamMember, TimeEntry, Timer, Project, Client } from '../types';

export interface TeamMemberMetrics {
  totalWorkTime: number;
  breakTime: number;
  meetingTime: number;
  averageStartTime: string;
  averageEndTime: string;
  dailyMeetings: number;
  completedProjects: {
    id: string;
    name: string;
    totalTime: number;
    clientName: string;
  }[];
  activeProjects: {
    id: string;
    name: string;
    totalTime: number;
    clientName: string;
  }[];
  utilization: number;
}

export const calculateTeamMemberMetrics = (
  member: TeamMember,
  timeEntries: TimeEntry[],
  activeTimers: Timer[],
  projects: Project[],
  clients: Client[]
): TeamMemberMetrics => {
  // Get all member's time entries, including completed projects
  const memberEntries = timeEntries.filter(entry => entry.userId === member.id);
  
  // Get member's active timers
  const memberTimers = activeTimers.filter(timer => timer.userId === member.id);

  // Calculate active timer seconds for each activity type
  const getActiveTimeForActivity = (activityType: string) => 
    memberTimers
      .filter(timer => timer.activityType === activityType)
      .reduce((total, timer) => {
        if (timer.isRunning && timer.startTime) {
          const currentElapsed = Math.floor((Date.now() - timer.startTime) / 1000);
          return total + currentElapsed;
        }
        return total + timer.elapsed;
      }, 0);

  // Calculate total work time including ALL completed entries and active timers
  const completedWorkTime = memberEntries
    .filter(entry => entry.activityType === 'project')
    .reduce((sum, entry) => sum + entry.duration, 0);
  const activeWorkTime = getActiveTimeForActivity('project');
  const totalWorkTime = completedWorkTime + activeWorkTime;

  // Calculate break time
  const completedBreakTime = memberEntries
    .filter(entry => entry.activityType === 'break')
    .reduce((sum, entry) => sum + entry.duration, 0);
  const activeBreakTime = getActiveTimeForActivity('break');
  const breakTime = completedBreakTime + activeBreakTime;

  // Calculate meeting time
  const completedMeetingTime = memberEntries
    .filter(entry => entry.activityType === 'meeting')
    .reduce((sum, entry) => sum + entry.duration, 0);
  const activeMeetingTime = getActiveTimeForActivity('meeting');
  const meetingTime = completedMeetingTime + activeMeetingTime;

  // Calculate average start and end times from all entries
  const workEntries = memberEntries.filter(entry => entry.activityType === 'project');
  const startTimes = workEntries
    .map(entry => new Date(entry.date).getHours());
  const avgStart = startTimes.length > 0
    ? Math.round(startTimes.reduce((sum, time) => sum + time, 0) / startTimes.length)
    : 9; // Default to 9 AM

  // Calculate project metrics including completed projects
  const projectMetrics = new Map<string, { totalTime: number; name: string; clientName: string }>();

  // Add ALL time entries to project metrics
  memberEntries.forEach(entry => {
    if (entry.projectId) {
      const current = projectMetrics.get(entry.projectId) || { totalTime: 0, name: '', clientName: '' };
      const project = projects.find(p => p.id === entry.projectId);
      const client = clients.find(c => c.projects.some(p => p.id === entry.projectId));
      
      if (project && client) {
        projectMetrics.set(entry.projectId, {
          totalTime: current.totalTime + entry.duration,
          name: project.name,
          clientName: client.name,
        });
      }
    }
  });

  // Add active timer time to project metrics
  memberTimers
    .filter(timer => timer.projectId && timer.activityType === 'project')
    .forEach(timer => {
      const current = projectMetrics.get(timer.projectId!) || { totalTime: 0, name: '', clientName: '' };
      const project = projects.find(p => p.id === timer.projectId);
      const client = clients.find(c => c.projects.some(p => p.id === timer.projectId));
      
      if (project && client) {
        const activeTime = timer.isRunning && timer.startTime
          ? Math.floor((Date.now() - timer.startTime) / 1000)
          : timer.elapsed;

        projectMetrics.set(timer.projectId!, {
          totalTime: current.totalTime + activeTime,
          name: project.name,
          clientName: client.name,
        });
      }
    });

  // Split projects into completed and active
  const completedProjects: TeamMemberMetrics['completedProjects'] = [];
  const activeProjects: TeamMemberMetrics['activeProjects'] = [];

  projectMetrics.forEach((metrics, projectId) => {
    const project = projects.find(p => p.id === projectId);
    const projectData = {
      id: projectId,
      name: metrics.name,
      totalTime: metrics.totalTime,
      clientName: metrics.clientName,
    };

    if (project?.status === 'Completed') {
      completedProjects.push(projectData);
    } else {
      activeProjects.push(projectData);
    }
  });

  // Calculate utilization based on total work time including completed projects
  const totalPossibleHours = 40 * 4; // 40 hours per week * 4 weeks
  const totalHoursWorked = (totalWorkTime + meetingTime) / 3600;
  const utilization = Math.min(Math.round((totalHoursWorked / totalPossibleHours) * 100), 100);

  return {
    totalWorkTime,
    breakTime,
    meetingTime,
    averageStartTime: `${String(avgStart).padStart(2, '0')}:00`,
    averageEndTime: `${String(avgStart + 8).padStart(2, '0')}:00`, // Assume 8-hour workday
    dailyMeetings: Math.round(memberEntries.filter(e => e.activityType === 'meeting').length / 20), // Assume 20 workdays
    completedProjects,
    activeProjects,
    utilization,
  };
};