import { Clock, Play } from 'lucide-react';
import { ProjectMetrics } from '../../../../lib/utils/projectMetrics';
import { formatDuration } from '../../../../lib/utils';

interface ProjectTimeCardProps {
  metrics: ProjectMetrics;
}

export default function ProjectTimeCard({ metrics }: ProjectTimeCardProps) {
  const hasActiveTimers = metrics.activeTimers.length > 0;

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center mb-3">
        <Clock className="h-5 w-5 text-gray-400 mr-2" />
        <h3 className="text-sm font-medium text-gray-900">Time Tracking</h3>
      </div>
      
      <div className="flex items-center mb-2">
        <p className="text-2xl font-semibold text-indigo-600">
          {formatDuration(metrics.totalSeconds)}
        </p>
        {hasActiveTimers && (
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
            <Play className="w-3 h-3 mr-1" />
            Active
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-500">Billable Hours</p>
          <p className="font-medium text-gray-900">
            {Math.round(metrics.billableHours * 10) / 10}h
          </p>
        </div>
        <div>
          <p className="text-gray-500">Non-Billable</p>
          <p className="font-medium text-gray-900">
            {Math.round(metrics.nonBillableHours * 10) / 10}h
          </p>
        </div>
        {hasActiveTimers && (
          <div className="col-span-2">
            <p className="text-gray-500">Active Time</p>
            <p className="font-medium text-gray-900">
              {formatDuration(metrics.activeSeconds)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}