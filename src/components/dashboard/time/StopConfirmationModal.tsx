import { AlertTriangle } from 'lucide-react';

interface StopConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectName: string;
}

export default function StopConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  projectName,
}: StopConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-center text-red-600 mb-4">
          <AlertTriangle className="h-12 w-12" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
          Complete Timer
        </h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          Are you sure you want to complete the timer for "{projectName}"? 
          This will save the time entry and stop tracking time for this project.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Complete Timer
          </button>
        </div>
      </div>
    </div>
  );
}