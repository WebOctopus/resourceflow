import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Shield, Lock } from 'lucide-react';
import { passwordSchema, userManagementService } from '../../lib/services/userManagement';
import { useAuthStore } from '../../lib/store';

export default function AcceptInvitePage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [invitation, setInvitation] = useState<any>(null);
  const { login } = useAuthStore();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(passwordSchema)
  });

  useState(() => {
    if (token) {
      userManagementService.verifyInvitation(token)
        .then(setInvitation)
        .catch(err => setError(err.message));
    }
  });

  const onSubmit = async (data: any) => {
    try {
      if (!token) return;
      
      const user = await userManagementService.completeRegistration(token, data.password);
      await login(user.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete registration');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <Shield className="mx-auto h-12 w-12 text-red-500" />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Invalid Invitation
              </h2>
              <p className="mt-2 text-sm text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Shield className="mx-auto h-12 w-12 text-indigo-600" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Complete Your Registration
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Welcome {invitation.name}! Please set your password to continue.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password')}
                  type="password"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message as string}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('confirmPassword')}
                  type="password"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message as string}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Complete Registration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}