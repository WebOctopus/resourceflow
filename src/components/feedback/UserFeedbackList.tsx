import { useState } from 'react';
import { MessageSquare, AlertTriangle, Star } from 'lucide-react';
import { useFeedbackStore } from '../../lib/store/feedbackStore';
import { useAuthStore } from '../../lib/store';

export default function UserFeedbackList() {
  const { user } = useAuthStore();
  const { feedback } = useFeedbackStore();
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter feedback for current user
  const userFeedback = feedback.filter(item => item.userId === user?.id);

  const filteredFeedback = userFeedback.filter(item => 
    categoryFilter === 'all' || item.category === categoryFilter
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bug':
        return 'bg-red-100 text-red-800';
      case 'feature':
        return 'bg-green-100 text-green-800';
      case 'improvement':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">My Feedback</h2>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-md border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Categories</option>
            <option value="bug">Bugs</option>
            <option value="feature">Feature Requests</option>
            <option value="improvement">Improvements</option>
          </select>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredFeedback.map((item) => (
          <div key={item.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-5 w-5 text-gray-400" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    {item.priority === 'high' && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  {[...Array(item.rating || 0)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">{item.description}</p>
            {item.statusNotes && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Admin Response:</span> {item.statusNotes}
                </p>
              </div>
            )}
          </div>
        ))}

        {filteredFeedback.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No feedback found in this category.
          </div>
        )}
      </div>
    </div>
  );
}