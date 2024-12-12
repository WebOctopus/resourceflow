import { Clock, Tag } from 'lucide-react';
import { formatDate, formatDuration } from '../../../lib/utils';
import { useStore } from '../../../lib/store';

interface ProjectTimeEntriesProps {
  projectId: string;
}

export default function ProjectTimeEntries({ projectId }: ProjectTimeEntriesProps) {
  const timeEntries = useStore((state) => 
    state.timeEntries.filter(entry => entry.projectId === projectId)
  );
  const teamMembers = useStore((state) => state.teamMembers);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Time Entries</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {timeEntries.length === 0 ? (
          <div className="px-6 py-4 text-center text-gray-500">
            No time entries recorded for this project yet.
          </div>
        ) : (
          timeEntries.map((entry) => {
            const member = teamMembers.find(m => m.id === entry.userId);

            return (
              <div key={entry.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="flex items-center">
                        <h4 className="text-sm font-medium text-gray-900">
                          {member?.name || 'Unknown User'}
                        </h4>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <Tag className="w-3 h-3 mr-1" />
                          {entry.task}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {entry.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatDuration(entry.duration)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(entry.date)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}