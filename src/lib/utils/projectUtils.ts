import { Client, Project, TimeEntry } from '../types';

export const calculateProjectMetrics = (
  project: Project,
  timeEntries: TimeEntry[],
  client: Client
) => {
  const projectEntries = timeEntries.filter(entry => entry.projectId === project.id);
  
  // Calculate total seconds worked
  const totalSeconds = projectEntries.reduce((sum, entry) => sum + entry.duration, 0);
  const totalHours = totalSeconds / 3600;
  
  // Calculate earnings based on client billing model
  const earnings = client.billingModel === 'hourly' && client.hourlyRate
    ? totalHours * client.hourlyRate
    : project.budget || 0;

  // Calculate progress
  const progress = project.estimatedHours
    ? Math.min(Math.round((totalHours / project.estimatedHours) * 100), 100)
    : 0;

  // Calculate burn rate (hours per week)
  const startDate = new Date(project.startDate);
  const endDate = project.endDate ? new Date(project.endDate) : new Date();
  const weeksDuration = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)));
  const burnRate = totalHours / weeksDuration;

  // Determine if project is at risk
  const isAtRisk = project.estimatedHours && totalHours > (project.estimatedHours * 0.8);

  return {
    totalSeconds,
    totalHours,
    earnings,
    progress,
    burnRate,
    isAtRisk,
    weeksDuration,
  };
};

export const getProjectTimeline = (project: Project, timeEntries: TimeEntry[]) => {
  const startDate = new Date(project.startDate);
  const endDate = project.endDate ? new Date(project.endDate) : new Date();
  const totalWeeks = Math.ceil((endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
  
  const weeklyData = Array.from({ length: totalWeeks }, (_, weekIndex) => {
    const weekStart = new Date(startDate);
    weekStart.setDate(weekStart.getDate() + (weekIndex * 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const weekEntries = timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= weekStart && entryDate <= weekEnd;
    });

    const hoursLogged = weekEntries.reduce((sum, entry) => sum + entry.duration / 3600, 0);

    return {
      weekNumber: weekIndex + 1,
      startDate: weekStart,
      endDate: weekEnd,
      hoursLogged,
      entries: weekEntries,
    };
  });

  return {
    totalWeeks,
    weeklyData,
  };
};

export const getProjectTeamMetrics = (
  project: Project,
  timeEntries: TimeEntry[],
  teamMembers: any[]
) => {
  return project.teamMembers?.map(memberId => {
    const member = teamMembers.find(m => m.id === memberId);
    const memberEntries = timeEntries.filter(
      entry => entry.projectId === project.id && entry.userId === memberId
    );

    const totalSeconds = memberEntries.reduce((sum, entry) => sum + entry.duration, 0);
    const totalHours = totalSeconds / 3600;

    return {
      member,
      totalSeconds,
      totalHours,
      entries: memberEntries,
    };
  }) || [];
};

export const getProjectStatus = (project: Project, metrics: ReturnType<typeof calculateProjectMetrics>) => {
  if (project.status === 'Completed') {
    return 'Completed';
  }

  if (metrics.isAtRisk || metrics.burnRate > (project.estimatedHours || 0) / project.weeksDuration) {
    return 'At Risk';
  }

  return 'On Track';
};