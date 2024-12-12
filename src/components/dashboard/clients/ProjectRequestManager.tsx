import { useState } from 'react';
import { useStore } from '../../../lib/store';
import { ProjectRequest, ProjectRequestStatus, Project } from '../../../lib/types';
import { formatCurrency, generateId } from '../../../lib/utils';

export default function ProjectRequestManager() {
  const { projectRequests, updateProjectRequest, clients, addProject, updateClient } = useStore();
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequest | null>(null);
  const [statusNote, setStatusNote] = useState('');

  const handleStatusChange = (status: ProjectRequestStatus) => {
    if (!selectedRequest) return;

    const updatedRequest = {
      ...selectedRequest,
      status,
      statusNotes: statusNote,
      updatedAt: new Date().toISOString(),
    };

    // If the request is approved, create a new project
    if (status === 'approved') {
      const client = clients.find(c => c.id === selectedRequest.clientId);
      if (client) {
        const newProject: Project = {
          id: generateId(),
          clientId: client.id,
          name: selectedRequest.name,
          description: selectedRequest.description,
          startDate: new Date().toISOString(),
          budget: selectedRequest.estimatedBudget,
          totalHours: 0,
          status: 'On Track',
          teamMembers: [],
        };

        // Add the project to the store
        addProject(newProject);

        // Update the client's projects array
        updateClient({
          ...client,
          projects: [...client.projects, newProject],
        });
      }
    }

    updateProjectRequest(updatedRequest);
    setSelectedRequest(null);
    setStatusNote('');
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Project Requests</h2>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          {projectRequests.map((request) => {
            const client = clients.find(c => c.id === request.clientId);
            const isSelected = selectedRequest?.id === request.id;

            return (
              <div
                key={request.id}
                className={`border rounded-lg p-4 ${
                  isSelected ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{request.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      From: {client?.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedRequest(isSelected ? null : request)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      isSelected
                        ? 'text-indigo-700 bg-indigo-50'
                        : 'text-gray-700 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {isSelected ? 'Cancel' : 'Review'}
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Budget</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatCurrency(request.estimatedBudget, client?.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Target Date</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(request.targetDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Priority</p>
                    <p className="mt-1 text-sm text-gray-900 capitalize">
                      {request.priority}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="mt-1 text-sm text-gray-900">{request.description}</p>
                </div>

                {request.status !== 'pending' && request.statusNotes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">{request.statusNotes}</p>
                  </div>
                )}

                {isSelected && request.status === 'pending' && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Status Note
                      </label>
                      <textarea
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Add a note about this status change..."
                      />
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleStatusChange('roadmap')}
                        className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Add to Roadmap
                      </button>
                      <button
                        onClick={() => handleStatusChange('needs_call')}
                        className="px-4 py-2 text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                      >
                        Schedule Call
                      </button>
                      <button
                        onClick={() => handleStatusChange('approved')}
                        className="px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      >
                        Approve & Create Project
                      </button>
                      <button
                        onClick={() => handleStatusChange('declined')}
                        className="px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {projectRequests.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No pending project requests
            </div>
          )}
        </div>
      </div>
    </div>
  );
}