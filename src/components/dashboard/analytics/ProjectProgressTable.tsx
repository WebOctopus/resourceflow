import { ArrowUp, ArrowDown } from 'lucide-react';
import { useStore } from '../../../lib/store';
import { formatCurrency } from '../../../lib/utils';

interface ProjectProgressTableProps {
  timeRange: string;
}

export default function ProjectProgressTable({ timeRange }: ProjectProgressTableProps) {
  const { clients, timeEntries } = useStore();

  // Get all projects with their client information
  const projects = clients.flatMap(client => 
    client.projects.map(project => ({
      ...project,
      clientName: client.name,
      hoursLogged: timeEntries
        .filter(entry => entry.projectId === project.id)
        .reduce((sum, entry) => sum + entry.duration / 3600, 0),
      // Calculate progress based on hours logged vs estimated hours
      progress: Math.min(
        Math.round((timeEntries
          .filter(entry => entry.projectId === project.id)
          .reduce((sum, entry) => sum + entry.duration / 3600, 0) / 
          (project.estimatedHours || 100)) * 100),
        100
      ),
    }))
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Project Progress</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hours Logged
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{project.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{project.clientName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 mt-1">{project.progress}%</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    project.status === 'On Track'
                      ? 'bg-green-100 text-green-800'
                      : project.status === 'At Risk'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {project.status === 'On Track' ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {Math.round(project.hoursLogged)} hours
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}