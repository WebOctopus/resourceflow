import { useState } from 'react';
import { DollarSign, PoundSterling, User, Bell, Palette } from 'lucide-react';
import { useSettingsStore } from '../lib/store/settingsStore';
import { Currency } from '../lib/types';
import ProfileSettings from '../components/settings/ProfileSettings';

export default function SettingsPage() {
  const { currency, setCurrency } = useSettingsStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences'>('profile');

  const currencies: { value: Currency; label: string; icon: typeof DollarSign }[] = [
    { value: 'USD', label: 'US Dollar', icon: DollarSign },
    { value: 'GBP', label: 'British Pound', icon: PoundSterling },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`${
              activeTab === 'profile'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <User className="h-5 w-5 mr-2" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`${
              activeTab === 'preferences'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Palette className="h-5 w-5 mr-2" />
            Preferences
          </button>
        </nav>
      </div>

      {activeTab === 'profile' ? (
        <ProfileSettings />
      ) : (
        <div className="bg-white rounded-lg shadow">
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

            {/* Notification Settings */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive daily summary and alerts</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 bg-indigo-600"
                  >
                    <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}