import { Clock, Tag, RotateCcw, Trash2, AlertTriangle } from 'lucide-react';
import { formatDate, formatDuration } from '../../../lib/utils';
import { useStore } from '../../../lib/store';
import { useTimerStore } from '../../../lib/store/timerStore';
import { useState } from 'react';
import { TimeEntry } from '../../../lib/types';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  entryInfo: {
    task: string;
    duration: number;
  };
}

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, entryInfo }: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-center text-red-600 mb-4">
          <AlertTriangle className="h-12 w-12" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
          Delete Time Entry
        </h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          Are you sure you want to delete this time entry for "{entryInfo.task}" ({formatDuration(entryInfo.duration)})? 
          This action cannot be undone.
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
            Delete Entry
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TimeEntries() {
  const {
    timeEntries,
    teamMembers,
    clients,
    addTimeEntry,
    deleteTimeEntry,
  } = useStore();
  
  const { activeTimers, addTimer, startTimer } = useTimerStore();

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    entryId: string;
    task: string;
    duration: number;
  }>({
    isOpen: false,
    entryId: '',
    task: '',
    duration: 0,
  });

  const getProjectAndClientInfo = (projectId: string) => {
    for (const client of clients) {
      const project = client.projects?.find(p => p.id === projectId);
      if (project) {
        return {
          projectName: project.name,
          clientName: client.name,
          client,
          project,
        };
      }
    }
    return {
      projectName: 'Unknown Project',
      clientName: 'Unknown Client',
      client: null,
      project: null,
    };
  };

  const handleRestoreTimer = (entry: TimeEntry) => {
    const { client, project } = getProjectAndClientInfo(entry.projectId || '');
    if (!client || !project) return;

    // Check if this entry is already restored and active
    const isAlreadyRestored = activeTimers?.some(timer => 
      timer.restoredFromEntryId === entry.id
    ) || false;

    if (isAlreadyRestored) return;

    const timerId = addTimer({
      clientId: client.id,
      projectId: project.id,
      userId: entry.userId,
      task: entry.task,
      description: entry.description,
      restoredFromEntryId: entry.id,
      activityType: 'project',
      elapsed: entry.duration,
    });

    startTimer(timerId);
  };

  const handleDeleteEntry = (entry: TimeEntry) => {
    setDeleteConfirmation({
      isOpen: true,
      entryId: entry.id,
      task: entry.task,
      duration: entry.duration,
    });
  };

  const sortedEntries = [...timeEntries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      <div className="bg-white rounded-lg shadow mt-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Time Entries</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {sortedEntries.length === 0 ? (
            <div className="px-6 py-4 text-center text-gray-500">
              No time entries recorded yet.
            </div>
          ) : (
            sortedEntries.map((entry) => {
              const member = teamMembers.find(m => m.id === entry.userId);
              const { projectName, clientName } = getProjectAndClientInfo(entry.projectId || '');
              const isAlreadyRestored = activeTimers?.some(timer => 
                timer.restoredFromEntryId === entry.id
              ) || false;

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
                          <span className="text-sm text-gray-600">
                            {clientName} - {projectName}
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <Tag className="w-3 h-3 mr-1" />
                            {entry.task}
                          </span>
                          <p className="text-sm text-gray-500 ml-2">
                            {entry.description}
                          </p>
                        </div>
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
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleRestoreTimer(entry)}
                          className={`p-2 rounded-md ${
                            isAlreadyRestored 
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'
                          }`}
                          disabled={isAlreadyRestored}
                          title={isAlreadyRestored ? 'Timer already restored' : 'Restore timer'}
                        >
                          <RotateCcw className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry)}
                          className="p-2 rounded-md text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Delete time entry"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          deleteTimeEntry(deleteConfirmation.entryId);
          setDeleteConfirmation(prev => ({ ...prev, isOpen: false }));
        }}
        entryInfo={{
          task: deleteConfirmation.task,
          duration: deleteConfirmation.duration,
        }}
      />
    </>
  );
}