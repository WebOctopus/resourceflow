import { UserCircle, UserPlus, X } from 'lucide-react';
import { Project } from '../../../lib/types';
import { useState } from 'react';
import AddTeamMemberModal from './AddTeamMemberModal';
import { useStore } from '../../../lib/store';
import { formatDuration } from '../../../lib/utils';

interface ProjectTeamProps {
  project: Project;
}

export default function ProjectTeam({ project }: ProjectTeamProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const updateProject = useStore((state) => state.updateProject);
  const updateClient = useStore((state) => state.updateClient);
  const clients = useStore((state) => state.clients);
  const teamMembers = useStore((state) => state.teamMembers);
  const timeEntries = useStore((state) => state.timeEntries);
  
  // Get assigned team members from the store using project's teamMembers array
  const assignedMembers = teamMembers.filter(
    member => project.teamMembers?.includes(member.id)
  );

  // Calculate total time for each team member on this project
  const getMemberProjectTime = (memberId: string) => {
    const memberEntries = timeEntries.filter(
      entry => entry.projectId === project.id && entry.userId === memberId
    );
    const totalSeconds = memberEntries.reduce((total, entry) => total + entry.duration, 0);
    return formatDuration(totalSeconds);
  };

  const handleRemoveMember = (memberId: string) => {
    const updatedProject: Project = {
      ...project,
      teamMembers: project.teamMembers?.filter(id => id !== memberId) || [],
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
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Add Member
          </button>
        </div>
        <div className="p-6">
          {assignedMembers.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No team members assigned yet. Click "Add Member" to assign team members.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {assignedMembers.map((member) => (
                <li key={member.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <UserCircle className="h-10 w-10 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {member.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{member.role}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {getMemberProjectTime(member.id)}
                      </span>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove team member"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <AddTeamMemberModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        project={project}
      />
    </>
  );
}