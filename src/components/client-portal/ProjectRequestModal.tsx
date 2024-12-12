import { useState } from 'react';
import { X } from 'lucide-react';
import { Client, ProjectRequest } from '../../lib/types';
import { useStore } from '../../lib/store';
import { generateId } from '../../lib/utils';
import { formatCurrency } from '../../lib/utils';

interface ProjectRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
}

export default function ProjectRequestModal({ isOpen, onClose, client }: ProjectRequestModalProps) {
  const { addProjectRequest } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    estimatedBudget: '',
    targetDate: '',
    priority: 'medium' as const,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRequest: ProjectRequest = {
      id: generateId(),
      clientId: client.id,
      name: formData.name,
      description: formData.description,
      estimatedBudget: parseFloat(formData.estimatedBudget),
      targetDate: formData.targetDate,
      priority: formData.priority as 'low' | 'medium' | 'high',
      status: 'pending',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addProjectRequest(newRequest);
    setFormData({
      name: '',
      description: '',
      estimatedBudget: '',
      targetDate: '',
      priority: 'medium',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-medium text-gray-900">Request New Project</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              {/* Project Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Project Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Project Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Estimated Budget */}
              <div>
                <label htmlFor="estimatedBudget" className="block text-sm font-medium text-gray-700">
                  Estimated Budget ({client.currency})
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">
                      {client.currency === 'USD' ? '$' : '£'}
                    </span>
                  </div>
                  <input
                    type="number"
                    id="estimatedBudget"
                    value={formData.estimatedBudget}
                    onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                    className="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="0.00"
                    required
                    min="0"
                    step="0.01"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">{client.currency}</span>
                  </div>
                </div>
              </div>

              {/* Target Date */}
              <div>
                <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700">
                  Target Completion Date
                </label>
                <input
                  type="date"
                  id="targetDate"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Priority */}
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority Level
                </label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Select the urgency level for this project request
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Submit Request
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}