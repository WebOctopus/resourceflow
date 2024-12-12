import {
  Users,
  UserPlus,
  Clock,
  Calendar,
  BarChart3,
  Coffee,
  MessageSquare,
  FileText,
  CheckCircle,
  AlertTriangle,
  UserMinus,
  Settings
} from 'lucide-react';

const teamGuides = [
  {
    title: 'Team Management',
    icon: Users,
    steps: [
      {
        icon: UserPlus,
        title: 'Add Team Members',
        description: 'Invite new members and set their roles'
      },
      {
        icon: Settings,
        title: 'Manage Permissions',
        description: 'Configure access levels and project assignments'
      },
      {
        icon: UserMinus,
        title: 'Update Status',
        description: 'Manage active/inactive member status'
      }
    ]
  },
  {
    title: 'Time & Attendance',
    icon: Clock,
    steps: [
      {
        icon: Calendar,
        title: 'Track Availability',
        description: 'Monitor work schedules and time off'
      },
      {
        icon: Coffee,
        title: 'Manage Breaks',
        description: 'Record break times and absences'
      },
      {
        icon: AlertTriangle,
        title: 'Handle Conflicts',
        description: 'Resolve scheduling conflicts and overlaps'
      }
    ]
  },
  {
    title: 'Performance Tracking',
    icon: BarChart3,
    steps: [
      {
        icon: FileText,
        title: 'Track Metrics',
        description: 'Monitor productivity and project completion rates'
      },
      {
        icon: MessageSquare,
        title: 'Collect Feedback',
        description: 'Gather and review team performance feedback'
      },
      {
        icon: CheckCircle,
        title: 'Set Goals',
        description: 'Establish and track team objectives'
      }
    ]
  }
];

export default function TeamGuide() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Team Management Guide</h2>
        <p className="mt-4 text-lg text-gray-600">
          Learn how to effectively manage your team and track performance
        </p>
      </div>

      <div className="space-y-16">
        {teamGuides.map((guide, index) => (
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

            {index < teamGuides.length - 1 && (
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
            <p className="text-indigo-900">Regularly review team performance metrics and provide feedback</p>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5 mr-2" />
            <p className="text-indigo-900">Keep team member information and permissions up to date</p>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5 mr-2" />
            <p className="text-indigo-900">Monitor workload distribution to prevent burnout</p>
          </li>
        </ul>
      </div>
    </div>
  );
}