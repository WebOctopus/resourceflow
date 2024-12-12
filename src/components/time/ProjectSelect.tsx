import { Client, Project } from '../../lib/types';

interface ProjectSelectProps {
  clients: Client[];
  selectedClientId: string;
  selectedProjectId: string;
  onClientChange: (clientId: string) => void;
  onProjectChange: (projectId: string) => void;
  disabled?: boolean;
}

export default function ProjectSelect({
  clients,
  selectedClientId,
  selectedProjectId,
  onClientChange,
  onProjectChange,
  disabled = false,
}: ProjectSelectProps) {
  const selectedClient = clients.find(c => c.id === selectedClientId);
  const projects = selectedClient?.projects || [];

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Client
        </label>
        <select
          value={selectedClientId}
          onChange={(e) => {
            onClientChange(e.target.value);
            onProjectChange('');
          }}
          disabled={disabled}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Select Client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project
        </label>
        <select
          value={selectedProjectId}
          onChange={(e) => onProjectChange(e.target.value)}
          disabled={!selectedClientId || disabled}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Select Project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}