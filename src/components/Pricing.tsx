import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/store';

const plans = [
  {
    name: 'Freelance',
    price: '£9.99',
    description: 'Perfect for independent professionals',
    features: [
      'Up to 2 team members',
      'Basic time tracking',
      'Project management',
      'Client portal access',
      'Email support',
      'Basic analytics',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Small Team',
    price: '£29.99',
    description: 'Ideal for growing teams',
    features: [
      'Up to 10 team members',
      'Advanced time tracking',
      'Resource allocation',
      'Client portal with custom branding',
      'Priority support',
      'Advanced analytics',
      'Team performance metrics',
      'Custom reports',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Agency',
    price: '£49.99',
    description: 'For established businesses',
    features: [
      'Unlimited team members',
      'Enterprise-grade security',
      'Custom integrations',
      'Dedicated account manager',
      'White-label solutions',
      'API access',
      'Advanced permissions',
      'SLA guarantee',
      'Custom training',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const handlePlanSelect = (plan: string) => {
    if (plan === 'Agency') {
      window.location.href = 'mailto:sales@resourceflow.com';
    } else {
      // Always navigate to register page for free trial
      navigate('/register');
    }
  };

  return (
    <div id="pricing" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Pricing</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
            Choose the right plan for your team
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>

        <div className="mt-20 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 bg-white border rounded-2xl shadow-sm flex flex-col ${
                plan.popular
                  ? 'border-indigo-500 ring-2 ring-indigo-500'
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                  <span className="inline-flex rounded-full bg-indigo-500 px-4 py-1 text-sm font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                  <span className="ml-1 text-xl font-semibold">/month</span>
                </p>
                <p className="mt-6 text-gray-500">{plan.description}</p>

                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex">
                      <Check className="flex-shrink-0 w-5 h-5 text-green-500" />
                      <span className="ml-3 text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handlePlanSelect(plan.name)}
                className={`mt-8 block w-full py-3 px-6 border rounded-md text-center font-medium ${
                  plan.popular
                    ? 'bg-indigo-600 border-transparent text-white hover:bg-indigo-700'
                    : 'bg-white border-gray-300 text-indigo-600 hover:bg-gray-50'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500">
            All prices are in GBP and exclude VAT. Need a custom plan?{' '}
            <a href="mailto:sales@resourceflow.com" className="text-indigo-600 hover:text-indigo-500">
              Contact our sales team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}