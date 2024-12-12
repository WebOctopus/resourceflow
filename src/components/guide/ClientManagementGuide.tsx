import {
  Briefcase,
  UserPlus,
  FileText,
  DollarSign,
  Clock,
  BarChart3,
  Settings,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Users
} from 'lucide-react';

const guides = [
  {
    title: 'Client Setup',
    icon: Briefcase,
    steps: [
      {
        icon: UserPlus,
        title: 'Add New Client',
        description: 'Create client profile with contact details'
      },
      {
        icon: DollarSign,
        title: 'Set Billing',
        description: 'Configure contract value or hourly rate'
      },
      {
        icon: Settings,
        title: 'Customize Settings',
        description: 'Set client-specific preferences'
      }
    ]
  },
  {
    title: 'Project Management',
    icon: FileText,
    steps: [
      {
        icon: Calendar,
        title: 'Create Projects',
        description: 'Set up new projects with timelines'
      },
      {
        icon: Users,
        title: 'Assign Team',
        description: 'Allocate team members to projects'
      },
      {
        icon: AlertTriangle,
        title: 'Monitor Status',
        description: 'Track project health and progress'
      }
    ]
  },
  {
    title: 'Client Reporting',
    icon: BarChart3,
    steps: [
      {
        icon: Clock,
        title: 'Time Tracking',
        description: 'Monitor billable hours and activity'
      },
      {
        icon: MessageSquare,
        title: 'Communication',
        description: 'Manage client requests and feedback'
      },
      {
        icon: CheckCircle,
        title: 'Review Progress',
        description: 'Generate and share progress reports'
      }
    ]
  }
];

export default function ClientManagementGuide() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Client Management Guide</h2>
        <p className="mt-4 text-lg text-gray-600">
          Learn how to effectively manage clients and their projects
        </p>
      </div>

      <div className="space-y-16">
        {guides.map((guide, index) => (
          <div key={index} className="relative">
            <div className="flex items-center mb-8">
              <span className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg">
                <guide.icon className="w-6 h-6 text-indigo-600" />
              </span>
              <h3 className="ml-4 text-xl font-semibold text-gray-900">{guide.title}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {guide.steps.map((step, stepIndex) => (
                <div 
                  key={stepIndex}
                  className="relative flex flex-col items-center p-6 bg-gray-50 rounded-lg"
                >
                  <span className="absolute -top-3 -left-3 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg font-semibold">
                    {stepIndex + 1}
                  </span>
                  <step.icon className="w-8 h-8 text-indigo-600 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-center text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>

            {index < guides.length - 1 && (
              <div className="absolute left-6 bottom-0 w-0.5 h-8 bg-gray-200" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-indigo-50 rounded-lg">
        <h4 className="text-lg font-medium text-indigo-900 mb-4">Best Practices</h4>
        <ul className="space-y-3">
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5 mr-2" />
            <p className="text-indigo-900">Regularly review project progress and update clients</p>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5 mr-2" />
            <p className="text-indigo-900">Keep client information and billing details up to date</p>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5 mr-2" />
            <p className="text-indigo-900">Document all client communications and decisions</p>
          </li>
        </ul>
      </div>
    </div>
  );
}