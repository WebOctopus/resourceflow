import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock } from 'lucide-react';
import { userInviteSchema } from '../../lib/services/userManagement';
import { InviteDetails } from '../../lib/types/invite';

interface InviteFormProps {
  inviteDetails: InviteDetails;
  activeTab: 'register' | 'login';
  onSubmit: (data: any) => void;
  onTabChange: (tab: 'register' | 'login') => void;
}

export default function InviteForm({ 
  inviteDetails, 
  activeTab, 
  onSubmit, 
  onTabChange 
}: InviteFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(userInviteSchema),
  });

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div className="sm:flex sm:justify-center space-x-4 mb-8">
          <button
            onClick={() => onTabChange('register')}
            className={`flex-1 py-2 px-4 text-center text-sm font-medium rounded-md ${
              activeTab === 'register'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            New User
          </button>
          <button
            onClick={() => onTabChange('login')}
            className={`flex-1 py-2 px-4 text-center text-sm font-medium rounded-md ${
              activeTab === 'login'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Existing User
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {activeTab === 'register' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                {...register('name')}
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message as string}</p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1 relative">
              <input
                {...register('email')}
                type="email"
                defaultValue={inviteDetails.email}
                readOnly
                className="block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <input
                {...register('password')}
                type="password"
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message as string}</p>
            )}
          </div>

          {activeTab === 'register' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('confirmPassword')}
                  type="password"
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message as string}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {activeTab === 'register' ? 'Create Account' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}