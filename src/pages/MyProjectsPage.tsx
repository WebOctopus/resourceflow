import { useState } from 'react';
import { useStore } from '../lib/store';
import { Project } from '../lib/types';
import { Clock, CheckCircle, AlertTriangle, Play, Pause } from 'lucide-react';
import { formatDuration } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useTimerStore } from '../lib/store/timerStore';
import TeamMemberGuide from '../components/guide/TeamMemberGuide';

export default function MyProjectsPage() {
  const navigate = useNavigate();
  const { clients, teamMembers, timeEntries } = useStore();
  const { activeTimers, addTimer, startTimer, stopTimer } = useTimerStore();
  const [showGuide, setShowGuide] = useState(false);

  // Get current user (for demo, using first team member)
  const currentUser = teamMembers[0];

  // Get all projects assigned to the current user
  const myProjects = clients.flatMap(client => 
    client.projects
      .filter(project => project.teamMembers?.includes(currentUser.id))
      .map(project => ({
        ...project,
        client,
        timeEntries: timeEntries.filter(entry => 
          entry.projectId === project.id && 
          entry.userId === currentUser.id
        ),
        activeTimer: activeTimers.find(timer => 
          timer.projectId === project.id && 
          timer.userId === currentUser.id
        ),
      }))
  );

  const handleStartTimer = (project: Project) => {
    const timerId = addTimer({
      clientId: project.clientId,
      projectId: project.id,
      userId: currentUser.id,
      activityType: 'project',
    });
    startTimer(timerId);
  };

  const handleStopTimer = (timerId: string) => {
    stopTimer(timerId);
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Projects</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track your assigned projects
          </p>
        </div>
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          {showGuide ? 'View Projects' : 'Show Guide'}
        </button>
      </div>

      {showGuide ? (
        <TeamMemberGuide />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {/* Rest of the existing project list code */}
        </div>
      )}
    </div>
  );
}