import { 
  Clock, 
  Users, 
  Briefcase, 
  Settings,
  Play,
  Pause,
  StopCircle,
  Plus,
  UserPlus,
  BarChart3,
  Calendar,
  Coffee,
  CheckCircle
} from 'lucide-react';

const guides = [
  {
    title: 'Time Tracking',
    icon: Clock,
    steps: [
      {
        icon: Play,
        title: 'Start Timer',
        description: 'Click the play button to start tracking time for a project'
      },
      {
        icon: Pause,
        title: 'Pause Timer',
        description: 'Pause tracking when taking a break or switching tasks'
      },
      {
        icon: StopCircle,
        title: 'Stop Timer',
        description: 'Complete the time entry and save it to the project'
      }
    ]
  },
  {
    title: 'Project Management',
    icon: Briefcase,
    steps: [
      {
        icon: Plus,
        title: 'Create Project',
        description: 'Add new projects and assign team members'
      },
      {
        icon: Calendar,
        title: 'Set Timeline',
        description: 'Define project start and end dates'
      },
      {
        icon: CheckCircle,
        title: 'Track Progress',
        description: 'Monitor completion status and milestones'
      }
    ]
  },
  {
    title: 'Team Management',
    icon: Users,
    steps: [
      {
        icon: UserPlus,
        title: 'Add Members',
        description: 'Invite team members to join projects'
      },
      {
        icon: Coffee,
        title: 'Track Breaks',
        description: 'Monitor team availability and breaks'
      },
      {
        icon: BarChart3,
        title: 'View Analytics',
        description: 'Analyze team performance and utilization'
      }
    ]
  }
];

export default function AppGuide() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">How to Use ResourceFlow</h2>
        <p className="mt-4 text-lg text-gray-600">
          Follow these simple steps to get started with our resource management tools
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
            <p className="text-indigo-900">Set up project templates for recurring work to save time</p>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5 mr-2" />
            <p className="text-indigo-900">Review analytics weekly to optimize team productivity</p>
          </li>
        </ul>
      </div>
    </div>
  );
}