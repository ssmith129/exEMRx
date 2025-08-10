import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  ClipboardList,
  BarChart3,
  Settings,
  Search,
  Plus,
  FileText,
  Calendar,
  MessageSquare,
  HelpCircle,
  Activity,
  ChevronDown,
  ChevronRight,
  User,
  Star,
  LogOut,
  X,
  Bell,
  Shield,
  TrendingUp,
  Clock,
  Stethoscope,
  UserPlus,
  FileBarChart,
  AlertTriangle
} from 'lucide-react';

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  href?: string;
  badge?: string | number;
  badgeColor?: 'primary' | 'success' | 'warning' | 'danger';
  description?: string;
  children?: NavigationItem[];
  isNew?: boolean;
}

interface NavigationGroup {
  id: string;
  title: string;
  items: NavigationItem[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

interface EnhancedNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: {
    name: string;
    role: string;
    avatar?: string;
  };
}

const navigationStructure: NavigationGroup[] = [
  {
    id: 'main',
    title: 'Main',
    collapsible: false,
    defaultExpanded: true,
    items: [
      {
        id: 'dashboard',
        name: 'Dashboard',
        icon: Home,
        href: '/app/dashboard',
        description: 'Overview and quick access'
      }
    ]
  },
  {
    id: 'patient-care',
    title: 'Patient Care',
    collapsible: true,
    defaultExpanded: true,
    items: [
      {
        id: 'patients',
        name: 'Patient Management',
        icon: Users,
        children: [
          {
            id: 'search-patients',
            name: 'Search Patients',
            icon: Search,
            href: '/app/patients/search'
          },
          {
            id: 'new-patient',
            name: 'New Patient',
            icon: UserPlus,
            href: '/app/patients/new',
            isNew: true
          },
          {
            id: 'patient-lists',
            name: 'Patient Lists',
            icon: ClipboardList,
            href: '/app/patients/lists',
            badge: 3,
            badgeColor: 'primary'
          }
        ]
      },
      {
        id: 'clinical',
        name: 'Clinical Workflow',
        icon: Stethoscope,
        children: [
          {
            id: 'charting',
            name: 'Smart Charting',
            icon: FileText,
            href: '/app/charting',
            description: 'AI-enhanced documentation'
          },
          {
            id: 'appointments',
            name: 'Appointments',
            icon: Calendar,
            href: '/app/appointments',
            badge: 8,
            badgeColor: 'warning'
          },
          {
            id: 'case-notes',
            name: 'Case Notes',
            icon: ClipboardList,
            href: '/app/case-notes'
          }
        ]
      }
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics & Reports',
    collapsible: true,
    defaultExpanded: false,
    items: [
      {
        id: 'reports',
        name: 'Clinical Reports',
        icon: FileBarChart,
        href: '/app/reports'
      },
      {
        id: 'quality-metrics',
        name: 'Quality Metrics',
        icon: TrendingUp,
        href: '/app/metrics',
        badge: 'New',
        badgeColor: 'success'
      },
      {
        id: 'compliance',
        name: 'Compliance Audit',
        icon: Shield,
        href: '/app/compliance',
        badge: 2,
        badgeColor: 'danger'
      }
    ]
  },
  {
    id: 'communication',
    title: 'Communication',
    collapsible: true,
    defaultExpanded: false,
    items: [
      {
        id: 'messages',
        name: 'Messages',
        icon: MessageSquare,
        href: '/app/messages',
        badge: 5,
        badgeColor: 'primary'
      },
      {
        id: 'notifications',
        name: 'Notifications',
        icon: Bell,
        href: '/app/notifications',
        badge: 12,
        badgeColor: 'warning'
      }
    ]
  },
  {
    id: 'system',
    title: 'System',
    collapsible: true,
    defaultExpanded: false,
    items: [
      {
        id: 'settings',
        name: 'Settings',
        icon: Settings,
        href: '/app/settings'
      },
      {
        id: 'help',
        name: 'Help & Support',
        icon: HelpCircle,
        href: '/app/help'
      }
    ]
  }
];

const recentActivities = [
  {
    id: '1',
    patient: 'Sarah Johnson',
    action: 'Chart updated',
    time: '2 min ago',
    type: 'chart'
  },
  {
    id: '2',
    patient: 'Michael Chen',
    action: 'Appointment scheduled',
    time: '5 min ago',
    type: 'appointment'
  },
  {
    id: '3',
    patient: 'Emma Davis',
    action: 'Lab results reviewed',
    time: '12 min ago',
    type: 'lab'
  }
];

export default function EnhancedNavigation({ isOpen, onClose, currentUser }: EnhancedNavigationProps) {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(navigationStructure.filter(g => g.defaultExpanded).map(g => g.id))
  );
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const isCurrentPage = (href: string) => {
    return location.pathname === href;
  };

  const getBadgeStyles = (color: string = 'primary') => {
    const styles = {
      primary: 'bg-primary-100 text-primary-700 border-primary-200',
      success: 'bg-green-100 text-green-700 border-green-200',
      warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      danger: 'bg-red-100 text-red-700 border-red-200'
    };
    return styles[color as keyof typeof styles] || styles.primary;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'chart': return FileText;
      case 'appointment': return Calendar;
      case 'lab': return Activity;
      default: return Clock;
    }
  };

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isActive = item.href ? isCurrentPage(item.href) : false;
    const indentClass = level === 0 ? 'pl-4' : level === 1 ? 'pl-8' : 'pl-12';

