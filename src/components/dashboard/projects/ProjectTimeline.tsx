import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Project } from '../../../lib/types';
import { useStore } from '../../../lib/store';
import { getProjectTimeline } from '../../../lib/utils/projectUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ProjectTimelineProps {
  project: Project;
}

export default function ProjectTimeline({ project }: ProjectTimelineProps) {
  const { timeEntries } = useStore();
  const timeline = getProjectTimeline(project, timeEntries);

  const data = {
    labels: timeline.weeklyData.map(week => `Week ${week.weekNumber}`),
    datasets: [
      {
        label: 'Hours Logged',
        data: timeline.weeklyData.map(week => week.hoursLogged),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Projected Hours',
        data: timeline.weeklyData.map((_, index) => 
          (project.estimatedHours || 100) / timeline.totalWeeks * (index + 1)
        ),
        borderColor: 'rgb(209, 213, 219)',
        backgroundColor: 'rgba(209, 213, 219, 0.5)',
        borderDash: [5, 5],
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Project Timeline',
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${Math.round(value * 10) / 10} hours`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Project Timeline',
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Progress Timeline</h3>
      <div className="h-[300px]">
        <Line data={data} options={options} />
      </div>
      <div className="mt-4 text-sm text-gray-500">
        <p>Project Duration: {timeline.totalWeeks} weeks</p>
        <p>Start Date: {new Date(project.startDate).toLocaleDateString()}</p>
        {project.endDate && <p>End Date: {new Date(project.endDate).toLocaleDateString()}</p>}
      </div>
    </div>
  );
}