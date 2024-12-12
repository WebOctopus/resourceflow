import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Users, TrendingUp, UserPlus } from 'lucide-react';
import { useUserStore } from '../../lib/store/userStore';
import { useEffect } from 'react';
import { useAdminStore } from '../../lib/store/adminStore';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function UserAnalytics() {
  const { users, getUserStats } = useUserStore();
  const { updateUserMetrics } = useAdminStore();

  // Update metrics whenever users change
  useEffect(() => {
    const stats = getUserStats();
    updateUserMetrics(stats);
  }, [users, getUserStats, updateUserMetrics]);

  const userData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Users',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  const stats = getUserStats();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {stats.totalUsers}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {stats.activeUsers} active users
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UserPlus className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">New Users</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {stats.newUsersThisMonth}
          </p>
          <p className="mt-1 text-sm text-gray-500">this month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Growth</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {stats.signupTrend.toFixed(1)}%
          </p>
          <p className="mt-1 text-sm text-gray-500">vs last month</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">User Growth</h3>
        <div className="h-80">
          <Bar data={userData} options={options} />
        </div>
      </div>
    </div>
  );
}