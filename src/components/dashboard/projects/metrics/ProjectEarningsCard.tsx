import { DollarSign } from 'lucide-react';
import { ProjectMetrics } from '../../../../lib/utils/projectMetrics';
import { Client } from '../../../../lib/types';
import { formatCurrency } from '../../../../lib/utils';

interface ProjectEarningsCardProps {
  metrics: ProjectMetrics;
  client: Client;
}

export default function ProjectEarningsCard({ metrics, client }: ProjectEarningsCardProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center mb-3">
        <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
        <h3 className="text-sm font-medium text-gray-900">
          {client.billingModel === 'hourly' ? 'Current Earnings' : 'Budget'}
        </h3>
      </div>
      
      <p className="text-2xl font-semibold text-indigo-600 mb-2">
        {formatCurrency(metrics.earnings)}
      </p>
      
      {client.billingModel === 'hourly' && (
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-500">Rate</p>
            <p className="font-medium text-gray-900">${client.hourlyRate}/hr</p>
          </div>
          <div>
            <p className="text-gray-500">Billable Amount</p>
            <p className="font-medium text-gray-900">
              {formatCurrency(metrics.billableHours * (client.hourlyRate || 0))}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}