import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useAdminStore } from '../../lib/store/adminStore';
import { MessageSquare, Star, AlertTriangle, Lightbulb } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function FeedbackMetrics() {
  const { feedbackMetrics } = useAdminStore();

  const data = {
    labels: ['Bug Reports', 'Feature Requests', 'Improvements'],
    datasets: [
      {
        data: [
          feedbackMetrics.bugReports,
          feedbackMetrics.featureRequests,
          feedbackMetrics.improvements,
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(59, 130, 246, 1)',
        ],
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
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Total Feedback</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {feedbackMetrics.totalFeedback}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Bug Reports</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {feedbackMetrics.bugReports}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Lightbulb className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Feature Requests</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {feedbackMetrics.featureRequests}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Average Rating</h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {feedbackMetrics.averageRating.toFixed(1)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Feedback Distribution</h3>
        <div className="h-80">
          <Doughnut data={data} options={options} />
        </div>
      </div>
    </div>
  );
}