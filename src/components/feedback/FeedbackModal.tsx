import { useState } from 'react';
import { X, Send, Upload, AlertTriangle, Star } from 'lucide-react';
import { useFeedbackStore } from '../../lib/store/feedbackStore';
import { useAuthStore } from '../../lib/store';
import FeedbackSuccessModal from './FeedbackSuccessModal';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { user } = useAuthStore();
  const { addFeedback } = useFeedbackStore();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    category: 'improvement',
    title: '',
    description: '',
    priority: 'medium',
    screenshot: null as string | null,
    rating: 5,
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !user) return null;

  const handleScreenshotChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, screenshot: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      addFeedback({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        ...formData,
      });

      setShowSuccess(true);
      setFormData({
        category: 'improvement',
        title: '',
        description: '',
        priority: 'medium',
        screenshot: null,
        rating: 5,
      });
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Submit Feedback</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-md p-3 text-sm flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="improvement">Improvement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Brief summary of your feedback"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Please provide detailed information..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="low">Low - Nice to have</option>
                  <option value="medium">Medium - Important but not urgent</option>
                  <option value="high">High - Critical issue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Rating</label>
                <div className="mt-2 flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          rating <= formData.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Screenshot (Optional)</label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    onChange={handleScreenshotChange}
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <FeedbackSuccessModal isOpen={showSuccess} onClose={handleSuccessClose} />
    </>
  );
}