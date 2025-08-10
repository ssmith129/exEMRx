import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
  description?: string;
}

interface EnhancedBreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
  showStructuredData?: boolean;
}

export default function EnhancedBreadcrumb({ 
  items, 
  className = '', 
  showStructuredData = true 
}: EnhancedBreadcrumbProps) {
  const location = useLocation();

  // Enhanced route mapping with SEO-friendly labels
  const routeMap: { [key: string]: { label: string; description: string } } = {
    'dashboard': { 
      label: 'Healthcare Dashboard', 
      description: 'Clinical overview and patient management dashboard' 
    },
    'charting': { 
      label: 'AI-Powered Smart Charting', 
      description: 'Intelligent clinical documentation system' 
    },
    'referrals': { 
      label: 'Patient Referral Management', 
      description: 'Specialist referral coordination platform' 
    },
    'notes': { 
      label: 'Clinical Case Notes', 
      description: 'Comprehensive patient case documentation' 
    },
    'reports': { 
      label: 'Healthcare Analytics & Reports', 
      description: 'Clinical performance and compliance analytics' 
    },
    'messages': { 
      label: 'Secure Message Center', 
      description: 'HIPAA-compliant healthcare communication' 
    },
    'settings': { 
      label: 'System Settings & Configuration', 
      description: 'EHR system configuration and preferences' 
    },
    'compliance': { 
      label: 'Compliance Dashboard', 
      description: 'Healthcare regulatory compliance monitoring' 
    },
    'appointments': { 
      label: 'Appointment Scheduling', 
      description: 'Patient appointment management system' 
    },
    'help': { 
      label: 'Help & Support Center', 
      description: 'EHR system documentation and support' 
    },
    'patients': { 
      label: 'Patient Medical Records', 
      description: 'Comprehensive patient health information' 
    }
  };

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { 
        label: 'Healthcare Dashboard', 
        href: '/app/dashboard',
        description: 'Main healthcare management dashboard'
      }
    ];

    if (pathSegments.length > 1) {
      pathSegments.slice(1).forEach((segment, index) => {
        const isLast = index === pathSegments.length - 2;
        const path = '/' + pathSegments.slice(0, index + 2).join('/');
        const routeInfo = routeMap[segment];
        
        breadcrumbs.push({
          label: routeInfo?.label || segment.charAt(0).toUpperCase() + segment.slice(1),
          description: routeInfo?.description,
          href: isLast ? undefined : path,
          current: isLast
        });
      });
    } else if (location.pathname === '/app/dashboard') {
      breadcrumbs[0].current = true;
      breadcrumbs[0].href = undefined;
    }

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.href ? `${window.location.origin}${item.href}` : window.location.href
    }))
  };

  return (
    <>
      {showStructuredData && (
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      
      <nav 
        className={`flex items-center space-x-2 text-sm text-gray-600 mb-6 ${className}`}
        aria-label="Breadcrumb navigation for healthcare EHR system"
        role="navigation"
      >
        <Link 
          to="/app/dashboard" 
          className="flex items-center hover:text-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md p-1"
          aria-label="Navigate to healthcare dashboard home"
          title="Return to main healthcare dashboard"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Healthcare Dashboard Home</span>
        </Link>
        
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={`${item.label}-${index}`}>
            <ChevronRight 
              className="h-4 w-4 text-gray-400" 
              aria-hidden="true" 
            />
            {item.current || !item.href ? (
              <span 
                className="font-medium text-gray-900"
                aria-current="page"
                title={item.description}
              >
                {item.label}
              </span>
            ) : (
              <Link 
                to={item.href}
                className="hover:text-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md px-1 py-0.5"
                title={item.description || `Navigate to ${item.label}`}
                aria-label={`Navigate to ${item.label} - ${item.description}`}
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>
    </>
  );
}

// Hook for internal linking suggestions
export const useInternalLinks = () => {
  const location = useLocation();

  const getRelatedLinks = (currentPath: string) => {
    const linkSuggestions: { [key: string]: Array<{ href: string; text: string; context: string }> } = {
      '/app/dashboard': [
        { href: '/app/charting', text: 'AI-powered charting system', context: 'Start documenting patient visits' },
        { href: '/app/patients', text: 'patient management', context: 'View and manage patient records' },
        { href: '/app/reports', text: 'healthcare analytics', context: 'Review clinic performance metrics' },
        { href: '/app/compliance', text: 'compliance monitoring', context: 'Check regulatory compliance status' }
      ],
      '/app/charting': [
        { href: '/app/patients', text: 'patient records', context: 'Access complete patient history' },
        { href: '/app/referrals', text: 'specialist referrals', context: 'Refer patients to specialists' },
        { href: '/app/notes', text: 'clinical notes', context: 'Review previous documentation' }
      ],
      '/app/patients': [
        { href: '/app/charting', text: 'clinical documentation', context: 'Document patient encounters' },
        { href: '/app/appointments', text: 'appointment scheduling', context: 'Schedule follow-up visits' },
        { href: '/app/messages', text: 'secure messaging', context: 'Communicate with patients' }
      ]
    };

    return linkSuggestions[currentPath] || [];
  };

  return {
    relatedLinks: getRelatedLinks(location.pathname),
    currentPath: location.pathname
  };
};
