import { useState } from 'react';
import { useStore } from '../lib/store';
import { Clock, AlertTriangle, CheckCircle, Plus, ArrowLeft } from 'lucide-react';
import { formatDuration, formatCurrency } from '../lib/utils';
import ProjectRequestModal from '../components/client-portal/ProjectRequestModal';
import ProjectOverview from '../components/client-portal/ProjectOverview';
import ProjectTimeline from '../components/dashboard/projects/ProjectTimeline';
import ProjectTimeEntries from '../components/dashboard/projects/ProjectTimeEntries';
import ProjectRequestList from '../components/client-portal/ProjectRequestList';
import ClientPortalGuide from '../components/guide/ClientPortalGuide';

export default function ClientPortalPage() {
  const { clients, projectRequests } = useStore();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  // For demo purposes, using the first client
  const client = clients[0];
  const selectedProject = client?.projects.find(p => p.id === selectedProjectId);

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Welcome, {client?.name}</h1>
          <p className="mt-1 text-sm text-gray-500">
            View your projects and request new ones
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            {showGuide ? 'View Projects' : 'Show Guide'}
          </button>
          <button
            onClick={() => setShowRequestModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Request New Project
          </button>
        </div>
      </div>

      {showGuide ? (
        <ClientPortalGuide />
      ) : selectedProject ? (
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
        <div className="space-y-6">
          {/* Rest of the existing code for projects list and requests */}
          {/* ... */}
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