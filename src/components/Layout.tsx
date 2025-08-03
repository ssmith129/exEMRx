import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
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
  Mail,
  ChevronDown,
  ChevronRight,
  Search,
  Activity,
  Shield,
  HelpCircle,
  LogOut,
  Star,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavigationGroup {
  title: string;
  items: NavigationItem[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: number | string;
  badgeColor?: 'primary' | 'success' | 'warning' | 'error';
  description?: string;
  new?: boolean;
}

export default function Layout({ children }: LayoutProps) {
  const auth = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['core', 'communication']);
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { addNotification, notifications } = useNotifications();

  // Navigation structure with logical grouping
  const navigationGroups: NavigationGroup[] = [
    {
      title: 'Core Functions',
      collapsible: false,
      defaultExpanded: true,
      items: [
        { 
          name: 'Dashboard', 
          href: '/dashboard', 
          icon: Home,
          description: 'Overview and quick actions'
        },
        { 
          name: 'Smart Charting', 
          href: '/charting', 
          icon: FileText,
          description: 'AI-enhanced documentation',
          new: true
        }
      ]
    },
    {
      title: 'Patient Care',
      collapsible: true,
      defaultExpanded: true,
      items: [
        { 
          name: 'Referrals', 
          href: '/referrals', 
          icon: Users,
          badge: 3,
          badgeColor: 'warning',
          description: 'Manage patient referrals'
        },
        { 
          name: 'Case Notes', 
          href: '/notes', 
          icon: MessageSquare,
          description: 'Collaborative documentation'
        }
      ]
    },
    {
      title: 'Analytics & Reports',
      collapsible: true,
      defaultExpanded: false,
      items: [
        { 
          name: 'Reports', 
          href: '/reports', 
          icon: BarChart3,
          description: 'Analytics and insights'
        },
        { 
          name: 'Compliance', 
          href: '/compliance', 
          icon: Shield,
          badge: '94%',
          badgeColor: 'success',
          description: 'Compliance monitoring'
        }
      ]
    },
    {
      title: 'Communication',
      collapsible: true,
      defaultExpanded: true,
      items: [
        { 
          name: 'Messages', 
          href: '/messages', 
          icon: Mail,
          badge: 5,
          badgeColor: 'primary',
          description: 'Secure messaging'
        }
      ]
    },
    {
      title: 'System',
      collapsible: true,
      defaultExpanded: false,
      items: [
        { 
          name: 'Settings', 
          href: '/settings', 
          icon: Settings,
          description: 'System configuration'
        },
        { 
          name: 'Help & Support', 
          href: '/help', 
          icon: HelpCircle,
          description: 'Documentation and support'
        }
      ]
    }
  ];

  // Initialize expanded groups
  useEffect(() => {
    const defaultExpanded = navigationGroups
      .filter(group => group.defaultExpanded)
      .map(group => group.title.toLowerCase().replace(/\s+/g, '-'));
    setExpandedGroups(defaultExpanded);
  }, []);

  const isCurrentPage = (href: string) => location.pathname === href;

  const toggleGroup = (groupTitle: string) => {
    const groupKey = groupTitle.toLowerCase().replace(/\s+/g, '-');
    setExpandedGroups(prev => 
      prev.includes(groupKey) 
        ? prev.filter(g => g !== groupKey)
        : [...prev, groupKey]
    );
  };

  const isGroupExpanded = (groupTitle: string) => {
    const groupKey = groupTitle.toLowerCase().replace(/\s+/g, '-');
    return expandedGroups.includes(groupKey);
  };

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

  const getBadgeColor = (color?: string) => {
    switch (color) {
      case 'primary': return 'bg-primary-500 text-white';
      case 'success': return 'bg-green-500 text-white';
      case 'warning': return 'bg-yellow-500 text-white';
      case 'error': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const recentActivity = [
    { action: 'Patient visit completed', time: '2 min ago', icon: Clock },
    { action: 'Referral approved', time: '15 min ago', icon: Users },
    { action: 'Compliance alert', time: '1 hr ago', icon: AlertTriangle }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Enhanced Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        w-72
        bg-white shadow-lg border-r border-gray-200
        flex flex-col overflow-hidden
      `}>
        
        {/* Header Section */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-500 p-2 rounded-xl shadow-soft">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">ezEMRx</span>
              <p className="text-xs text-gray-500 font-medium">Healthcare EHR</p>
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Close Toggle - Mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Quick Actions Bar */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <button
              onClick={() => setShowPatientSearch(true)}
              className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-xl transition-all duration-200 group hover:shadow-sm"
            >
              <Search className="h-4 w-4 group-hover:text-primary-600 transition-colors" />
              <span>Search patients...</span>
            </button>
          </div>

        {/* Navigation Groups */}
        <nav className="flex-1 px-6 py-6 space-y-6 overflow-y-auto scrollbar-thin">
          {navigationGroups.map((group) => (
            <div key={group.title} className="space-y-3">
              {/* Group Header */}
              {group.collapsible !== false && (
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="w-full flex items-center justify-between px-2 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-50"
                  aria-expanded={isGroupExpanded(group.title)}
                >
                  <span className="uppercase tracking-wider">{group.title}</span>
                  <ChevronDown className={`h-3 w-3 transition-transform ${
                    isGroupExpanded(group.title) ? 'rotate-180' : ''
                  }`} />
                </button>
              )}
              
              {/* Group Items */}
              <div className={`space-y-2 transition-all duration-200 ${
                !group.collapsible || isGroupExpanded(group.title) 
                  ? 'opacity-100 max-h-none' 
                  : 'opacity-0 max-h-0 overflow-hidden'
              }`}>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isCurrentPage(item.href);
                  
                  return (
                    <Link
                      key={item.name}
                      to={`/app${item.href}`}
                      className={`
                        group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl 
                        transition-all duration-200
                        ${isActive
                          ? 'bg-primary-100 text-primary-700 shadow-sm'
                          : 'text-gray-700 hover:text-primary-700 hover:bg-primary-50'
                        }
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div className="relative flex-shrink-0">
                        <Icon className={`
                          h-5 w-5 transition-colors duration-200
                          ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600'}
                        `} />
                        
                        {/* New indicator */}
                        {item.new && (
                          <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full" />
                        )}
                      </div>
                      
                        <>
                          <div className="ml-4 flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="truncate">{item.name}</span>
                              {/* Badge */}
                              {item.badge && (
                                <span className={`
                                  inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold min-w-[20px] h-5
                                  ${getBadgeColor(item.badgeColor)}
                                `}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-xs text-gray-500 mt-1 truncate leading-none">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Recent Activity */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Recent Activity
            </h4>
            <div className="space-y-3">
              {recentActivity.slice(0, 2).map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 text-xs">
                    <Icon className="h-3 w-3 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-600 truncate leading-tight">{activity.action}</p>
                      <p className="text-gray-400 mt-1 leading-none">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        {/* Enhanced User Section */}
        <div className="border-t border-gray-200 p-6 bg-white">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`
                w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-200
                hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500
              `}
            >
              <div className="relative">
                <div className="bg-primary-100 p-2 rounded-full">
                  <User className="h-4 w-4 text-primary-600" />
                </div>
                <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 border-2 border-white rounded-full" />
              </div>
              
                <>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900">{auth?.user?.name || 'User'}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-xs text-gray-500 leading-none">{auth?.user?.role || 'Healthcare Professional'}</p>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Online
                      </span>
                    </div>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${
                    userMenuOpen ? 'rotate-180' : ''
                  }`} />
                </>
            </button>

            {/* User Menu Dropdown */}
            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-3 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <button className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center space-x-3 transition-colors">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>Profile Settings</span>
                </button>
                <button className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center space-x-3 transition-colors">
                  <Star className="h-4 w-4 text-gray-400" />
                  <span>Preferences</span>
                </button>
                <hr className="my-2 mx-4" />
                <button 
                  onClick={() => auth?.logout()}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center space-x-3 text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Top Header */}
        <header className="bg-white shadow-soft border-b border-gray-100">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                aria-label="Open sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              {/* Breadcrumb */}
              <nav className="hidden md:flex items-center space-x-2 text-sm">
                <Link to="/app/dashboard" className="text-gray-500 hover:text-primary-600 transition-colors cursor-pointer">
                  ezEMRx
                </Link>
                <ChevronRight className="h-4 w-4 text-gray-300" />
                <span className="text-gray-900 font-medium">
                  {navigationGroups
                    .flatMap(g => g.items)
                    .find(item => isCurrentPage(`/app${item.href}`))?.name || 'Dashboard'}
                </span>
              </nav>
            </div>

            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowPatientSearch(true)}
                className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                aria-label="Search patients"
              >
                <Search className="h-5 w-5" />
              </button>
              
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full animate-bounce">
                    {notifications.length > 9 ? '9+' : notifications.length}
                  </span>
                )}
              </button>
              
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
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