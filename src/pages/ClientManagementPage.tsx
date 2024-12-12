import { useState } from 'react';
import ClientList from '../components/dashboard/clients/ClientList';
import ClientDetails from '../components/dashboard/clients/ClientDetails';
import ProjectRequestManager from '../components/dashboard/clients/ProjectRequestManager';
import ClientManagementGuide from '../components/guide/ClientManagementGuide';
import { Client } from '../lib/types';

export default function ClientManagementPage() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'requests'>('details');
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Client Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your clients and their projects
          </p>
        </div>
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          {showGuide ? 'View Clients' : 'Show Guide'}
        </button>
      </div>

      {showGuide ? (
        <ClientManagementGuide />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ClientList onSelectClient={setSelectedClient} selectedClient={selectedClient} />
          </div>
          <div className="lg:col-span-2">
            {selectedClient ? (
              <div>
                <div className="mb-6 border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`${
                        activeTab === 'details'
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                      Client Details
                    </button>
                    <button
                      onClick={() => setActiveTab('requests')}
                      className={`${
                        activeTab === 'requests'
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                      Project Requests
                    </button>
                  </nav>
                </div>

                {activeTab === 'details' ? (
                  <ClientDetails client={selectedClient} />
                ) : (
                  <ProjectRequestManager />
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                Select a client to view details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}