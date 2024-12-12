import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../lib/types';
import { Users, Briefcase, UserCog, User } from 'lucide-react';

const roles: { id: UserRole; title: string; description: string; icon: any }[] = [
  {
    id: 'freelancer',
    title: 'Freelancer',
    description: 'Perfect for independent professionals',
    icon: User,
  },
  {
    id: 'team_member',
    title: 'Team Member',
    description: 'For contributors working on projects',
    icon: Users,
  },
  {
    id: 'project_manager',
    title: 'Project Manager',
    description: 'Manage projects and team members',
    icon: Briefcase,
  },
  {
    id: 'manager',
    title: 'Manager',
    description: 'Full access to all features',
    icon: UserCog,
  },
];

export default function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    localStorage.setItem('selected_role', role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Select Your Role
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Choose how you want to use ResourceFlow
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className="w-full flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
              >
                <role.icon className="h-6 w-6 text-indigo-600" />
                <div className="ml-4 text-left">
                  <p className="text-sm font-medium text-gray-900">{role.title}</p>
                  <p className="text-sm text-gray-500">{role.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}