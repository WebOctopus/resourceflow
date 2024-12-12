import { useState } from 'react';
import { 
  DollarSign, 
  PoundSterling, 
  Bell, 
  Moon, 
  Sun, 
  Clock, 
  Calendar,
  Mail,
  Palette,
  Layout,
  Languages
} from 'lucide-react';
import { useSettingsStore } from '../../lib/store/settingsStore';
import { Currency } from '../../lib/types';

interface SettingsSection {
  id: string;
  title: string;
  description: string;
}

const sections: SettingsSection[] = [
  { id: 'general', title: 'General', description: 'Basic application settings' },
  { id: 'appearance', title: 'Appearance', description: 'Customize the look and feel' },
  { id: 'notifications', title: 'Notifications', description: 'Manage alerts and reminders' },
  { id: 'timeTracking', title: 'Time Tracking', description: 'Configure time tracking behavior' },
  { id: 'localization', title: 'Localization', description: 'Language and regional settings' },
];

export default function SettingsPage() {
  const { currency, setCurrency, theme, setTheme, notifications, setNotifications } = useSettingsStore();
  const [activeSection, setActiveSection] = useState('general');

  const currencies: { value: Currency; label: string; icon: typeof DollarSign }[] = [
    { value: 'USD', label: 'US Dollar', icon: DollarSign },
    { value: 'GBP', label: 'British Pound', icon: PoundSterling },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Customize your ResourceFlow experience
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                    activeSection === section.id
                      ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow">
            {/* General Settings */}
            {activeSection === 'general' && (
              <div>
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">General Settings</h2>
                </div>
                <div className="p-6 space-y-6">
                  {/* Currency Settings */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Default Currency</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currencies.map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          onClick={() => setCurrency(value)}
                          className={`flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${
                            currency === value
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`p-2 rounded-full ${
                              currency === value ? 'bg-indigo-100' : 'bg-gray-100'
                            }`}>
                              <Icon className={`h-5 w-5 ${
                                currency === value ? 'text-indigo-600' : 'text-gray-500'
                              }`} />
                            </div>
                            <div className="ml-3">
                              <p className={`font-medium ${
                                currency === value ? 'text-indigo-900' : 'text-gray-900'
                              }`}>
                                {label}
                              </p>
                              <p className={`text-sm ${
                                currency === value ? 'text-indigo-700' : 'text-gray-500'
                              }`}>
                                Display all amounts in {value}
                              </p>
                            </div>
                          </div>
                          <div className={`h-5 w-5 rounded-full border-2 ${
                            currency === value
                              ? 'border-indigo-500 bg-indigo-500'
                              : 'border-gray-300'
                          }`}>
                            {currency === value && (
                              <svg className="h-full w-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Email Settings */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Email Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Daily Summary</p>
                          <p className="text-sm text-gray-500">Receive a daily summary of your tracked time</p>
                        </div>
                        <button
                          type="button"
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                            notifications.dailySummary ? 'bg-indigo-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            notifications.dailySummary ? 'translate-x-5' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}