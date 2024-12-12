import { useState } from 'react';
import { MessageSquare, Bell, FileText, Send } from 'lucide-react';

export default function CommunicationPage() {
  const [message, setMessage] = useState('');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Communication</h1>
        <p className="mt-1 text-sm text-gray-500">
          Stay in touch with your project team
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Messages</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* Sample messages */}
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">Project Manager</h4>
                      <span className="text-sm text-gray-500">2 hours ago</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      Latest project updates have been posted. Please review and provide feedback.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="message" className="sr-only">Message</label>
                <div className="flex items-center space-x-3">
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Type your message..."
                  />
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Project Update</p>
                    <p className="text-sm text-gray-500">New milestone completed</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Document Shared</p>
                    <p className="text-sm text-gray-500">Project timeline updated</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Schedule Meeting
                </button>
                <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Share Files
                </button>
                <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Request Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}