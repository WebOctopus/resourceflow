import {
  Clock,
  Play,
  Pause,
  StopCircle,
  Calendar,
  CheckCircle,
  Coffee,
  Users,
  MessageSquare,
  FileText,
  BarChart3,
  AlertTriangle
} from 'lucide-react';

const guides = [
  {
    title: 'Time Tracking',
    icon: Clock,
    steps: [
      {
        icon: Play,
        title: 'Start Timer',
        description: 'Begin tracking time for your assigned tasks'
      },
      {
        icon: Coffee,
        title: 'Break Time',
        description: 'Pause timer during breaks and meetings'
      },
      {
        icon: StopCircle,
        title: 'Complete Task',
        description: 'Stop timer and submit time entry with details'
      }
    ]
  },
  {
    title: 'Project Management',
    icon: FileText,
    steps: [
      {
        icon: Calendar,
        title: 'View Assignments',
        description: 'Check your assigned projects and tasks'
      },
      {
        icon: CheckCircle,
        title: 'Update Progress',
        description: 'Mark tasks as complete and log progress'
      },
      {
        icon: AlertTriangle,
        title: 'Report Issues',
        description: 'Flag any blockers or concerns'
      }
    ]
  },
  {
    title: 'Team Collaboration',
    icon: Users,
    steps: [
      {
        icon: MessageSquare,
        title: 'Team Chat',
        description: 'Communicate with team members'
      },
      {
        icon: BarChart3,
        title: 'View Reports',
        description: 'Track your performance metrics'
      },
      {
        icon: Calendar,
        title: 'Schedule',
        description: 'Manage your work calendar'
      }
    ]
  }
];

export default function TeamMemberGuide() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Team Member Guide</h2>
        <p className="mt-4 text-lg text-gray-600">
          Learn how to effectively track time and manage your tasks
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
        <h4 className="text-lg font-medium text-indigo-900 mb-4">Pro Tips</h4>
        <ul className="space-y-3">
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5 mr-2" />
            <p className="text-indigo-900">Use keyboard shortcuts (Space: Start/Stop, Esc: Cancel) for faster time tracking</p>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5 mr-2" />
            <p className="text-indigo-900">Add detailed descriptions to time entries for better reporting</p>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5 mr-2" />
            <p className="text-indigo-900">Check your daily progress to ensure accurate time tracking</p>
          </li>
        </ul>
      </div>
    </div>
  );
}