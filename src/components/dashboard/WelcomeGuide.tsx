import { useAuthStore } from '../../lib/store';
import { Clock, Users, Briefcase, Settings, Shield, UserPlus } from 'lucide-react';

export default function WelcomeGuide() {
  const { user } = useAuthStore();

  const getRoleSpecificContent = () => {
    switch (user?.role) {
      case 'admin':
        return {
          title: 'System Administrator Dashboard',
          description: 'Monitor and manage the entire system',
          features: [
            {
              icon: Shield,
              title: 'System Overview',
              description: 'Monitor user activity, system performance, and usage analytics'
            },
            {
              icon: Users,
              title: 'User Management',
              description: 'Track user sign-ups and manage access permissions'
            },
            {
              icon: Clock,
              title: 'Testing Analytics',
              description: 'View detailed testing duration and user engagement metrics'
            }
          ]
        };

      case 'freelancer':
        return {
          title: 'Freelancer Dashboard',
          description: 'Manage your clients and projects efficiently',
          features: [
            {
              icon: UserPlus,
              title: 'Team Management',
              description: 'Add up to 2 team members to help with your projects'
            },
            {
              icon: Briefcase,
              title: 'Client Management',
              description: 'Track client projects and manage deliverables'
            },
            {
              icon: Clock,
              title: 'Time Tracking',
              description: 'Monitor billable hours and project progress'
            }
          ]
        };

      case 'manager':
        return {
          title: 'Manager Dashboard',
          description: 'Oversee team performance and project progress',
          features: [
            {
              icon: Users,
              title: 'Team Oversight',
              description: 'Monitor team productivity and resource allocation'
            },
            {
              icon: Briefcase,
              title: 'Client Relations',
              description: 'Manage client accounts and project deliverables'
            },
            {
              icon: Settings,
              title: 'System Configuration',
              description: 'Customize settings and workflow preferences'
            }
          ]
        };

      case 'project_manager':
        return {
          title: 'Project Manager Dashboard',
          description: 'Track project progress and team performance',
          features: [
            {
              icon: Briefcase,
              title: 'Project Tracking',
              description: 'Monitor project timelines and deliverables'
            },
            {
              icon: Users,
              title: 'Team Coordination',
              description: 'Manage team assignments and workload'
            },
            {
              icon: Clock,
              title: 'Time Management',
              description: 'Track project hours and resource utilization'
            }
          ]
        };

      case 'team_member':
        return {
          title: 'Team Member Dashboard',
          description: 'Track your tasks and time efficiently',
          features: [
            {
              icon: Clock,
              title: 'Time Tracking',
              description: 'Log your work hours and monitor project time'
            },
            {
              icon: Briefcase,
              title: 'Project View',
              description: 'Access your assigned projects and tasks'
            },
            {
              icon: Users,
              title: 'Team Collaboration',
              description: 'Stay connected with your team members'
            }
          ]
        };

      default:
        return {
          title: 'Welcome to ResourceFlow',
          description: 'Get started with your resource management',
          features: []
        };
    }
  };

  const content = getRoleSpecificContent();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
            {content.description}
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {content.features.map((feature, index) => (
              <div key={index} className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}