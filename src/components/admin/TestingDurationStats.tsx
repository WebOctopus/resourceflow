import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useStore } from '../../lib/store';
import { formatDuration } from '../../lib/utils';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TestingDurationStatsProps {
  timeRange: string;
}

export default function TestingDurationStats({ timeRange }: TestingDurationStatsProps) {
  const { teamMembers, timeEntries } = useStore();

  // Calculate testing duration for each user
  const userDurations = teamMembers.map(user => {
    const userEntries = timeEntries.filter(entry => entry.userId === user.id);
    const totalDuration = userEntries.reduce((sum, entry) => sum + entry.duration, 0);
    return {
      name: user.name,
      duration: totalDuration,
    };
  });

  const data = {
    labels: userDurations.map(user => user.name),
    datasets: [
      {
        label: 'Testing Duration',
        data: userDurations.map(user => user.duration / 3600), // Convert to hours
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Testing Duration by User',
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours',
        },
      },
      x: {
        type: 'category' as const,
        title: {
          display: true,
          text: 'Users',
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Testing Duration</h2>
      </div>
      <div className="p-6">
        <div className="h-[400px]">
          <Bar data={data} options={options} />
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userDurations.map(user => (
            <div key={user.name} className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500 mt-1">
                Total Time: {formatDuration(user.duration)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}