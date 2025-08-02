import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  XCircle, 
  X,
  Clock,
  Bell,
  Shield,
  Activity,
  Users,
  FileText
} from 'lucide-react';
import { useNotifications } from './NotificationSystem';

interface Alert {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'system';
  category: 'patient' | 'compliance' | 'system' | 'security' | 'appointment';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionRequired: boolean;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }>;
  dismissible?: boolean;
  autoExpire?: number; // minutes
}

interface AlertSystemProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
  onAction: (alertId: string, actionIndex: number) => void;
}

export const AlertSystem: React.FC<AlertSystemProps> = ({
  alerts,
  onDismiss,
  onAction
}) => {
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());

  const toggleExpanded = (alertId: string) => {
    const newExpanded = new Set(expandedAlerts);
    if (newExpanded.has(alertId)) {
      newExpanded.delete(alertId);
    } else {
      newExpanded.add(alertId);
    }
    setExpandedAlerts(newExpanded);
  };

  const getAlertIcon = (type: string, category: string) => {
    if (category === 'system') return <Activity className="h-5 w-5" />;
    if (category === 'security') return <Shield className="h-5 w-5" />;
    if (category === 'patient') return <Users className="h-5 w-5" />;
    if (category === 'compliance') return <FileText className="h-5 w-5" />;
    
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5" />;
      case 'warning': return <AlertTriangle className="h-5 w-5" />;
      case 'error': return <XCircle className="h-5 w-5" />;
      case 'info': return <Info className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getAlertColors = (type: string, priority: string) => {
    if (priority === 'critical') {
      return 'bg-red-100 border-red-500 text-red-900';
    }
    
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'system': return 'bg-purple-50 border-purple-200 text-purple-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[priority as keyof typeof colors]}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  // Sort alerts by priority and timestamp
  const sortedAlerts = [...alerts].sort((a, b) => {
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder];
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder];
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  return (
    <div className="space-y-3">
      {sortedAlerts.map((alert) => {
        const isExpanded = expandedAlerts.has(alert.id);
        
        return (
          <div
            key={alert.id}
            className={`
              border-l-4 rounded-lg p-4 transition-all duration-200
              ${getAlertColors(alert.type, alert.priority)}
              ${alert.priority === 'critical' ? 'animate-pulse' : ''}
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0 mt-0.5">
                  {getAlertIcon(alert.type, alert.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium">{alert.title}</h4>
                    {getPriorityBadge(alert.priority)}
                    {alert.actionRequired && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Action Required
                      </span>
                    )}
                  </div>
                  
                  <p className={`text-sm ${isExpanded ? '' : 'line-clamp-2'}`}>
                    {alert.message}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2 text-xs opacity-75">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimestamp(alert.timestamp)}</span>
                      <span className="capitalize">• {alert.category}</span>
                    </div>
                    
                    {alert.message.length > 100 && (
                      <button
                        onClick={() => toggleExpanded(alert.id)}
                        className="text-xs font-medium hover:underline"
                      >
                        {isExpanded ? 'Show Less' : 'Show More'}
                      </button>
                    )}
                  </div>

                  {alert.actions && alert.actions.length > 0 && (
                    <div className="flex space-x-2 mt-3">
                      {alert.actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => onAction(alert.id, index)}
                          className={`
                            px-3 py-1 text-xs font-medium rounded transition-colors
                            ${action.variant === 'primary'
                              ? 'bg-white bg-opacity-20 hover:bg-opacity-30'
                              : 'hover:bg-white hover:bg-opacity-10'
                            }
                          `}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {alert.dismissible !== false && (
                <button
                  onClick={() => onDismiss(alert.id)}
                  className="flex-shrink-0 p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors ml-2"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Hook for managing alerts
export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { addNotification } = useNotifications();

  const addAlert = (alert: Omit<Alert, 'id' | 'timestamp'>) => {
    const newAlert: Alert = {
      ...alert,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    setAlerts(prev => [...prev, newAlert]);

    // Auto-expire if specified
    if (alert.autoExpire) {
      setTimeout(() => {
        dismissAlert(newAlert.id);
      }, alert.autoExpire * 60 * 1000);
    }

    // Show notification for high priority alerts
    if (alert.priority === 'high' || alert.priority === 'critical') {
      addNotification({
        type: alert.type,
        title: alert.title,
        message: alert.message,
        persistent: alert.priority === 'critical'
      });
    }
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const handleAction = (alertId: string, actionIndex: number) => {
    const alert = alerts.find(a => a.id === alertId);
    if (alert && alert.actions && alert.actions[actionIndex]) {
      alert.actions[actionIndex].onClick();
      // Optionally dismiss alert after action
      dismissAlert(alertId);
    }
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  const getAlertsByCategory = (category: string) => {
    return alerts.filter(alert => alert.category === category);
  };

  const getAlertsByPriority = (priority: string) => {
    return alerts.filter(alert => alert.priority === priority);
  };

  return {
    alerts,
    addAlert,
    dismissAlert,
    handleAction,
    clearAllAlerts,
    getAlertsByCategory,
    getAlertsByPriority
  };
};

// Predefined alert templates
export const AlertTemplates = {
  patientOverdue: (patientName: string, daysPast: number): Omit<Alert, 'id' | 'timestamp'> => ({
    type: 'warning',
    category: 'patient',
    title: 'Overdue Visit',
    message: `${patientName} is ${daysPast} days overdue for their follow-up appointment.`,
    priority: 'medium',
    actionRequired: true,
    actions: [
      {
        label: 'Schedule Appointment',
        onClick: () => console.log('Schedule appointment'),
        variant: 'primary'
      },
      {
        label: 'Contact Patient',
        onClick: () => console.log('Contact patient'),
        variant: 'secondary'
      }
    ]
  }),

  complianceIssue: (issue: string): Omit<Alert, 'id' | 'timestamp'> => ({
    type: 'error',
    category: 'compliance',
    title: 'Compliance Issue Detected',
    message: `${issue} requires immediate attention to maintain compliance standards.`,
    priority: 'high',
    actionRequired: true,
    actions: [
      {
        label: 'Review Issue',
        onClick: () => console.log('Review compliance issue'),
        variant: 'primary'
      }
    ]
  }),

  systemMaintenance: (startTime: string, duration: string): Omit<Alert, 'id' | 'timestamp'> => ({
    type: 'info',
    category: 'system',
    title: 'Scheduled Maintenance',
    message: `System maintenance is scheduled for ${startTime} and will last approximately ${duration}.`,
    priority: 'low',
    actionRequired: false,
    autoExpire: 60 // 1 hour
  }),

  securityAlert: (details: string): Omit<Alert, 'id' | 'timestamp'> => ({
    type: 'error',
    category: 'security',
    title: 'Security Alert',
    message: details,
    priority: 'critical',
    actionRequired: true,
    dismissible: false,
    actions: [
      {
        label: 'Review Security',
        onClick: () => console.log('Review security'),
        variant: 'primary'
      }
    ]
  })
};