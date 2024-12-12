import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useMobileDetection } from './lib/hooks/useMobileDetection';
import MobileWarning from './components/MobileWarning';
import { useAuthStore } from './lib/store';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import InviteLandingPage from './pages/auth/InviteLandingPage';
import AdminDashboard from './pages/AdminDashboard';
import DashboardLayout from './components/dashboard/DashboardLayout';
import ClientPortalLayout from './components/client-portal/ClientPortalLayout';
import HomePage from './pages/HomePage';

// Lazy load pages
const DashboardOverview = lazy(() => import('./pages/DashboardOverview'));
const TimeTrackingPage = lazy(() => import('./pages/TimeTrackingPage'));
const ClientManagementPage = lazy(() => import('./pages/ClientManagementPage'));
const TeamManagementPage = lazy(() => import('./pages/TeamManagementPage'));
const ProjectDetailsPage = lazy(() => import('./pages/ProjectDetailsPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const MyProjectsPage = lazy(() => import('./pages/MyProjectsPage'));

// Lazy load client portal pages
const ClientDashboard = lazy(() => import('./pages/client-portal/ClientDashboard'));
const ProjectsPage = lazy(() => import('./pages/client-portal/ProjectsPage'));
const TimeBudgetPage = lazy(() => import('./pages/client-portal/TimeBudgetPage'));
const CommunicationPage = lazy(() => import('./pages/client-portal/CommunicationPage'));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
  </div>
);

export default function App() {
  const { isMobile, isCompatible, error } = useMobileDetection();

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/accept-invite/:token" element={<InviteLandingPage />} />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Protected dashboard routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['manager', 'project_manager', 'team_member', 'freelancer']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardOverview />} />
            <Route path="time" element={<TimeTrackingPage />} />
            <Route path="clients" element={<ClientManagementPage />} />
            <Route path="team" element={<TeamManagementPage />} />
            <Route path="projects/:projectId" element={<ProjectDetailsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="my-projects" element={<MyProjectsPage />} />
          </Route>

          {/* Protected client portal routes */}
          <Route path="/client-portal" element={
            <ProtectedRoute allowedRoles={['client']}>
              <ClientPortalLayout />
            </ProtectedRoute>
          }>
            <Route index element={<ClientDashboard />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="time-budget" element={<TimeBudgetPage />} />
            <Route path="communication" element={<CommunicationPage />} />
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<HomePage />} />
        </Routes>

        {isMobile && !isCompatible && error && (
          <MobileWarning message={error} />
        )}
      </Suspense>
    </Router>
  );
}