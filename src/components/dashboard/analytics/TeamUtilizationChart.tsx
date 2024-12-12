import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useStore } from '../../../lib/store';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TeamUtilizationChartProps {
  timeRange: string;
}

export default function TeamUtilizationChart({ timeRange }: TeamUtilizationChartProps) {
  const { teamMembers } = useStore();

  // Sort team members by utilization for better visualization
  const sortedMembers = [...teamMembers].sort((a, b) => b.utilization - a.utilization);

  const data = {
    labels: sortedMembers.map(member => member.name),
    datasets: [
      {
        label: 'Team Utilization',
        data: sortedMembers.map(member => member.utilization),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.4,
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
        text: 'Team Utilization Distribution',
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value: number) => `${value}%`,
        },
        title: {
          display: true,
          text: 'Utilization Rate',
        },
      },
      x: {
        type: 'category' as const,
        title: {
          display: true,
          text: 'Team Members',
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Team Utilization</h3>
      <div className="h-[300px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}