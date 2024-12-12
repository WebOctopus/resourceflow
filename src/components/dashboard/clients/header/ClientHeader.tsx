import { Edit2 } from 'lucide-react';
import { Client } from '../../../../lib/types';

interface ClientHeaderProps {
  client: Client;
  onEdit: () => void;
  onDelete: () => void;
  onAddProject: () => void;
}

export default function ClientHeader({ client, onEdit, onDelete, onAddProject }: ClientHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-medium text-gray-900">{client.name}</h2>
          <div className="mt-1 text-sm text-gray-500 space-y-1">
            <p>{client.email}</p>
            {client.phone && <p>{client.phone}</p>}
            <p className="inline-flex items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {client.status}
              </span>
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onEdit}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
          >
            <Edit2 className="h-4 w-4 mr-1" />
            Edit Client
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center px-3 py-1.5 border border-red-300 text-red-700 rounded-md text-sm font-medium hover:bg-red-50"
          >
            Delete Client
          </button>
          <button
            onClick={onAddProject}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add Project
          </button>
        </div>
      </div>
    </div>
  );
}