import { useState, useEffect } from 'react';
import { X, Upload, AlertTriangle } from 'lucide-react';
import { useStore } from '../../../lib/store';
import { TeamMember } from '../../../lib/types';

interface EditTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember;
}

export default function EditTeamMemberModal({ isOpen, onClose, member }: EditTeamMemberModalProps) {
  const updateTeamMember = useStore((state) => state.updateTeamMember);
  const deleteTeamMember = useStore((state) => state.deleteTeamMember);
  const teamMembers = useStore((state) => state.teamMembers);
  const timeEntries = useStore((state) => state.timeEntries);
  const updateTimeEntry = useStore((state) => state.updateTimeEntry);
  
  const [formData, setFormData] = useState({
    name: member.name,
    email: member.email,
    role: member.role,
    phone: member.phone || '',
    avatar: member.avatar || '',
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reassignTo, setReassignTo] = useState('');

  // Update form data when member prop changes
  useEffect(() => {
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role,
      phone: member.phone || '',
      avatar: member.avatar || '',
    });
    setShowDeleteConfirm(false);
    setReassignTo('');
  }, [member]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedMember: TeamMember = {
      ...member,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      phone: formData.phone,
      avatar: formData.avatar,
    };

    updateTeamMember(updatedMember);
    onClose();
  };

  const handleDelete = () => {
    // Reassign time entries if a team member is selected
    if (reassignTo) {
      const memberTimeEntries = timeEntries.filter(entry => entry.userId === member.id);
      memberTimeEntries.forEach(entry => {
        updateTimeEntry({
          ...entry,
          userId: reassignTo
        });
      });
    }

    // Delete the team member
    deleteTeamMember(member.id);
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

  // Filter out the current member from the reassignment options
  const availableMembers = teamMembers.filter(m => m.id !== member.id);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Edit Team Member</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        {showDeleteConfirm ? (
          <div className="p-6">
            <div className="flex items-center justify-center text-red-600 mb-4">
              <AlertTriangle className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
              Delete Team Member
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to delete {member.name}? This action cannot be undone.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reassign Time Entries To (Optional)
              </label>
              <select
                value={reassignTo}
                onChange={(e) => setReassignTo(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Don't reassign time entries</option>
                {availableMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              {!reassignTo && (
                <p className="mt-2 text-sm text-gray-500">
                  Note: If you don't reassign time entries, the project time will be preserved but unassigned.
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Delete Member
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt={formData.name}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-2xl font-medium text-gray-600">
                        {formData.name.charAt(0)}
                      </span>
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

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-md text-sm font-medium hover:bg-red-50"
              >
                Delete Member
              </button>
              <div className="flex space-x-3">
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
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}