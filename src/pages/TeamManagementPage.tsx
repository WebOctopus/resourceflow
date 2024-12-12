import { useState } from 'react';
import TeamList from '../components/dashboard/team/TeamList';
import TeamMemberDetails from '../components/dashboard/team/TeamMemberDetails';
import TeamAnalytics from '../components/dashboard/team/TeamAnalytics';
import TeamGuide from '../components/guide/TeamGuide';
import { TeamMember } from '../lib/types';

export default function TeamManagementPage() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [activeView, setActiveView] = useState<'details' | 'analytics' | 'guide'>('details');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Team Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage team members and monitor their activities
        </p>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveView('details')}
              className={`${
                activeView === 'details'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Team Details
            </button>
            <button
              onClick={() => setActiveView('analytics')}
              className={`${
                activeView === 'analytics'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Team Analytics
            </button>
            <button
              onClick={() => setActiveView('guide')}
              className={`${
                activeView === 'guide'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Guide
            </button>
          </nav>
        </div>
      </div>

      {activeView === 'guide' ? (
        <TeamGuide />
      ) : activeView === 'details' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TeamList onSelectMember={setSelectedMember} selectedMember={selectedMember} />
          </div>
          <div className="lg:col-span-2">
            {selectedMember ? (
              <TeamMemberDetails member={selectedMember} />
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                Select a team member to view details
              </div>
            )}
          </div>
        </div>
      ) : (
        <TeamAnalytics />
      )}
    </div>
  );
}