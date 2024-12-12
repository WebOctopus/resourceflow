import { useState, useEffect } from 'react';
import { X, UserPlus, AlertTriangle } from 'lucide-react';
import { useStore } from '../../../lib/store';
import { Project } from '../../../lib/types';
import { useNavigate } from 'react-router-dom';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  clientId: string;
}

export default function EditProjectModal({ isOpen, onClose, project, clientId }: EditProjectModalProps) {
  const navigate = useNavigate();
  const updateProject = useStore((state) => state.updateProject);
  const updateClient = useStore((state) => state.updateClient);
  const deleteProject = useStore((state) => state.deleteProject);
  const clients = useStore((state) => state.clients);
  const teamMembers = useStore((state) => state.teamMembers);

  const [formData, setFormData] = useState({
    name: project.name || '',
    description: project.description || '',
    startDate: project.startDate || '',
    endDate: project.endDate || '',
    budget: project.budget?.toString() || '0',
    status: project.status || 'On Track',
  });

  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>(
    project.teamMembers || []
  );

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Update form data and selected team members when project changes
  useEffect(() => {
    setFormData({
      name: project.name || '',
      description: project.description || '',
      startDate: project.startDate || '',
      endDate: project.endDate || '',
      budget: project.budget?.toString() || '0',
      status: project.status || 'On Track',
    });
    setSelectedTeamMembers(project.teamMembers || []);
    setShowDeleteConfirm(false);
  }, [project]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedProject: Project = {
      ...project,
      name: formData.name,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      budget: parseFloat(formData.budget) || 0,
      status: formData.status as 'On Track' | 'At Risk' | 'Completed',
      teamMembers: selectedTeamMembers,
    };

    // Update project in store
    updateProject(updatedProject);

    // Update client's projects array
    const client = clients.find(c => c.id === clientId);
    if (client) {
      updateClient({
        ...client,
        projects: client.projects.map(p => 
          p.id === project.id ? updatedProject : p
        ),
      });
    }

    onClose();
  };

  const handleDelete = () => {
    // Delete project from store
    deleteProject(project.id);

    // Update client's projects array
    const client = clients.find(c => c.id === clientId);
    if (client) {
      updateClient({
        ...client,
        projects: client.projects.filter(p => p.id !== project.id),
      });
    }

    onClose();
    navigate('/dashboard/clients'); // Redirect to clients page after deletion
  };

  const toggleTeamMember = (memberId: string) => {
    setSelectedTeamMembers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  if (showDeleteConfirm) {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-center justify-center text-red-600 mb-4">
            <AlertTriangle className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
            Delete Project
          </h3>
          <p className="text-sm text-gray-500 text-center mb-6">
            Are you sure you want to delete "{project.name}"? This action cannot be undone.
            All associated time entries and data will be permanently removed.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Delete Project
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Edit Project</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Project Details */}
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
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    <option value="On Track">On Track</option>
                    <option value="At Risk">At Risk</option>
                    <option value="Completed">Completed</option>
                  </select>
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
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                    Budget ($)
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
              </div>

              {/* Right Column - Team Members */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Members
                </label>
                <div className="border border-gray-300 rounded-md overflow-hidden">
                  <div className="max-h-[500px] overflow-y-auto">
                    {teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${
                          selectedTeamMembers.includes(member.id) ? 'bg-indigo-50' : ''
                        } border-b border-gray-200 last:border-b-0`}
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
                </div>
                {selectedTeamMembers.length > 0 && (
                  <p className="mt-2 text-sm text-gray-500">
                    {selectedTeamMembers.length} team member{selectedTeamMembers.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 border border-red-300 text-red-700 rounded-md text-sm font-medium hover:bg-red-50"
            >
              Delete Project
            </button>
            <div className="flex space-x-3">
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
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}