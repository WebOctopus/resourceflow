import { useState } from 'react';
import { Timer as TimerIcon, AlertTriangle, Plus } from 'lucide-react';
import { useTimerStore } from '../../../lib/store/timerStore';
import { useStore } from '../../../lib/store';
import { Timer } from '../../../lib/types';
import ProjectSelector from './ProjectSelector';
import TimerCard from './TimerCard';
import StatusBar from './StatusBar';
import StopConfirmationModal from './StopConfirmationModal';

export default function TimeTracker() {
  const { activeTimers, addTimer, globalStatus } = useTimerStore();
  const { clients, teamMembers, addTimeEntry } = useStore();
  
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [showStopConfirmation, setShowStopConfirmation] = useState<{
    isOpen: boolean;
    timer: Timer | null;
  }>({ isOpen: false, timer: null });

  const projectTimers = activeTimers.filter(t => t.activityType === 'project');

  const handleAddTimer = () => {
    if (!selectedClient || !selectedProject || !selectedMember) {
      alert('Please select a client, project, and team member');
      return;
    }

    addTimer({
      clientId: selectedClient,
      projectId: selectedProject,
      userId: selectedMember,
      activityType: 'project',
    });

    // Reset selection
    setSelectedClient('');
    setSelectedProject('');
    setSelectedMember('');
  };

  const handleCompleteTimer = (timer: Timer) => {
    addTimeEntry({
      id: Math.random().toString(36).substr(2, 9),
      projectId: timer.projectId,
      userId: timer.userId,
      task: timer.task || 'Work',
      description: timer.description || '',
      duration: timer.elapsed,
      date: new Date().toISOString(),
      billable: true,
      activityType: timer.activityType,
    });

    setShowStopConfirmation({ isOpen: false, timer: null });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
          <div className="text-lg font-medium text-gray-900">Time Tracker</div>
          <button
            onClick={handleAddTimer}
            disabled={!selectedClient || !selectedProject || !selectedMember || globalStatus !== null}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Timer
          </button>
        </div>

        <div className="mb-4">
          <StatusBar />
        </div>

        <ProjectSelector
          clients={clients}
          teamMembers={teamMembers}
          selectedClient={selectedClient}
          selectedProject={selectedProject}
          selectedMember={selectedMember}
          onClientChange={setSelectedClient}
          onProjectChange={setSelectedProject}
          onMemberChange={setSelectedMember}
        />

        {projectTimers.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectTimers.map((timer) => (
              <TimerCard
                key={timer.id}
                timer={timer}
                onComplete={(timer) => setShowStopConfirmation({ 
                  isOpen: true, 
                  timer 
                })}
              />
            ))}
          </div>
        )}
      </div>

      {showStopConfirmation.isOpen && showStopConfirmation.timer && (
        <StopConfirmationModal
          isOpen={showStopConfirmation.isOpen}
          onClose={() => setShowStopConfirmation({ isOpen: false, timer: null })}
          onConfirm={() => handleCompleteTimer(showStopConfirmation.timer!)}
          projectName={
            clients
              .find(c => c.id === showStopConfirmation.timer?.clientId)
              ?.projects.find(p => p.id === showStopConfirmation.timer?.projectId)
              ?.name || ''
          }
        />
      )}
    </>
  );
}