import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { useStore } from '../../../lib/store';
import { generateId } from '../../../lib/utils';
import { Project, TeamMember } from '../../../lib/types';
import { formatCurrency } from '../../../lib/utils';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
}

export default function AddProjectModal({ isOpen, onClose, clientId }: AddProjectModalProps) {
  const { addProject, updateClient, clients, teamMembers } = useStore();
  const client = clients.find(c => c.id === clientId);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    estimatedHours: '',
  });

  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProject: Project = {
      id: generateId(),
      clientId,
      name: formData.name,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      ...(client?.billingModel === 'contract' 
        ? { budget: parseFloat(formData.budget) }
        : { estimatedHours: parseFloat(formData.estimatedHours) }
      ),
      totalHours: 0,
      status: 'On Track',
      teamMembers: selectedTeamMembers,
    };

    // Add project to store
    addProject(newProject);

    // Update client's projects array
    if (client) {
      updateClient({
        ...client,
        projects: [...client.projects, newProject],
      });
    }

    // Reset form and close modal
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      budget: '',
      estimatedHours: '',
    });
    setSelectedTeamMembers([]);
    onClose();
  };

  const toggleTeamMember = (memberId: string) => {
    setSelectedTeamMembers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-medium text-gray-900">Add New Project</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              {client?.billingModel === 'contract' ? (
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                    Project Budget ({client.currency})
                  </label>
                  <input
                    type="number"
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    id="estimatedHours"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    min="0"
                    step="1"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Estimated hours at rate of {formatCurrency(client?.hourlyRate || 0, client?.currency)}/hour (Total: {
                      formData.estimatedHours 
                        ? formatCurrency(parseFloat(formData.estimatedHours) * (client?.hourlyRate || 0), client?.currency)
                        : formatCurrency(0, client?.currency)
                    })
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Members
                </label>
                <div className="border border-gray-300 rounded-md divide-y divide-gray-200 max-h-48 overflow-y-auto">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${
                        selectedTeamMembers.includes(member.id) ? 'bg-indigo-50' : ''
                      }`}
                      onClick={() => toggleTeamMember(member.id)}
                    >
                      <div className="flex items-center flex-1">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.role}</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedTeamMembers.includes(member.id)}
                        onChange={() => toggleTeamMember(member.id)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </div>
                  ))}
                </div>
                {selectedTeamMembers.length > 0 && (
                  <p className="mt-2 text-sm text-gray-500">
                    {selectedTeamMembers.length} team member{selectedTeamMembers.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add Project
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}