import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { useNotifications } from './NotificationSystem';
import EnhancedNavigation from './EnhancedNavigation';
import PatientSearch from './PatientSearch';
import { Menu, Bell, User } from 'lucide-react';

export default function LayoutWithEnhancedNav() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const { notifications } = useNotifications();

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const currentUser = {
    name: user?.name || 'Dr. Sarah Smith',
    role: user?.role || 'Primary Care Physician',
    avatar: user?.avatar
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Enhanced Navigation Sidebar */}
      <EnhancedNavigation 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentUser={currentUser}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Open navigation"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPatientSearch(true)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Search patients"
              >
                <Search className="h-5 w-5" />
              </button>
              
              <button className="relative p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <Bell className="h-5 w-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                )}
              </button>
              
              <div className="relative">
                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Patient Search Modal */}
      {showPatientSearch && (
        <PatientSearch onClose={() => setShowPatientSearch(false)} />
      )}
    </div>
  );
}
