import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserAnalytics from '../components/admin/UserAnalytics';
import UserList from '../components/admin/UserList';
import FeedbackList from '../components/admin/FeedbackList';
import FeedbackMetrics from '../components/admin/FeedbackMetrics';
import AuditLog from '../components/admin/AuditLog';
import { useAdminStore } from '../lib/store/adminStore';
import { LayoutDashboard, Users, MessageSquare, Activity, Shield, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'feedback' | 'audit'>('overview');
  const { logout } = useAdminStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'audit', label: 'Audit Log', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            Manage users, monitor feedback, and track system activity
          </p>
        </div>

        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <UserAnalytics />
            <FeedbackMetrics />
          </div>
        )}

        {activeTab === 'users' && <UserList />}
        {activeTab === 'feedback' && <FeedbackList />}
        {activeTab === 'audit' && <AuditLog />}
      </div>
    </div>
  );
}