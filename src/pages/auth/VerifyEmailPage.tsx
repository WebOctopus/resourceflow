import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../lib/store/authStore';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyEmail, user } = useAuthStore();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setIsVerifying(true);
      verifyEmail(token)
        .then(() => {
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Verification failed');
        })
        .finally(() => {
          setIsVerifying(false);
        });
    }
  }, [searchParams, verifyEmail, navigate]);

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          {user.emailVerified ? (
            <CheckCircle className="h-12 w-12 text-green-500" />
          ) : (
            <Mail className="h-12 w-12 text-indigo-500" />
          )}
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {user.emailVerified ? 'Email Verified!' : 'Verify your email'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {user.emailVerified
            ? 'Your email has been verified successfully.'
            : `We sent a verification link to ${user.email}`}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error ? (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Verification failed
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : isVerifying ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-sm text-gray-500">Verifying your email...</p>
            </div>
          ) : user.emailVerified ? (
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Redirecting you to the dashboard...
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Please check your email and click the verification link.
              </p>
              <button
                type="button"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                onClick={() => {
                  // In a real app, resend verification email
                  console.log('Resending verification email...');
                }}
              >
                Resend verification email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}