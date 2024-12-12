import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Client, Project } from '../../lib/types';
import { useStore } from '../../lib/store';
import { useTimerStore } from '../../lib/store/timerStore';
import { calculateProjectMetrics, getProjectStatus } from '../../lib/utils/projectMetrics';
import ProjectTimeCard from '../dashboard/projects/metrics/ProjectTimeCard';
import ProjectEarningsCard from '../dashboard/projects/metrics/ProjectEarningsCard';
import ProjectProgressCard from '../dashboard/projects/metrics/ProjectProgressCard';
import { useEffect, useState } from 'react';

interface ProjectOverviewProps {
  project: Project;
  client: Client;
}

export default function ProjectOverview({ project, client }: ProjectOverviewProps) {
  const { timeEntries } = useStore();
  const { activeTimers } = useTimerStore();
  const [metrics, setMetrics] = useState(() => 
    calculateProjectMetrics(project, timeEntries, activeTimers, client)
  );

  // Update metrics every second to reflect active timers
  useEffect(() => {
    const intervalId = setInterval(() => {
      setMetrics(calculateProjectMetrics(project, timeEntries, activeTimers, client));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [project, timeEntries, activeTimers, client]);

  const status = getProjectStatus(project, metrics);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Track':
        return 'bg-green-100 text-green-800';
      case 'At Risk':
        return 'bg-red-100 text-red-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">{project.name}</h2>
            <p className="mt-1 text-sm text-gray-500">
              Started {new Date(project.startDate).toLocaleDateString()}
              {project.endDate && ` • Due ${new Date(project.endDate).toLocaleDateString()}`}
            </p>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
            {status === 'At Risk' && <AlertTriangle className="w-4 h-4 mr-1" />}
            {status === 'Completed' && <CheckCircle className="w-4 h-4 mr-1" />}
            {status}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProjectTimeCard metrics={metrics} />
          <ProjectEarningsCard metrics={metrics} client={client} />
          <ProjectProgressCard metrics={metrics} />
        </div>

        {project.description && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600">{project.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}