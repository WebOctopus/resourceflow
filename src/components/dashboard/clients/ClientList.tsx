import { Plus, Search, DollarSign, PoundSterling } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../../../lib/store';
import { useTimerStore } from '../../../lib/store/timerStore';
import { Client } from '../../../lib/types';
import AddClientModal from './AddClientModal';
import { formatCurrency, formatDuration } from '../../../lib/utils';

interface ClientListProps {
  onSelectClient: (client: Client) => void;
  selectedClient: Client | null;
}

export default function ClientList({ onSelectClient, selectedClient }: ClientListProps) {
  const { clients, timeEntries } = useStore();
  const { activeTimers } = useTimerStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate current earnings for pay-per-hour clients
  const getClientEarnings = (client: Client) => {
    if (client.billingModel === 'hourly' && client.hourlyRate) {
      // Get completed time entries
      const clientEntries = timeEntries.filter(entry =>
        client.projects.some(project => project.id === entry.projectId)
      );
      const completedHours = clientEntries.reduce((sum, entry) => sum + entry.duration / 3600, 0);

      // Get active timer time
      const activeTimerSeconds = activeTimers
        .filter(timer => 
          client.projects.some(project => project.id === timer.projectId) &&
          timer.activityType === 'project'
        )
        .reduce((sum, timer) => {
          if (timer.isRunning && timer.startTime) {
            const currentElapsed = Math.floor((Date.now() - timer.startTime) / 1000);
            return sum + currentElapsed;
          }
          return sum + timer.elapsed;
        }, 0);

      const activeHours = activeTimerSeconds / 3600;
      const totalHours = completedHours + activeHours;

      return totalHours * client.hourlyRate;
    }
    return null;
  };

  // Calculate total time for each client
  const getClientTotalTime = (client: Client) => {
    // Get completed time entries
    const clientEntries = timeEntries.filter(entry =>
      client.projects.some(project => project.id === entry.projectId)
    );
    const completedSeconds = clientEntries.reduce((sum, entry) => sum + entry.duration, 0);

    // Get active timer time
    const activeTimerSeconds = activeTimers
      .filter(timer => 
        client.projects.some(project => project.id === timer.projectId) &&
        timer.activityType === 'project'
      )
      .reduce((sum, timer) => {
        if (timer.isRunning && timer.startTime) {
          const currentElapsed = Math.floor((Date.now() - timer.startTime) / 1000);
          return sum + currentElapsed;
        }
        return sum + timer.elapsed;
      }, 0);

    return completedSeconds + activeTimerSeconds;
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Clients</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Client
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
          {filteredClients.length === 0 ? (
            <li className="p-4 text-center text-gray-500">
              No clients found. Add your first client to get started.
            </li>
          ) : (
            filteredClients.map((client) => {
              const earnings = getClientEarnings(client);
              const totalSeconds = getClientTotalTime(client);
              const CurrencyIcon = client.currency === 'GBP' ? PoundSterling : DollarSign;

              return (
                <li
                  key={client.id}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    selectedClient?.id === client.id ? 'bg-indigo-50' : ''
                  }`}
                  onClick={() => onSelectClient(client)}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{client.name}</h3>
                        <p className="text-sm text-gray-500">
                          {client.projects.length} Projects • {formatDuration(totalSeconds)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        {client.billingModel === 'contract' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <CurrencyIcon className="h-3 w-3 mr-1" />
                            Contract Value: {formatCurrency(client.contractValue || 0, client.currency)}
                          </span>
                        ) : (
                          <>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CurrencyIcon className="h-3 w-3 mr-1" />
                              Rate: {formatCurrency(client.hourlyRate || 0, client.currency)}/hr
                            </span>
                            <span className="text-xs text-gray-500 mt-1 inline-flex items-center">
                              <CurrencyIcon className="h-3 w-3 mr-1" />
                              Current Earnings: {formatCurrency(earnings || 0, client.currency)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>

      <AddClientModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </>
  );
}