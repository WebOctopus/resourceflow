import { Client, Project, TimeEntry, Timer } from '../types';

export interface ProjectMetrics {
  totalSeconds: number;
  totalHours: number;
  earnings: number;
  progress: number;
  burnRate: number;
  isAtRisk: boolean;
  weeksDuration: number;
  billableHours: number;
  nonBillableHours: number;
  remainingHours: number;
  estimatedCompletion: Date | null;
  activeTimers: Timer[];
  activeSeconds: number;
}

export const calculateProjectMetrics = (
  project: Project,
  timeEntries: TimeEntry[],
  activeTimers: Timer[],
  client: Client
): ProjectMetrics => {
  // Get project time entries
  const projectEntries = timeEntries.filter(entry => entry.projectId === project.id);
  
  // Get active timers for this project
  const projectTimers = activeTimers.filter(timer => 
    timer.projectId === project.id && 
    timer.activityType === 'project'
  );

  // Calculate active timer seconds
  const activeSeconds = projectTimers.reduce((sum, timer) => {
    if (timer.isRunning && timer.startTime) {
      const currentElapsed = Math.floor((Date.now() - timer.startTime) / 1000);
      return sum + currentElapsed;
    }
    return sum + timer.elapsed;
  }, 0);
  
  // Calculate completed time metrics
  const completedSeconds = projectEntries.reduce((sum, entry) => sum + entry.duration, 0);
  const totalSeconds = completedSeconds + activeSeconds;
  const totalHours = totalSeconds / 3600;
  
  // Calculate billable hours
  const billableHours = projectEntries
    .filter(entry => entry.billable)
    .reduce((sum, entry) => sum + entry.duration / 3600, 0);

  // Add active timer hours to billable if project is billable
  const activeHours = activeSeconds / 3600;
  const totalBillableHours = billableHours + activeHours; // Assuming active time is billable
  const nonBillableHours = totalHours - totalBillableHours;
  
  // Calculate earnings based on client billing model
  const earnings = client.billingModel === 'hourly' && client.hourlyRate
    ? totalBillableHours * client.hourlyRate
    : project.budget || 0;

  // Calculate progress and timeline metrics
  const startDate = new Date(project.startDate);
  const endDate = project.endDate ? new Date(project.endDate) : new Date();
  const weeksDuration = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)));
  const burnRate = totalHours / weeksDuration;
  
  // Calculate remaining work
  const remainingHours = project.estimatedHours ? Math.max(0, project.estimatedHours - totalHours) : 0;
  
  // Estimate completion date based on current burn rate
  let estimatedCompletion: Date | null = null;
  if (burnRate > 0 && remainingHours > 0) {
    estimatedCompletion = new Date();
    estimatedCompletion.setDate(estimatedCompletion.getDate() + Math.ceil(remainingHours / (burnRate / 7)));
  }

  // Calculate progress percentage including active time
  const progress = project.estimatedHours
    ? Math.min(Math.round((totalHours / project.estimatedHours) * 100), 100)
    : 0;

  // Determine if project is at risk
  const isAtRisk = project.estimatedHours && (
    totalHours > (project.estimatedHours * 0.8) ||
    (estimatedCompletion && project.endDate && estimatedCompletion > new Date(project.endDate))
  );

  return {
    totalSeconds,
    totalHours,
    earnings,
    progress,
    burnRate,
    isAtRisk,
    weeksDuration,
    billableHours: totalBillableHours,
    nonBillableHours,
    remainingHours,
    estimatedCompletion,
    activeTimers: projectTimers,
    activeSeconds,
  };
};

export const getProjectStatus = (
  project: Project,
  metrics: ProjectMetrics
): 'Completed' | 'At Risk' | 'On Track' => {
  if (project.status === 'Completed') {
    return 'Completed';
  }

  if (metrics.isAtRisk) {
    return 'At Risk';
  }

  return 'On Track';
};