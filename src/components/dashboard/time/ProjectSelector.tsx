import { Client, TeamMember } from '../../../lib/types';

interface ProjectSelectorProps {
  clients: Client[];
  teamMembers: TeamMember[];
  selectedClient: string;
  selectedProject: string;
  selectedMember: string;
  onClientChange: (clientId: string) => void;
  onProjectChange: (projectId: string) => void;
  onMemberChange: (memberId: string) => void;
}

export default function ProjectSelector({
  clients,
  teamMembers,
  selectedClient,
  selectedProject,
  selectedMember,
  onClientChange,
  onProjectChange,
  onMemberChange,
}: ProjectSelectorProps) {
  const selectedClientProjects = clients.find(c => c.id === selectedClient)?.projects || [];
  const projectTeamMembers = selectedProject
    ? teamMembers.filter(member => 
        selectedClientProjects
          .find(p => p.id === selectedProject)
          ?.teamMembers?.includes(member.id)
      )
    : [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client
          </label>
          <select
            value={selectedClient}
            onChange={(e) => {
              onClientChange(e.target.value);
              onProjectChange('');
              onMemberChange('');
            }}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select Client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project
          </label>
          <select
            value={selectedProject}
            onChange={(e) => {
              onProjectChange(e.target.value);
              onMemberChange('');
            }}
            disabled={!selectedClient}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50"
          >
            <option value="">Select Project</option>
            {selectedClientProjects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Team Member
          </label>
          <select
            value={selectedMember}
            onChange={(e) => onMemberChange(e.target.value)}
            disabled={!selectedProject}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50"
          >
            <option value="">Select Team Member</option>
            {projectTeamMembers.map((member) => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}