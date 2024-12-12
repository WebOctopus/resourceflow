import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../lib/store';
import ClientPortalSidebar from './ClientPortalSidebar';
import ClientPortalHeader from './ClientPortalHeader';
import { useState, useEffect } from 'react';

export default function ClientPortalLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Desktop sidebar - always visible */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <span className="text-xl font-bold text-indigo-600">Client Portal</span>
          </div>
          <ClientPortalSidebar isOpen={false} onClose={() => {}} />
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className="lg:hidden">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40" onClick={() => setSidebarOpen(false)} />
        )}
        <ClientPortalSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <ClientPortalHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}