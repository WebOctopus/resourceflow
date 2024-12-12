import { ExternalLink } from 'lucide-react';
import { Client, TimeEntry, Timer } from '../../../../lib/types';
import { formatDuration, formatCurrency } from '../../../../lib/utils';

interface ClientProjectsProps {
  client: Client;
  timeEntries: TimeEntry[];
  activeTimers: Timer[];
  onProjectClick: (projectId: string) => void;
}

export default function ClientProjects({ 
  client, 
  timeEntries, 
  activeTimers, 
  onProjectClick 
}: ClientProjectsProps) {
  const getProjectTime = (projectId: string) => {
    // Get completed time entries
    const completedEntries = timeEntries.filter(entry => entry.projectId === projectId);
    const completedSeconds = completedEntries.reduce((sum, entry) => sum + entry.duration, 0);

    // Get active timer time
    const activeSeconds = activeTimers
      .filter(timer => timer.projectId === projectId && timer.activityType === 'project')
      .reduce((sum, timer) => {
        if (timer.isRunning && timer.startTime) {
          const currentElapsed = Math.floor((Date.now() - timer.startTime) / 1000);
          return sum + currentElapsed;
        }
        return sum + timer.elapsed;
      }, 0);

    return completedSeconds + activeSeconds;
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Projects</h3>
      <div className="space-y-4">
        {client.projects.map((project) => {
          const totalSeconds = getProjectTime(project.id);
          const totalHours = totalSeconds / 3600;
          const earnings = client.billingModel === 'hourly' && client.hourlyRate
            ? totalHours * client.hourlyRate
            : project.budget || 0;

          return (
            <div
              key={project.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-indigo-500 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{project.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDuration(totalSeconds)} tracked
                    {client.billingModel === 'hourly' && (
                      <span className="ml-2 text-indigo-600">
                        ({formatCurrency(earnings, client.currency)})
                      </span>
                    )}
                  </p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                    project.status === 'On Track' ? 'bg-green-100 text-green-800' :
                    project.status === 'At Risk' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <button 
                  onClick={() => onProjectClick(project.id)}
                  className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Details
                </button>
              </div>
            </div>
          );
        })}

        {client.projects.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No projects yet. Click "Add Project" to get started.
          </div>
        )}
      </div>
    </div>
  );
}