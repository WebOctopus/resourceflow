import { 
  Clock, 
  PieChart, 
  Users, 
  Briefcase,
  Calendar, 
  BarChart3,
  Target,
  Zap,
  Shield,
  MessageSquare,
  DollarSign,
  Gauge
} from 'lucide-react';

const features = [
  {
    name: 'Smart Time Tracking',
    description: 'Automatically track time across projects with intelligent categorization and real-time monitoring.',
    icon: Clock,
    details: [
      'Automatic time detection',
      'Project-based tracking',
      'Break time management',
      'Activity categorization'
    ]
  },
  {
    name: 'Resource Analytics',
    description: 'Make data-driven decisions with comprehensive analytics and performance metrics.',
    icon: PieChart,
    details: [
      'Team utilization metrics',
      'Project progress tracking',
      'Cost analysis',
      'Performance insights'
    ]
  },
  {
    name: 'Team Management',
    description: 'Efficiently manage your team with role-based access control and workload optimization.',
    icon: Users,
    details: [
      'Role-based permissions',
      'Workload balancing',
      'Team collaboration',
      'Performance tracking'
    ]
  },
  {
    name: 'Client Portal',
    description: 'Provide clients with a dedicated portal for project oversight and communication.',
    icon: Briefcase,
    details: [
      'Project progress views',
      'Budget tracking',
      'Document sharing',
      'Communication tools'
    ]
  },
  {
    name: 'Project Planning',
    description: 'Plan and execute projects with powerful scheduling and resource allocation tools.',
    icon: Calendar,
    details: [
      'Timeline management',
      'Resource allocation',
      'Milestone tracking',
      'Dependency management'
    ]
  },
  {
    name: 'Performance Metrics',
    description: 'Track KPIs and measure productivity across all projects and team members.',
    icon: BarChart3,
    details: [
      'Custom KPI tracking',
      'Productivity metrics',
      'Goal monitoring',
      'Performance reports'
    ]
  }
];

const benefits = [
  {
    title: 'Increased Efficiency',
    description: 'Boost productivity by up to 40% with automated time tracking and resource management.',
    icon: Zap
  },
  {
    title: 'Better Resource Allocation',
    description: 'Optimize team utilization and project staffing with data-driven insights.',
    icon: Target
  },
  {
    title: 'Enhanced Security',
    description: 'Keep your data safe with role-based access control and secure client portals.',
    icon: Shield
  },
  {
    title: 'Improved Communication',
    description: 'Streamline client and team communication with integrated messaging and updates.',
    icon: MessageSquare
  },
  {
    title: 'Cost Optimization',
    description: 'Reduce overhead costs and improve project profitability with budget tracking.',
    icon: DollarSign
  },
  {
    title: 'Real-time Monitoring',
    description: 'Stay on top of project progress and team performance with live updates.',
    icon: Gauge
  }
];

export default function Features() {
  return (
    <div id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to manage your agency
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Streamline your workflow and ensure optimal resource allocation with our comprehensive suite of tools.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="absolute -top-4 left-4">
                    <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="pt-8">
                    <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                    <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                    <ul className="mt-4 space-y-2">
                      {feature.details.map((detail) => (
                        <li key={detail} className="flex items-center text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-32">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-16">
            Benefits of Using ResourceFlow
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 rounded-lg p-3">
                    <benefit.icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="ml-4 text-lg font-medium text-gray-900">{benefit.title}</h3>
                </div>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}