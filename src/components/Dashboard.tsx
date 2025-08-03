import React, { useState } from 'react';
import { useAlerts, AlertSystem, AlertTemplates } from './AlertSystem';
import { FloatingActionButton } from './MicroInteractions';
import { useNotifications } from './NotificationSystem';
import { PatientFlowChart, ComplianceChart, ActivityMetricsChart } from './ChartComponents';
import PatientSearch from './PatientSearch';
import AppointmentScheduler from './AppointmentScheduler';
import { 
  Users, 
  Calendar, 
  ClipboardCheck, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  MessageSquare,
  Settings,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [showAppointmentScheduler, setShowAppointmentScheduler] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const { alerts, addAlert, dismissAlert, handleAction } = useAlerts();
  const { addNotification } = useNotifications();

  // Initialize with some sample alerts
  React.useEffect(() => {
    addAlert(AlertTemplates.patientOverdue('Maria Rodriguez', 5));
    addAlert(AlertTemplates.complianceIssue('Missing immunization records for 3 patients'));
    addAlert(AlertTemplates.systemMaintenance('Tonight at 11 PM', '2 hours'));
  }, []);

  const stats = [
    {
      name: 'Patients Seen Today',
      value: '24',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Pending Appointments',
      value: '8',
      change: '-3%',
      changeType: 'negative',
      icon: Calendar,
      color: 'bg-yellow-500'
    },
    {
      name: 'Compliance Score',
      value: '96%',
      change: '+2%',
      changeType: 'positive',
      icon: ClipboardCheck,
      color: 'bg-green-500'
    },
    {
      name: 'AI Efficiency Gain',
      value: '34%',
      change: '+8%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-primary-500'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'charting',
      patient: 'Maria Rodriguez',
      action: 'WIC nutrition assessment completed',
      time: '10 minutes ago',
      status: 'completed',
      aiAssisted: true
    },
    {
      id: 2,
      type: 'referral',
      patient: 'James Wilson',
      action: 'Referred to pediatric specialist',
      time: '25 minutes ago',
      status: 'pending',
      aiAssisted: true
    },
    {
      id: 3,
      type: 'compliance',
      patient: 'Sarah Kim',
      action: 'Immunization record updated',
      time: '1 hour ago',
      status: 'completed',
      aiAssisted: false
    }
  ];

  const complianceAlerts = [
    {
      id: 1,
      type: 'warning',
      message: '3 patients missing required documentation',
      priority: 'medium',
      count: 3
    },
    {
      id: 2,
      type: 'error',
      message: '1 incomplete immunization record',
      priority: 'high',
      count: 1
    }
  ];

  const handleSelectPatient = (patient: any) => {
    setSelectedPatient(patient);
    setShowPatientSearch(false);
    // Navigate to patient chart or show patient details
    console.log('Selected patient:', patient);
  };

  const handleScheduleAppointment = (appointment: any) => {
    console.log('Scheduled appointment:', appointment);
    // Add appointment to calendar/database
  };

  const quickActions = [
    {
      title: 'Find Patient',
      description: 'Search and select patient records',
      icon: Users,
      color: 'bg-blue-500',
     onClick: () => setShowPatientSearch(true),
     href: null
    },
    {
      title: 'Schedule Appointment',
      description: 'Book new patient appointments',
      icon: Calendar,
      color: 'bg-green-500',
     onClick: () => setShowAppointmentScheduler(true),
     href: null
    },
    {
      title: 'Start Charting',
      description: 'Begin new patient documentation',
      icon: ClipboardCheck,
      color: 'bg-primary-500',
     onClick: () => window.location.href = '/app/charting',
     href: '/app/charting'
    },
    {
      title: 'View Reports',
      description: 'Access analytics and reports',
      icon: TrendingUp,
      color: 'bg-purple-500',
     onClick: () => window.location.href = '/app/reports',
     href: '/app/reports'
    },
    {
      title: 'Message Center',
      description: 'Secure team communication',
      icon: MessageSquare,
      color: 'bg-yellow-500',
     onClick: () => window.location.href = '/app/messages',
     href: '/app/messages'
    },
    {
      title: 'System Settings',
      description: 'Configure preferences',
      icon: Settings,
      color: 'bg-gray-500',
     onClick: () => window.location.href = '/app/settings',
     href: '/app/settings'
    }
  ];

  const handleQuickAction = (action: any) => {
    action.onClick();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, Dr. Chen. Here's what's happening at your clinic today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl shadow-soft border border-secondary-100/80 p-6 hover:shadow-medium transition-all duration-300">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                    <span className={`ml-2 text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Alerts</h2>
          <AlertSystem
            alerts={alerts}
            onDismiss={dismissAlert}
            onAction={handleAction}
          />
        </div>
      )}

      {/* Data Visualization Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-secondary-900 mb-6">Analytics Overview</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <PatientFlowChart />
          <ComplianceChart />
        </div>
        <div className="grid grid-cols-1 gap-6">
          <ActivityMetricsChart />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                className="bg-white rounded-xl shadow-soft border border-secondary-100/80 p-6 text-left hover:shadow-medium hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center mb-3">
                  <div className={`${action.color} p-2 rounded-xl shadow-soft`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-secondary-900">{action.title}</h3>
                </div>
                <p className="text-sm text-secondary-600">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-soft border border-secondary-100/80">
          <div className="p-6 border-b border-secondary-200/50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-secondary-900">Recent Activity</h2>
              <select 
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="text-sm border border-secondary-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-secondary-50 rounded-xl transition-colors duration-200">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    {activity.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-secondary-900">{activity.patient}</p>
                      {activity.aiAssisted && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                          AI Assisted
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-secondary-600">{activity.action}</p>
                    <p className="text-xs text-secondary-400 mt-1">{activity.time}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-secondary-400" />
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-secondary-200/50">
              <Link 
               to="/app/charting" 
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                View all activity →
              </Link>
            </div>
          </div>
        </div>

        {/* Compliance Alerts */}
        <div className="bg-white rounded-xl shadow-soft border border-secondary-100/80">
          <div className="p-6 border-b border-secondary-200/50">
            <h2 className="text-xl font-semibold text-secondary-900">Compliance Alerts</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {complianceAlerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-xl border-l-4 ${
                  alert.type === 'error' ? 'bg-red-50 border-red-400' : 'bg-yellow-50 border-yellow-400'
                }`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <AlertTriangle className={`h-5 w-5 ${
                        alert.type === 'error' ? 'text-red-400' : 'text-yellow-400'
                      }`} />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className={`text-sm font-medium ${
                        alert.type === 'error' ? 'text-red-800' : 'text-yellow-800'
                      }`}>
                        {alert.message}
                      </p>
                      <div className="mt-2">
                        <button className={`text-xs font-medium ${
                          alert.type === 'error' ? 'text-red-600 hover:text-red-500' : 'text-yellow-600 hover:text-yellow-500'
                        }`}>
                          Review {alert.count} case{alert.count !== 1 ? 's' : ''} →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-secondary-200/50">
              <button className="w-full text-center text-sm font-medium text-primary-600 hover:text-primary-500">
                View Compliance Dashboard →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPatientSearch && (
        <PatientSearch
          onSelectPatient={handleSelectPatient}
          onClose={() => setShowPatientSearch(false)}
        />
      )}

      {showAppointmentScheduler && (
        <AppointmentScheduler
          patient={selectedPatient}
          onClose={() => setShowAppointmentScheduler(false)}
          onSchedule={handleScheduleAppointment}
        />
      )}

      {/* Floating Action Button */}
      <FloatingActionButton
        icon={<Plus className="h-6 w-6" />}
        onClick={() => setShowPatientSearch(true)}
        tooltip="Quick Patient Search"
      />
    </div>
  );
}