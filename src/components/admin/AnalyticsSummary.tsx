import { Users, Clock, TrendingUp } from 'lucide-react';
import { useStore } from '../../lib/store';
import { formatDuration } from '../../lib/utils';

interface AnalyticsSummaryProps {
  timeRange: string;
}

export default function AnalyticsSummary({ timeRange }: AnalyticsSummaryProps) {
  const { teamMembers, timeEntries } = useStore();

  // Calculate active users (users with time entries)
  const activeUsers = new Set(timeEntries.map(entry => entry.userId)).size;

  // Calculate average testing time
  const totalDuration = timeEntries.reduce((sum, entry) => sum + entry.duration, 0);
  const averageDuration = totalDuration / (activeUsers || 1);

  // Calculate utilization rate
  const utilizationRate = Math.round((activeUsers / teamMembers.length) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <Users className="h-6 w-6 text-indigo-600" />
          <h3 className="ml-2 text-sm font-medium text-gray-900">Active Users</h3>
        </div>
        <p className="mt-2 text-2xl font-semibold text-gray-900">{activeUsers}</p>
        <p className="mt-1 text-sm text-gray-500">
          Out of {teamMembers.length} total users
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <Clock className="h-6 w-6 text-indigo-600" />
          <h3 className="ml-2 text-sm font-medium text-gray-900">Average Testing Time</h3>
        </div>
        <p className="mt-2 text-2xl font-semibold text-gray-900">
          {formatDuration(averageDuration)}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Per active user
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <TrendingUp className="h-6 w-6 text-indigo-600" />
          <h3 className="ml-2 text-sm font-medium text-gray-900">Utilization Rate</h3>
        </div>
        <p className="mt-2 text-2xl font-semibold text-gray-900">{utilizationRate}%</p>
        <p className="mt-1 text-sm text-gray-500">
          Of registered users are active
        </p>
      </div>
    </div>
  );
}