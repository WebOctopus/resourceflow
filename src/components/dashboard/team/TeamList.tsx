import { useState } from 'react';
import { Search, UserCircle, Users } from 'lucide-react';
import { TeamMember } from '../../../lib/types';
import AddTeamMemberModal from './AddTeamMemberModal';
import InviteUserModal from '../../admin/users/InviteUserModal';
import { useStore } from '../../../lib/store';

interface TeamListProps {
  onSelectMember: (member: TeamMember) => void;
  selectedMember: TeamMember | null;
}

export default function TeamList({ onSelectMember, selectedMember }: TeamListProps) {
  const teamMembers = useStore((state) => state.teamMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center mb-6">
            <Users className="h-6 w-6 text-indigo-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setShowInviteModal(true)}
              className="relative inline-flex w-full items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors group"
            >
              <span className="font-medium">Invite Member</span>
              <span className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-indigo-500 px-2 py-1 rounded">
                Via Email
              </span>
            </button>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="relative inline-flex w-full items-center justify-center px-4 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors group"
            >
              <span className="font-medium">Add Manually</span>
              <span className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-indigo-100 px-2 py-1 rounded">
                Direct Add
              </span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Team Members List */}
        <ul className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
          {filteredMembers.length === 0 ? (
            <li className="p-6 text-center">
              <div className="flex flex-col items-center text-gray-500">
                <Users className="h-8 w-8 mb-2" />
                <p className="text-sm">No team members found.</p>
                <p className="text-xs mt-1">Add your first team member to get started.</p>
              </div>
            </li>
          ) : (
            filteredMembers.map((member) => (
              <li
                key={member.id}
                className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedMember?.id === member.id ? 'bg-indigo-50' : ''
                }`}
                onClick={() => onSelectMember(member)}
              >
                <div className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <UserCircle className="h-10 w-10 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {member.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{member.role}</p>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        member.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.status}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      <AddTeamMemberModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
      <InviteUserModal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} />
    </>
  );
}