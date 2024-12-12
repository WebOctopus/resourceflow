import { useAuthStore } from '../lib/store';
import WelcomeGuide from '../components/dashboard/WelcomeGuide';
import AppGuide from '../components/guide/AppGuide';
import TeamMemberGuide from '../components/guide/TeamMemberGuide';
import UserFeedbackList from '../components/feedback/UserFeedbackList';

export default function DashboardOverview() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to ResourceFlow
        </p>
      </div>

      {/* Welcome Section */}
      <div className="mb-8">
        <WelcomeGuide />
      </div>

      {/* User Feedback Section */}
      <div className="mb-8">
        <UserFeedbackList />
      </div>

      {/* Guide Section */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Getting Started Guide</h2>
          <p className="mt-1 text-sm text-gray-500">
            Learn how to use ResourceFlow effectively
          </p>
        </div>
        {user?.role === 'team_member' ? (
          <TeamMemberGuide />
        ) : (
          <AppGuide />
        )}
      </div>
    </div>
  );
}