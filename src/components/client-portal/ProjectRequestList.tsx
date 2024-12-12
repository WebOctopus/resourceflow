import { Clock, AlertTriangle, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { useStore } from '../../lib/store';
import { formatCurrency } from '../../lib/utils';
import { ProjectRequestStatus } from '../../lib/types';

const statusConfig: Record<ProjectRequestStatus, {
  label: string;
  icon: typeof CheckCircle;
  className: string;
}> = {
  pending: {
    label: 'Pending Review',
    icon: Clock,
    className: 'bg-yellow-100 text-yellow-800',
  },
  roadmap: {
    label: 'Added to Roadmap',
    icon: Calendar,
    className: 'bg-blue-100 text-blue-800',
  },
  needs_call: {
    label: 'Needs Discussion',
    icon: AlertTriangle,
    className: 'bg-orange-100 text-orange-800',
  },
  declined: {
    label: 'Declined',
    icon: XCircle,
    className: 'bg-red-100 text-red-800',
  },
  approved: {
    label: 'Approved',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-800',
  },
};

export default function ProjectRequestList() {
  const { projectRequests, clients } = useStore();

  return (
    <div className="space-y-4">
      {projectRequests.map((request) => {
        const client = clients.find(c => c.id === request.clientId);
        const status = statusConfig[request.status];

        return (
          <div
            key={request.id}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{request.name}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Submitted {new Date(request.submittedAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                <status.icon className="w-4 h-4 mr-1" />
                {status.label}
              </span>
            </div>

            <p className="mt-4 text-sm text-gray-600">{request.description}</p>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Estimated Budget</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {formatCurrency(request.estimatedBudget, client?.currency)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Target Date</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {new Date(request.targetDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Priority</p>
                <p className="mt-1 text-sm font-medium text-gray-900 capitalize">
                  {request.priority}
                </p>
              </div>
            </div>

            {request.statusNotes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">{request.statusNotes}</p>
              </div>
            )}
          </div>
        );
      })}

      {projectRequests.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No project requests</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new project request
          </p>
        </div>
      )}
    </div>
  );
}