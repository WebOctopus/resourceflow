import { Clock, DollarSign, Calendar, BarChart3, ExternalLink, PoundSterling, Edit2 } from 'lucide-react';
import { Client } from '../../../lib/types';
import { useState } from 'react';
import AddProjectModal from './AddProjectModal';
import DeleteClientModal from './DeleteClientModal';
import EditClientModal from './EditClientModal';
import ClientMetrics from './metrics/ClientMetrics';
import ClientProjects from './projects/ClientProjects';
import ClientHeader from './header/ClientHeader';
import { useStore } from '../../../lib/store';
import { useTimerStore } from '../../../lib/store/timerStore';
import { useNavigate } from 'react-router-dom';

interface ClientDetailsProps {
  client: Client;
}

export default function ClientDetails({ client }: ClientDetailsProps) {
  const [showAddProject, setShowAddProject] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();
  const { timeEntries } = useStore();
  const { activeTimers } = useTimerStore();

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <ClientHeader 
          client={client}
          onEdit={() => setShowEditModal(true)}
          onDelete={() => setShowDeleteModal(true)}
          onAddProject={() => setShowAddProject(true)}
        />

        <div className="p-6 space-y-6">
          <ClientMetrics 
            client={client}
            timeEntries={timeEntries}
            activeTimers={activeTimers}
          />
          
          <ClientProjects 
            client={client}
            timeEntries={timeEntries}
            activeTimers={activeTimers}
            onProjectClick={(projectId) => navigate(`/dashboard/projects/${projectId}`)}
          />
        </div>
      </div>

      <AddProjectModal 
        isOpen={showAddProject} 
        onClose={() => setShowAddProject(false)}
        clientId={client.id}
      />

      <DeleteClientModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        client={client}
      />

      <EditClientModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        client={client}
      />
    </>
  );
}