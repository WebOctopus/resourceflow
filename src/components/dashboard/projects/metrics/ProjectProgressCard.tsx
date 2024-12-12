import { BarChart2 } from 'lucide-react';
import { ProjectMetrics } from '../../../../lib/utils/projectMetrics';
import { formatDuration } from '../../../../lib/utils';

interface ProjectProgressCardProps {
  metrics: ProjectMetrics;
}

export default function ProjectProgressCard({ metrics }: ProjectProgressCardProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center mb-3">
        <BarChart2 className="h-5 w-5 text-gray-400 mr-2" />
        <h3 className="text-sm font-medium text-gray-900">Progress</h3>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${metrics.progress}%` }}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-500">Completed</p>
          <p className="font-medium text-gray-900">{metrics.progress}%</p>
        </div>
        <div>
          <p className="text-gray-500">Remaining</p>
          <p className="font-medium text-gray-900">
            {formatDuration(metrics.remainingHours * 3600)}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Burn Rate</p>
          <p className="font-medium text-gray-900">
            {Math.round(metrics.burnRate * 10) / 10} hrs/week
          </p>
        </div>
        <div>
          <p className="text-gray-500">Est. Completion</p>
          <p className="font-medium text-gray-900">
            {metrics.estimatedCompletion
              ? metrics.estimatedCompletion.toLocaleDateString()
              : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}