    return (
      <div key={item.id} className="space-y-1">
        {hasChildren ? (
          <button
            onClick={() => toggleItem(item.id)}
            className={`
              w-full flex items-center justify-between ${indentClass} pr-4 py-3 text-sm font-medium rounded-xl 
              transition-all duration-200 group
              text-gray-700 hover:text-primary-700 hover:bg-primary-50
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            `}
            aria-expanded={isExpanded}
            aria-label={`Toggle ${item.name} submenu`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative flex-shrink-0">
                <Icon className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                {item.isNew && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full" />
                )}
              </div>
              <span className="truncate">{item.name}</span>
              {item.badge && (
                <span className={`
                  inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold
                  min-w-[20px] h-5 border ${getBadgeStyles(item.badgeColor)}
                `}>
                  {item.badge}
                </span>
              )}
            </div>
            <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
              isExpanded ? 'rotate-90' : ''
            }`} />
          </button>
        ) : (
          <Link
            to={item.href || '#'}
            onClick={onClose}
            className={`
              group relative flex items-center ${indentClass} pr-4 py-3 text-sm font-medium rounded-xl 
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
              ${isActive
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                : 'text-gray-700 hover:text-primary-700 hover:bg-primary-50'
              }
            `}
            aria-current={isActive ? 'page' : undefined}
            title={item.description || item.name}
          >
            <div className="relative flex-shrink-0">
              <Icon className={`
                h-5 w-5 transition-colors duration-200
                ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary-600'}
              `} />
              {item.isNew && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full" />
              )}
            </div>
            
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="truncate">{item.name}</span>
                {item.badge && (
                  <span className={`
                    inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold
                    min-w-[20px] h-5 border ml-2
                    ${isActive 
                      ? 'bg-white/20 text-white border-white/30' 
                      : getBadgeStyles(item.badgeColor)
                    }
                  `}>
                    {item.badge}
                  </span>
                )}
              </div>
              {item.description && !isActive && (
                <p className="text-xs text-gray-500 mt-0.5 truncate leading-none">
                  {item.description}
                </p>
              )}
            </div>
            
            {/* Active indicator */}
            {isActive && (
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
            )}
          </Link>
        )}
        
        {/* Render children */}
        {hasChildren && isExpanded && (
          <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
            {item.children!.map(child => renderNavigationItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Navigation Sidebar */}
      <div 
        ref={navRef}
        className={`
          fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          w-80 bg-white shadow-2xl border-r border-gray-200
          flex flex-col overflow-hidden
        `}
      >
        
        {/* Brand Header */}
        <div className="relative h-20 px-6 border-b border-gray-100 bg-gradient-to-r from-primary-50/80 via-white to-accent-50/50">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-3 rounded-2xl shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 border-2 border-white rounded-full" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">ezEMRx</h1>
                <p className="text-xs text-gray-600 font-medium uppercase tracking-wider">Healthcare Platform</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Quick Search */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-xl transition-all duration-200 group hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            <Search className="h-4 w-4 group-hover:text-primary-600 transition-colors" />
            <span>Search patients, records...</span>
            <div className="ml-auto">
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-200 border border-gray-300 rounded">���K</kbd>
            </div>
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto">
          <nav className="px-6 py-6 space-y-8">
            {navigationStructure.map((group) => (
              <div key={group.id} className="space-y-3">
                {/* Group Header */}
                {group.collapsible ? (
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between px-2 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-expanded={expandedGroups.has(group.id)}
                  >
                    <span className="uppercase tracking-wider">{group.title}</span>
                    <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${
                      expandedGroups.has(group.id) ? 'rotate-180' : ''
                    }`} />
                  </button>
                ) : (
                  <div className="px-2 py-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{group.title}</span>
                  </div>
                )}
                
                {/* Group Items */}
                <div className={`space-y-1 transition-all duration-300 ${
                  !group.collapsible || expandedGroups.has(group.id)
                    ? 'opacity-100 max-h-none' 
                    : 'opacity-0 max-h-0 overflow-hidden'
                }`}>
                  {group.items.map((item) => renderNavigationItem(item))}
                </div>
              </div>
            ))}
          </nav>

          {/* Recent Activity */}
          <div className="px-6 pb-6">
            <div className="space-y-3">
              <div className="px-2 py-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recent Activity</span>
              </div>
              <div className="space-y-2">
                {recentActivities.map((activity) => {
                  const ActivityIcon = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="p-1.5 bg-gray-100 rounded-lg">
                        <ActivityIcon className="h-3.5 w-3.5 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{activity.patient}</p>
                        <p className="text-xs text-gray-500 truncate">{activity.action}</p>
                      </div>
                      <span className="text-xs text-gray-400">{activity.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="relative border-t border-gray-200 p-6 bg-white">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-expanded={userMenuOpen}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-400 border-2 border-white rounded-full" />
            </div>
            
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-gray-900">{currentUser?.name || 'Dr. Sarah Smith'}</p>
              <div className="flex items-center space-x-2 mt-0.5">
                <p className="text-xs text-gray-500">{currentUser?.role || 'Primary Care Physician'}</p>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Online
                </span>
              </div>
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
              userMenuOpen ? 'rotate-180' : ''
            }`} />
          </button>

          {/* User Menu Dropdown */}
          {userMenuOpen && (
            <div className="absolute bottom-full left-6 right-6 mb-3 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in slide-in-from-bottom-2 duration-200">
              <button className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center space-x-3 transition-colors focus:outline-none focus:bg-gray-50">
                <User className="h-4 w-4 text-gray-400" />
                <span>Profile Settings</span>
              </button>
              <button className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center space-x-3 transition-colors focus:outline-none focus:bg-gray-50">
                <Star className="h-4 w-4 text-gray-400" />
                <span>Preferences</span>
              </button>
              <button className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center space-x-3 transition-colors focus:outline-none focus:bg-gray-50">
                <Settings className="h-4 w-4 text-gray-400" />
                <span>Account Settings</span>
              </button>
              <hr className="my-2 mx-4 border-gray-200" />
              <button className="w-full px-4 py-3 text-left text-sm hover:bg-red-50 flex items-center space-x-3 text-red-600 transition-colors focus:outline-none focus:bg-red-50">
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
