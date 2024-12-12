import { Shield } from 'lucide-react';
import { InviteDetails } from '../../lib/types/invite';

interface InviteHeaderProps {
  inviteDetails: InviteDetails;
}

export default function InviteHeader({ inviteDetails }: InviteHeaderProps) {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <Shield className="mx-auto h-12 w-12 text-indigo-600" />
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Welcome to {inviteDetails.companyName}
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        You've been invited by {inviteDetails.managerName} to join as a team member
      </p>
      <div className="mt-4 text-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
          {inviteDetails.role}
        </span>
      </div>
      <p className="mt-4 text-center text-sm text-gray-500">
        This invitation expires in {getRemainingTime(inviteDetails.expiresAt)}
      </p>
    </div>
  );
}

function getRemainingTime(expiresAt: string): string {
  const now = new Date();
  const expiration = new Date(expiresAt);
  const diffHours = Math.round((expiration.getTime() - now.getTime()) / (1000 * 60 * 60));
  
  if (diffHours < 1) return 'less than an hour';
  if (diffHours === 1) return '1 hour';
  if (diffHours < 24) return `${diffHours} hours`;
  
  const days = Math.floor(diffHours / 24);
  return `${days} day${days > 1 ? 's' : ''}`;
}