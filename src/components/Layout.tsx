import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNotifications } from './NotificationSystem';
import PatientSearch from './PatientSearch';
import { 
  Home, 
  FileText, 
  Users, 
  MessageSquare, 
  Settings,
  Menu,
  X,
  Bell,
  User,
  BarChart3,
  Mail
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const location = useLocation();
  const { addNotification, notifications } = useNotifications();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Smart Charting', href: '/charting', icon: FileText },
    { name: 'Referrals', href: '/referrals', icon: Users },
    { name: 'Case Notes', href: '/notes', icon: MessageSquare },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Messages', href: '/messages', icon: Mail },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isCurrentPage = (href: string) => location.pathname === href;

  const handleSelectPatient = (patient: any) => {
    setShowPatientSearch(false);
    addNotification({
      type: 'success',
      title: 'Patient Accessed',
      message: `Opened chart for ${patient.name}`,
      actions: [
        {
          label: 'View Chart',
          onClick: () => window.location.href = `/patient/${patient.id}`,
          variant: 'primary'
        }
      ]
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-strong transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-secondary-200/50">
          <div className="flex items-center">
            <div className="bg-primary-500 p-2 rounded-xl shadow-soft">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold text-secondary-900">ezEMRx</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg text-secondary-400 hover:text-secondary-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                    ${isCurrentPage(item.href)
                      ? 'bg-primary-50 text-primary-600 border-r-3 border-primary-600'
                      : 'text-secondary-700 hover:text-primary-600 hover:bg-secondary-50'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`
                    mr-3 h-5 w-5 transition-colors duration-200
                    ${isCurrentPage(item.href) ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600'}
                  `} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-secondary-200/50">
          <div className="flex items-center">
            <div className="bg-secondary-200 p-2 rounded-full">
              <User className="h-4 w-4 text-secondary-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-secondary-900">Dr. Sarah Chen</p>
              <p className="text-xs text-secondary-500">Family Health Clinic</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-soft border-b border-secondary-100">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-secondary-400 hover:text-secondary-600 hover:bg-secondary-50 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowPatientSearch(true)}
                className="relative p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors"
              >
                <User className="h-5 w-5" />
              </button>
              
              <button className="relative p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {notifications.length > 9 ? '9+' : notifications.length}
                  </span>
                )}
              </button>
              
              <button className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-secondary-50/30">
          {children}
        </main>
      </div>

      {/* Global Patient Search */}
      {showPatientSearch && (
        <PatientSearch
          onSelectPatient={handleSelectPatient}
          onClose={() => setShowPatientSearch(false)}
        />
      )}
    </div>
  );
}