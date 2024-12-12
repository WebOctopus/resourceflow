import { AlertTriangle } from 'lucide-react';
import { Client } from '../../../lib/types';
import { useStore } from '../../../lib/store';
import { useNavigate } from 'react-router-dom';

interface DeleteClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
}

export default function DeleteClientModal({ isOpen, onClose, client }: DeleteClientModalProps) {
  const navigate = useNavigate();
  const deleteClient = useStore((state) => state.deleteClient);

  if (!isOpen) return null;

  const handleDelete = () => {
    deleteClient(client.id);
    onClose();
    navigate('/dashboard/clients');
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-center text-red-600 mb-4">
          <AlertTriangle className="h-12 w-12" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
          Delete Client
        </h3>
        <div className="text-sm text-gray-500 space-y-4">
          <p>
            Are you sure you want to delete <span className="font-medium">{client.name}</span>?
            This action cannot be undone.
          </p>
          <p>
            The following data will be affected:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">{client.projects.length} projects</span> will be removed
            </li>
            <li>
              Contract value of <span className="font-medium">${client.contractValue.toLocaleString()}</span> will be removed from reports
            </li>
            <li>
              <span className="font-medium">{client.totalHours} hours</span> of tracked time will be preserved in team member records
            </li>
          </ul>
          <p className="font-medium text-gray-700">
            Note: All time entries will be preserved in team member records for accurate time tracking history.
          </p>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Delete Client
          </button>
        </div>
      </div>
    </div>
  );
}