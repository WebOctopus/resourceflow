import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from 'chart.js';
import { useStore } from '../../../lib/store';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

interface ClientDistributionChartProps {
  timeRange: string;
}

export default function ClientDistributionChart({ timeRange }: ClientDistributionChartProps) {
  const { clients } = useStore();

  // Generate colors based on number of clients
  const generateColors = (count: number) => {
    const colors = [
      'rgba(99, 102, 241, 0.8)',  // Indigo
      'rgba(59, 130, 246, 0.8)',  // Blue
      'rgba(147, 51, 234, 0.8)',  // Purple
      'rgba(236, 72, 153, 0.8)',  // Pink
      'rgba(248, 113, 113, 0.8)', // Red
    ];

    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
  };

  const backgroundColor = generateColors(clients.length);
  const borderColor = backgroundColor.map(color => color.replace('0.8', '1'));

  const data = {
    labels: clients.map(client => client.name),
    datasets: [
      {
        data: clients.map(client => client.contractValue),
        backgroundColor,
        borderColor,
        borderWidth: 1,
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
        text: 'Revenue Distribution by Client',
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Client Distribution</h3>
      <div className="h-[300px] flex items-center justify-center">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}