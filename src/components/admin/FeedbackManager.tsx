import { useState } from 'react';
import { MessageSquare, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useFeedbackStore } from '../../lib/store/feedbackStore';
import type { Feedback } from '../../lib/types/feedback';

export default function FeedbackManager() {
  const { feedback, updateFeedbackStatus, deleteFeedback } = useFeedbackStore();
  const [filter, setFilter] = useState<Feedback['status']>('new');

  const filteredFeedback = feedback.filter(item => 
    filter === 'all' ? true : item.status === filter
  );

  const getStatusColor = (status: Feedback['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'under-review': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-indigo-100 text-indigo-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: Feedback['priority']) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'medium': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'low': return <AlertTriangle className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">User Feedback</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as Feedback['status'])}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="under-review">Under Review</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredFeedback.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No feedback found with the selected status.
          </div>
        ) : (
          filteredFeedback.map((item) => (
            <div key={item.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  {getPriorityIcon(item.priority)}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{item.userName}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                      <span className="text-gray-300">•</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <select
                    value={item.status}
                    onChange={(e) => updateFeedbackStatus(item.id, e.target.value as Feedback['status'])}
                    className="text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="new">New</option>
                    <option value="under-review">Under Review</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="declined">Declined</option>
                  </select>
                  <button
                    onClick={() => deleteFeedback(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}