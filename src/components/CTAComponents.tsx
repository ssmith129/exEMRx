import React, { useState } from 'react';
import { 
  ArrowRight, 
  Download, 
  Play, 
  Phone, 
  Mail, 
  Calendar,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
import { AnimatedButton } from './MicroInteractions';
import { useNotifications } from './NotificationSystem';

interface CTAButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  onClick?: () => void | Promise<void>;
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  href,
  icon,
  iconPosition = 'right',
  fullWidth = false,
  disabled = false,
  loading = false,
  className = ''
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl';
      case 'secondary':
        return 'bg-gray-600 text-white hover:bg-gray-700 shadow-lg hover:shadow-xl';
      case 'outline':
        return 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white';
      case 'ghost':
        return 'text-primary-600 hover:bg-primary-50';
      case 'gradient':
        return 'bg-gradient-to-r from-primary-600 to-blue-600 text-white hover:from-primary-700 hover:to-blue-700 shadow-lg hover:shadow-xl';
      default:
        return 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'px-4 py-2 text-sm';
      case 'md': return 'px-6 py-3 text-base';
      case 'lg': return 'px-8 py-4 text-lg';
      case 'xl': return 'px-10 py-5 text-xl';
      default: return 'px-6 py-3 text-base';
    }
  };

  const buttonClasses = `
    inline-flex items-center justify-center font-semibold rounded-lg
    transition-all duration-300 transform hover:scale-105 active:scale-95
    focus:outline-none focus:ring-4 focus:ring-primary-500 focus:ring-opacity-50
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  const content = (
    <>
      {icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
          {icon}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`group ${buttonClasses}`}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <AnimatedButton
      onClick={onClick}
      disabled={disabled}
      className={`group ${buttonClasses}`}
    >
      {content}
    </AnimatedButton>
  );
};

export const GetStartedCTA: React.FC = () => {
  const { addNotification } = useNotifications();

  const handleGetStarted = () => {
    addNotification({
      type: 'success',
      title: 'Welcome to ezEMRx!',
      message: 'Let\'s get you set up with your first patient record.',
      actions: [
        {
          label: 'Start Tour',
          onClick: () => console.log('Starting tour'),
          variant: 'primary'
        }
      ]
    });
  };

  return (
    <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl p-8 text-white">
      <div className="flex items-center space-x-3 mb-4">
        <Sparkles className="h-8 w-8" />
        <h2 className="text-2xl font-bold">Ready to Transform Your Practice?</h2>
      </div>
      <p className="text-lg mb-6 opacity-90">
        Join thousands of healthcare providers using AI-powered documentation to save time and improve patient care.
      </p>
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <CTAButton
          variant="secondary"
          size="lg"
          onClick={handleGetStarted}
          icon={<ArrowRight className="h-5 w-5" />}
        >
          Get Started Free
        </CTAButton>
        <CTAButton
          variant="outline"
          size="lg"
          icon={<Play className="h-5 w-5" />}
          iconPosition="left"
        >
          Watch Demo
        </CTAButton>
      </div>
    </div>
  );
};

export const ScheduleDemoCTA: React.FC = () => {
  const { addNotification } = useNotifications();

  const handleScheduleDemo = () => {
    addNotification({
      type: 'info',
      title: 'Demo Scheduled!',
      message: 'We\'ll contact you within 24 hours to schedule your personalized demo.',
      persistent: true,
      actions: [
        {
          label: 'View Calendar',
          onClick: () => window.location.href = '/appointments',
          variant: 'primary'
        }
      ]
    });
  };

  return (
    <div className="bg-white border-2 border-primary-200 rounded-xl p-6 hover:border-primary-300 transition-colors">
      <div className="flex items-center space-x-3 mb-4">
        <Calendar className="h-6 w-6 text-primary-600" />
        <h3 className="text-xl font-semibold text-gray-900">Schedule a Demo</h3>
      </div>
      <p className="text-gray-600 mb-4">
        See how ezEMRx can streamline your workflow with a personalized demonstration.
      </p>
      <CTAButton
        variant="primary"
        onClick={handleScheduleDemo}
        icon={<Calendar className="h-4 w-4" />}
        fullWidth
      >
        Book Your Demo
      </CTAButton>
    </div>
  );
};

export const ContactSalesCTA: React.FC = () => {
  const { addNotification } = useNotifications();

  const handleContactSales = () => {
    addNotification({
      type: 'success',
      title: 'Sales Team Notified',
      message: 'A sales representative will contact you within 2 hours.',
      actions: [
        {
          label: 'Call Now',
          onClick: () => window.open('tel:+1-555-123-4567'),
          variant: 'primary'
        }
      ]
    });
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <div className="flex items-center space-x-3 mb-4">
        <Phone className="h-6 w-6 text-green-600" />
        <h3 className="text-xl font-semibold text-gray-900">Talk to Sales</h3>
      </div>
      <p className="text-gray-600 mb-4">
        Have questions? Our sales team is ready to help you find the perfect solution.
      </p>
      <div className="flex space-x-3">
        <CTAButton
          variant="primary"
          onClick={handleContactSales}
          icon={<Phone className="h-4 w-4" />}
          iconPosition="left"
        >
          Call Sales
        </CTAButton>
        <CTAButton
          variant="outline"
          icon={<Mail className="h-4 w-4" />}
          iconPosition="left"
        >
          Email Us
        </CTAButton>
      </div>
    </div>
  );
};

export const DownloadResourceCTA: React.FC<{ title: string; description: string; fileName: string }> = ({
  title,
  description,
  fileName
}) => {
  const { addNotification } = useNotifications();

  const handleDownload = () => {
    // Simulate download
    addNotification({
      type: 'success',
      title: 'Download Started',
      message: `${fileName} is being downloaded to your device.`,
      actions: [
        {
          label: 'Open File',
          onClick: () => console.log('Opening file'),
          variant: 'primary'
        }
      ]
    });
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Download className="h-6 w-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <CTAButton
        variant="primary"
        onClick={handleDownload}
        icon={<Download className="h-4 w-4" />}
        iconPosition="left"
      >
        Download Now
      </CTAButton>
    </div>
  );
};

export const UpgradeCTA: React.FC = () => {
  const { addNotification } = useNotifications();

  const handleUpgrade = () => {
    addNotification({
      type: 'info',
      title: 'Upgrade Available',
      message: 'Unlock advanced AI features and priority support.',
      persistent: true,
      actions: [
        {
          label: 'View Plans',
         onClick: () => window.open('/pricing', '_blank'),
          variant: 'primary'
        },
        {
          label: 'Learn More',
         onClick: () => window.open('/features', '_blank'),
          variant: 'secondary'
        }
      ]
    });
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
      <div className="flex items-center space-x-3 mb-4">
        <Zap className="h-6 w-6" />
        <h3 className="text-xl font-semibold">Upgrade to Pro</h3>
      </div>
      <p className="mb-4 opacity-90">
        Get unlimited AI suggestions, advanced analytics, and priority support.
      </p>
      <div className="flex items-center space-x-4">
        <CTAButton
          variant="secondary"
          onClick={handleUpgrade}
          icon={<TrendingUp className="h-4 w-4" />}
        >
          Upgrade Now
        </CTAButton>
        <span className="text-sm opacity-75">Starting at $29/month</span>
      </div>
    </div>
  );
};

export const FeatureHighlightCTA: React.FC<{ 
  title: string; 
  description: string; 
  buttonText: string;
  onAction: () => void;
}> = ({ title, description, buttonText, onAction }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-3 mb-4">
        <Target className="h-6 w-6 text-primary-600" />
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <CTAButton
        variant="primary"
        onClick={onAction}
        icon={<ChevronRight className="h-4 w-4" />}
      >
        {buttonText}
      </CTAButton>
    </div>
  );
};

export const NewsletterCTA: React.FC = () => {
  const [email, setEmail] = useState('');
  const { addNotification } = useNotifications();

  const handleSubscribe = () => {
    if (!email) {
      addNotification({
        type: 'warning',
        title: 'Email Required',
        message: 'Please enter your email address to subscribe.'
      });
      return;
    }

    addNotification({
      type: 'success',
      title: 'Subscribed!',
      message: 'You\'ll receive our latest updates and healthcare insights.',
    });
    setEmail('');
  };

  return (
    <div className="bg-gray-900 text-white rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Mail className="h-6 w-6" />
        <h3 className="text-xl font-semibold">Stay Updated</h3>
      </div>
      <p className="mb-4 opacity-90">
        Get the latest healthcare technology insights and product updates.
      </p>
      <div className="flex space-x-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <CTAButton
          variant="primary"
          onClick={handleSubscribe}
          icon={<ArrowRight className="h-4 w-4" />}
        >
          Subscribe
        </CTAButton>
      </div>
    </div>
  );
};