import { useAdminStore } from '../../lib/store/adminStore';
import { Clock, User, Shield } from 'lucide-react';

export default function AuditLog() {
  const { auditLogs } = useAdminStore();

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Audit Log</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {auditLogs.map((log) => (
          <div key={log.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{log.action}</p>
                  <p className="text-sm text-gray-500">{log.details}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">IP: {log.ipAddress}</p>
              </div>
            </div>
          </div>
        ))}

        {auditLogs.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No audit logs available.
          </div>
        )}
      </div>
    </div>
  );
}