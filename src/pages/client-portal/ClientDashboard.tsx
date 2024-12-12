import { useState } from 'react';
import { useStore } from '../../lib/store';
import ClientPortalGuide from '../../components/guide/ClientPortalGuide';
import ProjectOverview from '../../components/client-portal/ProjectOverview';
import { Clock, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { formatDuration } from '../../lib/utils';

export default function ClientDashboard() {
  const { clients } = useStore();
  const [showGuide, setShowGuide] = useState(false);
  
  // For demo purposes, using the first client
  const client = clients[0];

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Welcome, {client?.name}</h1>
          <p className="mt-1 text-sm text-gray-500">
            View your project overview and recent activity
          </p>
        </div>
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          {showGuide ? 'View Dashboard' : 'Show Guide'}
        </button>
      </div>

      {showGuide ? (
        <ClientPortalGuide />
      ) : (
        <div className="space-y-6">
          {/* Project Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Active Projects</h3>
              <p className="mt-2 text-3xl font-bold text-indigo-600">
                {client?.projects.filter(p => p.status !== 'Completed').length || 0}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Total Hours</h3>
              <p className="mt-2 text-3xl font-bold text-indigo-600">
                {formatDuration(client?.projects.reduce((sum, p) => sum + (p.totalHours * 3600), 0) || 0)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Project Requests</h3>
              <p className="mt-2 text-3xl font-bold text-indigo-600">
                {client?.projects.length || 0}
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              {client?.projects.slice(0, 3).map(project => (
                <div key={project.id} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{project.name}</h4>
                      <p className="text-sm text-gray-500">
                        {formatDuration(project.totalHours * 3600)} tracked
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      project.status === 'On Track' ? 'bg-green-100 text-green-800' :
                      project.status === 'At Risk' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="mt-2 relative">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: '70%' }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}