import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const location = useLocation();

  // Auto-generate breadcrumbs from current path if no items provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', href: '/app/dashboard' }
    ];

    const routeMap: { [key: string]: string } = {
      'charting': 'AI-Powered Smart Charting',
      'referrals': 'Patient Referral Management',
      'notes': 'Clinical Case Notes',
      'reports': 'Healthcare Analytics & Reports',
      'messages': 'Secure Message Center',
      'settings': 'System Settings & Configuration',
      'compliance': 'Compliance Dashboard',
      'appointments': 'Appointment Scheduling',
      'help': 'Help & Support Center',
      'patient': 'Patient Medical Records'
    };

    if (pathSegments.length > 1) {
      pathSegments.slice(1).forEach((segment, index) => {
        const isLast = index === pathSegments.length - 2;
        const path = '/' + pathSegments.slice(0, index + 2).join('/');
        
        breadcrumbs.push({
          label: routeMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
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

  return (
    <nav 
      className={`flex items-center space-x-2 text-sm text-gray-600 mb-6 ${className}`}
      aria-label="Breadcrumb navigation"
    >
      <Link 
        to="/app/dashboard" 
        className="flex items-center hover:text-primary-600 transition-colors"
        aria-label="Navigate to healthcare dashboard"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Home</span>
      </Link>
      
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4 text-gray-400" aria-hidden="true" />
          {item.current || !item.href ? (
            <span 
              className="font-medium text-gray-900"
              aria-current="page"
            >
              {item.label}
            </span>
          ) : (
            <Link 
              to={item.href}
              className="hover:text-primary-600 transition-colors"
              title={`Navigate to ${item.label}`}
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}