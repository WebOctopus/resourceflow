import { useState } from 'react';
import { MessageSquare, AlertTriangle, Star, Search } from 'lucide-react';
import { useFeedbackStore } from '../../lib/store/feedbackStore';

export default function FeedbackList() {
  const { feedback } = useFeedbackStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <AlertTriangle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-medium text-gray-900">User Feedback</h2>
          <div className="mt-2 sm:mt-0 flex space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Categories</option>
              <option value="bug">Bugs</option>
              <option value="feature">Feature Requests</option>
              <option value="improvement">Improvements</option>
            </select>
          </div>
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
                    <span className="flex items-center text-sm text-gray-500">
                      {getPriorityIcon(item.priority)}
                      <span className="ml-1 capitalize">{item.priority} Priority</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">{item.userName}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">{item.description}</p>
          </div>
        ))}

        {filteredFeedback.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No feedback found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}