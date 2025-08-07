import React, { useEffect } from 'react';
import { CheckCircle, ArrowRight, Download, Share2, Edit3, Plus } from 'lucide-react';
import InteractiveButton from './InteractiveButton';
import { AnimatedButton } from './MicroInteractions';
import { useNotifications } from './NotificationSystem';

interface FormSuccessProps {
  title?: string;
  message?: string;
  details?: string[];
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryActions?: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: 'secondary' | 'ghost';
  }>;
  showConfetti?: boolean;
  autoClose?: {
    delay: number;
    onClose: () => void;
  };
  submittedData?: { [key: string]: any };
}

export const FormSuccess: React.FC<FormSuccessProps> = ({
  title = 'Success!',
  message = 'Your form has been submitted successfully.',
  details = [],
  primaryAction,
  secondaryActions = [],
  showConfetti = false,
  autoClose,
  submittedData
}) => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        autoClose.onClose();
      }, autoClose.delay);

      return () => clearTimeout(timer);
    }
  }, [autoClose]);

  useEffect(() => {
    if (showConfetti) {
      // Simple confetti effect using notifications
      const confettiEmojis = ['🎉', '✨', '🎊', '🌟', '💫'];
      confettiEmojis.forEach((emoji, index) => {
        setTimeout(() => {
          addNotification({
            type: 'success',
            title: emoji,
            message: '',
            duration: 1000 + index * 200
          });
        }, index * 100);
      });
    }
  }, [showConfetti, addNotification]);

  const formatValue = (key: string, value: any): string => {
    if (key.toLowerCase().includes('password')) {
      return '••••••••';
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return String(value);
  };

  const formatLabel = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Animation Container */}
      <div className="text-center mb-8">
        {/* Animated Success Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-in zoom-in-50 duration-500">
          <CheckCircle className="w-10 h-10 text-green-600 animate-in zoom-in-50 duration-700 delay-200" />
        </div>

        {/* Success Message */}
        <div className="animate-in slide-in-from-bottom-4 duration-500 delay-300">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{message}</p>
        </div>
      </div>

      {/* Details Section */}
      {details.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 animate-in slide-in-from-bottom-4 duration-500 delay-400">
          <h3 className="text-lg font-semibold text-green-900 mb-4">What happens next?</h3>
          <ul className="space-y-3">
            {details.map((detail, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-200 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-green-800 text-sm font-bold">{index + 1}</span>
                </div>
                <p className="text-green-800 leading-relaxed">{detail}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Submitted Data Summary */}
      {submittedData && Object.keys(submittedData).length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 animate-in slide-in-from-bottom-4 duration-500 delay-500">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Submitted Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(submittedData).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 mb-1">
                  {formatLabel(key)}
                </span>
                <span className="text-gray-900 font-medium">
                  {formatValue(key, value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-4">
        {/* Primary Action */}
        {primaryAction && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 delay-600">
            <AnimatedButton
              variant="primary"
              size="lg"
              onClick={primaryAction.onClick}
              className="w-full"
              animation="glow"
              icon={primaryAction.icon || <ArrowRight className="h-5 w-5" />}
            >
              {primaryAction.label}
            </AnimatedButton>
          </div>
        )}

        {/* Secondary Actions */}
        {secondaryActions.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 animate-in slide-in-from-bottom-4 duration-500 delay-700">
            {secondaryActions.map((action, index) => (
              <InteractiveButton
                key={index}
                variant={action.variant || 'secondary'}
                onClick={action.onClick}
                className="flex-1"
                icon={action.icon}
              >
                {action.label}
              </InteractiveButton>
            ))}
          </div>
        )}
      </div>

      {/* Auto-close indicator */}
      {autoClose && (
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            This page will automatically redirect in {Math.ceil(autoClose.delay / 1000)} seconds
          </p>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
            <div
              className="bg-primary-600 h-1 rounded-full transition-all linear"
              style={{
                width: '100%',
                animation: `shrink ${autoClose.delay}ms linear forwards`
              }}
            />
          </div>
        </div>
      )}

      {/* Success-specific styles */}
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

// Predefined success configurations
export const SuccessTemplates = {
  userRegistration: {
    title: 'Welcome to ezEMRx!',
    message: 'Your account has been created successfully.',
    details: [
      'Check your email for a verification link',
      'Complete your profile setup',
      'Start exploring the healthcare dashboard'
    ],
    primaryAction: {
      label: 'Go to Dashboard',
      icon: <ArrowRight className="h-5 w-5" />
    },
    showConfetti: true
  },

  patientRecord: {
    title: 'Patient Record Saved',
    message: 'The patient information has been successfully added to the system.',
    details: [
      'Record is now available in patient database',
      'Appointment scheduling is now enabled',
      'Clinical documentation can begin'
    ],
    primaryAction: {
      label: 'View Patient Chart',
      icon: <ArrowRight className="h-5 w-5" />
    },
    secondaryActions: [
      {
        label: 'Schedule Appointment',
        icon: <Plus className="h-5 w-5" />
      },
      {
        label: 'Add Another Patient',
        variant: 'ghost' as const
      }
    ]
  },

  appointmentBooked: {
    title: 'Appointment Scheduled',
    message: 'Your appointment has been successfully booked.',
    details: [
      'Confirmation email will be sent shortly',
      'Add to your calendar using the link provided',
      'You can reschedule up to 24 hours before the appointment'
    ],
    primaryAction: {
      label: 'Add to Calendar',
      icon: <Download className="h-5 w-5" />
    },
    secondaryActions: [
      {
        label: 'Share Details',
        icon: <Share2 className="h-5 w-5" />
      },
      {
        label: 'Book Another',
        variant: 'ghost' as const
      }
    ]
  },

  documentSubmitted: {
    title: 'Document Submitted',
    message: 'Your clinical documentation has been saved and submitted for review.',
    details: [
      'Document is now part of the permanent medical record',
      'Compliance check completed successfully',
      'Team members have been notified'
    ],
    primaryAction: {
      label: 'View Document',
      icon: <ArrowRight className="h-5 w-5" />
    },
    secondaryActions: [
      {
        label: 'Edit Document',
        icon: <Edit3 className="h-5 w-5" />
      }
    ]
  }
};

export default FormSuccess;