import { useState } from 'react';
import { X } from 'lucide-react';
import { Project } from '../../../lib/types';
import { useStore } from '../../../lib/store';

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export default function AddTeamMemberModal({ isOpen, onClose, project }: AddTeamMemberModalProps) {
  const updateProject = useStore((state) => state.updateProject);
  const updateClient = useStore((state) => state.updateClient);
  const clients = useStore((state) => state.clients);
  const teamMembers = useStore((state) => state.teamMembers);

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  if (!isOpen) return null;

  const availableMembers = teamMembers.filter(
    member => !project.teamMembers?.includes(member.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedProject: Project = {
      ...project,
      teamMembers: [...(project.teamMembers || []), ...selectedMembers],
    };

    // Update project in store
    updateProject(updatedProject);

    // Update client's projects array
    const client = clients.find(c => c.id === project.clientId);
    if (client) {
      updateClient({
        ...client,
        projects: client.projects.map(p => 
          p.id === project.id ? updatedProject : p
        ),
      });
    }

    setSelectedMembers([]);
    onClose();
  };

  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Add Team Members</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div className="border border-gray-300 rounded-md divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {availableMembers.length === 0 ? (
                <p className="p-4 text-center text-gray-500">
                  All team members are already assigned to this project.
                </p>
              ) : (
                availableMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedMembers.includes(member.id) ? 'bg-indigo-50' : ''
                    }`}
                    onClick={() => toggleMember(member.id)}
                  >
                    <div className="flex items-center flex-1">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
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
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => toggleMember(member.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedMembers.length === 0}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Selected Members
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}