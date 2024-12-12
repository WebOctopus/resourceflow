import {
  FileText,
  Clock,
  BarChart3,
  PlusCircle,
  CheckCircle,
  MessageSquare,
  Eye,
  AlertTriangle,
  Calendar,
  DollarSign,
  Download,
  Bell
} from 'lucide-react';

const portalGuides = [
  {
    title: 'Project Management',
    icon: FileText,
    steps: [
      {
        icon: Eye,
        title: 'View Projects',
        description: 'Monitor active projects and their current status'
      },
      {
        icon: PlusCircle,
        title: 'Request Projects',
        description: 'Submit new project requests with requirements'
      },
      {
        icon: AlertTriangle,
        title: 'Track Status',
        description: 'Stay updated on project approvals and progress'
      }
    ]
  },
  {
    title: 'Time & Budget',
    icon: Clock,
    steps: [
      {
        icon: Calendar,
        title: 'Time Reports',
        description: 'View detailed time tracking for each project'
      },
      {
        icon: DollarSign,
        title: 'Budget Overview',
        description: 'Monitor project costs and budget utilization'
      },
      {
        icon: Download,
        title: 'Export Reports',
        description: 'Download time and budget reports for review'
      }
    ]
  },
  {
    title: 'Communication',
    icon: MessageSquare,
    steps: [
      {
        icon: Bell,
        title: 'Notifications',
        description: 'Receive updates on project milestones'
      },
      {
        icon: MessageSquare,
        title: 'Feedback',
        description: 'Provide feedback on project deliverables'
      },
      {
        icon: BarChart3,
        title: 'Progress Updates',
        description: 'View project progress and analytics'
      }
    ]
  }
];

export default function ClientPortalGuide() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Client Portal Guide</h2>
        <p className="mt-4 text-lg text-gray-600">
          Everything you need to know about managing your projects and tracking progress
        </p>
      </div>

      <div className="space-y-16">
        {portalGuides.map((guide, index) => (
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

            {index < portalGuides.length - 1 && (
              <div className="absolute left-6 bottom-0 w-0.5 h-8 bg-gray-200" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-indigo-50 rounded-lg">
        <h4 className="text-lg font-medium text-indigo-900 mb-4">Quick Tips</h4>
        <ul className="space-y-3">
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5 mr-2" />
            <p className="text-indigo-900">Check project status updates daily for the latest progress</p>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5 mr-2" />
            <p className="text-indigo-900">Submit detailed project requirements to ensure accurate estimates</p>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5 mr-2" />
            <p className="text-indigo-900">Enable notifications to stay updated on important milestones</p>
          </li>
        </ul>
      </div>
    </div>
  );
}