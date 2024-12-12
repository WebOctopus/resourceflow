import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../lib/store';
import { useTeamMemberStore } from '../../lib/store/teamMemberStore';
import TimeTracker from '../../components/dashboard/time/TimeTracker';
import ProjectList from '../../components/dashboard/projects/ProjectList';

export default function TeamMemberDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { teamMembers } = useTeamMemberStore();

  useEffect(() => {
    if (!user || !teamMembers.find(m => m.email === user.email)) {
      navigate('/login');
    }
  }, [user, teamMembers, navigate]);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Team Member Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your time and manage your assigned projects
        </p>
      </div>

      <TimeTracker />
      <ProjectList />
    </div>
  );
}