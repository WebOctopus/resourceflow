import { AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Client, Project } from '../../../lib/types';
import { useStore } from '../../../lib/store';
import { useTimerStore } from '../../../lib/store/timerStore';
import { calculateProjectMetrics, getProjectStatus } from '../../../lib/utils/projectMetrics';
import ProjectTimeCard from './metrics/ProjectTimeCard';
import ProjectEarningsCard from './metrics/ProjectEarningsCard';
import ProjectProgressCard from './metrics/ProjectProgressCard';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProjectOverviewProps {
  project: Project;
  client: Client;
}

export default function ProjectOverview({ project, client }: ProjectOverviewProps) {
  const navigate = useNavigate();
  const { timeEntries, updateProject, updateClient } = useStore();
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

  const handleCompleteProject = () => {
    const updatedProject = {
      ...project,
      status: 'Completed' as const,
      completedDate: new Date().toISOString(),
    };

    // Update project in store
    updateProject(updatedProject);

    // Update client's projects array
    updateClient({
      ...client,
      projects: client.projects.map(p => 
        p.id === project.id ? updatedProject : p
      ),
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/dashboard/clients')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Back to Client Details"
            >
              <ArrowLeft className="h-5 w-5 text-gray-500" />
            </button>
            <div>
              <h2 className="text-lg font-medium text-gray-900">{project.name}</h2>
              <p className="mt-1 text-sm text-gray-500">
                Started {new Date(project.startDate).toLocaleDateString()}
                {project.endDate && ` • Due ${new Date(project.endDate).toLocaleDateString()}`}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
              {status === 'At Risk' && <AlertTriangle className="w-4 h-4 mr-1" />}
              {status}
            </span>
            {status !== 'Completed' && (
              <button
                onClick={handleCompleteProject}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Mark as Completed
              </button>
            )}
          </div>
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