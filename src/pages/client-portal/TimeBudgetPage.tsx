import { useState } from 'react';
import { useStore } from '../../lib/store';
import { Clock, DollarSign, Calendar, Download } from 'lucide-react';
import { formatDuration, formatCurrency } from '../../lib/utils';

export default function TimeBudgetPage() {
  const { clients, timeEntries } = useStore();
  const client = clients[0]; // For demo purposes

  const getTotalBudget = () => {
    return client?.projects.reduce((sum, project) => sum + (project.budget || 0), 0) || 0;
  };

  const getTotalHours = () => {
    return client?.projects.reduce((sum, project) => sum + project.totalHours, 0) || 0;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Time & Budget</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track project time and budget utilization
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Total Hours</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {formatDuration(getTotalHours() * 3600)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Total Budget</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {formatCurrency(getTotalBudget(), client?.currency)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Active Projects</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {client?.projects.filter(p => p.status !== 'Completed').length || 0}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Project Breakdown</h3>
          <button
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-1" />
            Export Report
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {client?.projects.map((project) => (
              <div key={project.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{project.name}</h4>
                    <p className="text-sm text-gray-500">{project.description}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    project.status === 'On Track' ? 'bg-green-100 text-green-800' :
                    project.status === 'At Risk' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {project.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Hours Tracked</p>
                    <p className="text-lg font-medium text-gray-900">
                      {formatDuration(project.totalHours * 3600)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Budget Used</p>
                    <p className="text-lg font-medium text-gray-900">
                      {formatCurrency(project.budget || 0, client?.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Progress</p>
                    <div className="mt-2 relative">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div
                          style={{ width: '70%' }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}