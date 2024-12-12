import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { useStore } from '../../../lib/store';
import { TeamMember } from '../../../lib/types';
import { generateId } from '../../../lib/utils';
import { useAuthStore } from '../../../lib/store';
import { ROLE_PERMISSIONS } from '../../../lib/constants/roles';

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTeamMemberModal({ isOpen, onClose }: AddTeamMemberModalProps) {
  const addTeamMember = useStore((state) => state.addTeamMember);
  const teamMembers = useStore((state) => state.teamMembers);
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    avatar: '',
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check freelancer team member limit
    if (user?.role === 'freelancer') {
      const currentTeamSize = teamMembers.length;
      const maxTeamMembers = ROLE_PERMISSIONS.freelancer.restrictions.maxTeamMembers;
      
      if (currentTeamSize >= maxTeamMembers) {
        setError(`Freelancers can only add up to ${maxTeamMembers} team members`);
        return;
      }
    }

    const newMember: TeamMember = {
      id: generateId(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      phone: formData.phone,
      avatar: formData.avatar,
      status: 'active',
      hoursThisMonth: 0,
      utilization: 0,
      projectIds: [],
      createdAt: new Date().toISOString(),
    };

    addTeamMember(newMember);
    setFormData({
      name: '',
      email: '',
      role: '',
      phone: '',
      avatar: '',
    });
    setError('');
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-medium text-gray-900">Add Team Member</h2>
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
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Avatar Upload */}
              <div className="flex justify-center">
                <div className="relative">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt="Team member avatar"
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg cursor-pointer hover:bg-gray-50"
                  >
                    <Upload className="h-4 w-4 text-gray-600" />
                  </label>
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
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

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Content Writer">Content Writer</option>
                  <option value="QA Engineer">QA Engineer</option>
                </select>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
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
                Add Member
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}