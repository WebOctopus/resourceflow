import { CheckCircle } from 'lucide-react';

interface FeedbackSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackSuccessModal({ isOpen, onClose }: FeedbackSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">Feedback Submitted!</h3>
        <p className="mt-2 text-sm text-gray-500">
          Thank you for your feedback. Our team will review it and get back to you if needed.
        </p>
        <div className="mt-6">
          <button
            onClick={onClose}
            className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}