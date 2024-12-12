import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Upload, Send } from 'lucide-react';
import { userInviteSchema } from '../../../lib/services/userManagement';
import { useUserStore } from '../../../lib/store/userStore';
import { InviteService } from '../../../lib/services/inviteService';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InviteUserModal({ isOpen, onClose }: InviteUserModalProps) {
  const [inviteLink, setInviteLink] = useState('');
  const [error, setError] = useState('');
  const { addUser } = useUserStore();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(userInviteSchema),
  });

  if (!isOpen) return null;

  const onSubmit = async (data: any) => {
    try {
      setError('');
      const token = InviteService.createInviteToken(data.email, 'manager-1', data.role);
      const inviteLink = InviteService.getInviteUrl(token);
      setInviteLink(inviteLink);
      
      // Add user to store with pending status
      addUser({
        name: data.name,
        email: data.email,
        role: data.role,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`,
      });

      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invitation');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Invite Team Member</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-md p-3 text-sm">
              {error}
            </div>
          )}

          {inviteLink && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-800 rounded-md p-3">
              <p className="text-sm font-medium mb-2">Invitation Link Created:</p>
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="w-full text-sm bg-white p-2 rounded border border-green-300"
                onClick={(e) => e.currentTarget.select()}
              />
              <p className="mt-2 text-xs text-green-600">
                This link will expire in 48 hours
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                {...register('name')}
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message as string}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Work Email
              </label>
              <input
                {...register('email')}
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message as string}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                {...register('role')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="team_member">Team Member</option>
                <option value="project_manager">Project Manager</option>
                <option value="manager">Manager</option>
                <option value="freelancer">Freelancer</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message as string}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}