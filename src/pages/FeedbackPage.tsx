import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { useAuthStore } from '../lib/store';
import { useFeedbackStore } from '../lib/store/feedbackStore';

export default function FeedbackPage() {
  const { user } = useAuthStore();
  const { addFeedback } = useFeedbackStore();
  const [formData, setFormData] = useState({
    category: 'improvement',
    title: '',
    description: '',
    priority: 'medium',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    addFeedback({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      ...formData,
    });

    setFormData({
      category: 'improvement',
      title: '',
      description: '',
      priority: 'medium',
    });
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">App Feedback</h1>
        <p className="mt-1 text-sm text-gray-500">
          Help us improve ResourceFlow by sharing your thoughts and suggestions
        </p>
      </div>

      {isSubmitted ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-medium text-green-800 mb-2">Thank You for Your Feedback!</h2>
          <p className="text-green-600 mb-4">Your feedback has been submitted and will be reviewed by our team.</p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            Submit Another Feedback
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow">
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="improvement">Improvement Suggestion</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Brief summary of your feedback"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Please provide detailed information about your feedback..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="low">Low - Nice to have</option>
                <option value="medium">Medium - Important but not urgent</option>
                <option value="high">High - Critical issue</option>
              </select>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Feedback
            </button>
          </div>
        </form>
      )}
    </div>
  );
}