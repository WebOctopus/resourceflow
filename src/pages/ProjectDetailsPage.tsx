import { useParams } from 'react-router-dom';
import { useStore } from '../lib/store';
import ProjectOverview from '../components/dashboard/projects/ProjectOverview';
import ProjectTimeline from '../components/dashboard/projects/ProjectTimeline';
import ProjectTeam from '../components/dashboard/projects/ProjectTeam';
import ProjectTimeEntries from '../components/dashboard/projects/ProjectTimeEntries';
import EditProjectModal from '../components/dashboard/projects/EditProjectModal';
import { useState } from 'react';
import { Edit2 } from 'lucide-react';

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const clients = useStore((state) => state.clients);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const project = clients
    .flatMap(client => client.projects)
    .find(p => p.id === projectId);
    
  const client = clients.find(c => 
    c.projects.some(p => p.id === projectId)
  );

  if (!project || !client) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Project not found</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{project.name}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Client: {client.name}
          </p>
        </div>
        <button
          onClick={() => setShowEditModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Edit Project
        </button>
      </div>

      <ProjectOverview project={project} client={client} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectTimeline project={project} />
        <ProjectTeam project={project} />
      </div>
      
      <ProjectTimeEntries projectId={project.id} />

      <EditProjectModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        project={project}
        clientId={client.id}
      />
    </div>
  );
}