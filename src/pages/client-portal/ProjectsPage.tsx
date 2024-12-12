import { useState } from 'react';
import { useStore } from '../../lib/store';
import ProjectOverview from '../../components/client-portal/ProjectOverview';
import ProjectTimeline from '../../components/dashboard/projects/ProjectTimeline';
import ProjectTimeEntries from '../../components/dashboard/projects/ProjectTimeEntries';
import ProjectRequestModal from '../../components/client-portal/ProjectRequestModal';
import { Plus, ArrowLeft } from 'lucide-react';

export default function ProjectsPage() {
  const { clients } = useStore();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // For demo purposes, using the first client
  const client = clients[0];
  const selectedProject = client?.projects.find(p => p.id === selectedProjectId);

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your projects
          </p>
        </div>
        <button
          onClick={() => setShowRequestModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Request New Project
        </button>
      </div>

      {selectedProject ? (
        <div className="space-y-6">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setSelectedProjectId(null)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </button>
          </div>
          <ProjectOverview project={selectedProject} client={client} />
          <ProjectTimeline project={selectedProject} />
          <ProjectTimeEntries projectId={selectedProject.id} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {client?.projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedProjectId(project.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{project.description}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  project.status === 'On Track' ? 'bg-green-100 text-green-800' :
                  project.status === 'At Risk' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {project.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showRequestModal && (
        <ProjectRequestModal
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          client={client}
        />
      )}
    </div>
  );
}