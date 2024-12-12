import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../lib/store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userInviteSchema } from '../../lib/services/userManagement';
import { validateInviteToken } from '../../lib/utils/inviteUtils';
import { InviteDetails } from '../../lib/types/invite';

type TabType = 'register' | 'login';

export default function InviteLandingPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('register');
  const [inviteDetails, setInviteDetails] = useState<InviteDetails | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { login, register } = useAuthStore();

  const { register: registerForm, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(userInviteSchema),
  });

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('Invalid invitation link');
        setIsLoading(false);
        return;
      }

      try {
        const details = await validateInviteToken(token);
        setInviteDetails(details);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid invitation');
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const handleRegister = async (data: any) => {
    if (!inviteDetails) return;

    try {
      setError('');
      await register({
        ...data,
        inviteToken: token,
        managerId: inviteDetails.managerId,
        role: inviteDetails.role,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  const handleLogin = async (data: any) => {
    if (!inviteDetails) return;

    try {
      setError('');
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Shield className="mx-auto h-12 w-12 text-indigo-600" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to {inviteDetails?.companyName}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          You've been invited by {inviteDetails?.managerName} to join as a team member
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Tab Navigation */}
          <div className="sm:flex sm:justify-center space-x-4 mb-8">
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 px-4 text-center text-sm font-medium rounded-md ${
                activeTab === 'register'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              New User
            </button>
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 px-4 text-center text-sm font-medium rounded-md ${
                activeTab === 'login'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Existing User
            </button>
          </div>

          <form onSubmit={handleSubmit(activeTab === 'register' ? handleRegister : handleLogin)}>
            <div className="space-y-6">
              {activeTab === 'register' && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      {...registerForm('name')}
                      type="text"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 relative">
                  <input
                    {...registerForm('email')}
                    type="email"
                    defaultValue={inviteDetails?.email}
                    readOnly
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                    {...registerForm('password')}
                    type="password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {activeTab === 'register' && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      {...registerForm('confirmPassword')}
                      type="password"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {activeTab === 'register' ? 'Create Account' : 'Sign In'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}