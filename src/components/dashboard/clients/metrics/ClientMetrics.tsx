import { Clock, DollarSign, Calendar, PoundSterling } from 'lucide-react';
import { Client, TimeEntry, Timer } from '../../../../lib/types';
import { formatDuration, formatCurrency } from '../../../../lib/utils';

interface ClientMetricsProps {
  client: Client;
  timeEntries: TimeEntry[];
  activeTimers: Timer[];
}

export default function ClientMetrics({ client, timeEntries, activeTimers }: ClientMetricsProps) {
  // Calculate total time
  const clientEntries = timeEntries.filter(entry =>
    client.projects.some(project => project.id === entry.projectId)
  );
  const completedSeconds = clientEntries.reduce((sum, entry) => sum + entry.duration, 0);

  // Calculate active time
  const activeSeconds = activeTimers
    .filter(timer => 
      client.projects.some(project => project.id === timer.projectId) &&
      timer.activityType === 'project'
    )
    .reduce((sum, timer) => {
      if (timer.isRunning && timer.startTime) {
        const currentElapsed = Math.floor((Date.now() - timer.startTime) / 1000);
        return sum + currentElapsed;
      }
      return sum + timer.elapsed;
    }, 0);

  const totalSeconds = completedSeconds + activeSeconds;
  const totalHours = totalSeconds / 3600;

  // Calculate earnings
  const earnings = client.billingModel === 'hourly' && client.hourlyRate
    ? totalHours * client.hourlyRate
    : client.contractValue || 0;

  const CurrencyIcon = client.currency === 'GBP' ? PoundSterling : DollarSign;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center">
          <CurrencyIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">
            {client.billingModel === 'contract' ? 'Contract Value' : 'Current Earnings'}
          </h3>
        </div>
        <p className="mt-2 text-xl font-semibold text-indigo-600">
          {formatCurrency(earnings, client.currency)}
        </p>
        {client.billingModel === 'hourly' && (
          <p className="mt-1 text-sm text-gray-500">
            Rate: {formatCurrency(client.hourlyRate || 0, client.currency)}/hour
          </p>
        )}
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">Total Time</h3>
        </div>
        <p className="mt-2 text-xl font-semibold text-indigo-600">
          {formatDuration(totalSeconds)}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          {Math.round(totalHours * 10) / 10} hours
        </p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">Projects</h3>
        </div>
        <p className="mt-2 text-xl font-semibold text-indigo-600">
          {client.projects.length}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          {client.projects.filter(p => p.status === 'Completed').length} completed
        </p>
      </div>
    </div>
  );
}