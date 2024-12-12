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
import { useStore } from '../../../lib/store';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TimeAllocationChartProps {
  timeRange: string;
}

export default function TimeAllocationChart({ timeRange }: TimeAllocationChartProps) {
  const { timeEntries } = useStore();

  // Calculate hours by task type
  const taskHours = timeEntries.reduce((acc, entry) => {
    const hours = entry.duration / 3600; // Convert seconds to hours
    acc[entry.task] = (acc[entry.task] || 0) + hours;
    return acc;
  }, {} as Record<string, number>);

  const data = {
    labels: Object.keys(taskHours),
    datasets: [
      {
        label: 'Hours Spent',
        data: Object.values(taskHours),
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
        text: 'Time Allocation by Activity',
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
          text: 'Activities',
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Time Allocation</h3>
      <div className="h-[300px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}