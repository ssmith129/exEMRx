import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, ClipboardCheck, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import SEOOptimizedLayout, { ContentSection, useSEOData } from './SEOOptimizedLayout';
import { useAlerts, AlertSystem, AlertTemplates } from './AlertSystem';
import { useInternalLinks } from './EnhancedBreadcrumb';
import ContentOptimizer from './ContentOptimizer';

export default function OptimizedDashboard() {
  const { alerts, addAlert, dismissAlert, handleAction } = useAlerts();
  const { relatedLinks } = useInternalLinks();
  const alertsInitialized = useRef(false);

  // Initialize sample alerts
  React.useEffect(() => {
    if (!alertsInitialized.current) {
      addAlert(AlertTemplates.patientOverdue('Maria Rodriguez', 5));
      addAlert(AlertTemplates.complianceIssue('Missing immunization records for 3 patients'));
      addAlert(AlertTemplates.systemMaintenance('Tonight at 11 PM', '2 hours'));
      alertsInitialized.current = true;
    }
  }, [addAlert]);

  // SEO data for dashboard
  const seoData = useSEOData('dashboard', {
    description: 'Comprehensive healthcare management dashboard for medical professionals. Track patient care, clinical metrics, and compliance in one secure platform.',
    keywords: ['healthcare dashboard', 'EHR system', 'patient management', 'clinical metrics', 'medical records dashboard']
  });

  // Optimized content for better readability
  const welcomeContent = "Welcome back, Dr. Chen. Your clinic is running smoothly today. You've seen 24 patients and have 3 upcoming appointments. All critical alerts have been addressed.";

  const stats = [
    {
      name: 'Patients Seen Today',
      value: '24',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      href: '/app/patients',
      description: 'View all patient records and manage care plans'
    },
    {
      name: 'Scheduled Appointments',
      value: '8',
      change: '+3',
      changeType: 'positive' as const,
      icon: Calendar,
      href: '/app/appointments',
      description: 'Manage patient appointments and scheduling'
    },
    {
      name: 'Compliance Score',
      value: '94%',
      change: '+2%',
      changeType: 'positive' as const,
      icon: ClipboardCheck,
      href: '/app/compliance',
      description: 'Monitor healthcare regulatory compliance'
    },
    {
      name: 'Performance Rating',
      value: '4.8',
      change: '+0.2',
      changeType: 'positive' as const,
      icon: TrendingUp,
      href: '/app/reports',
      description: 'View detailed performance analytics and reports'
    }
  ];

  const quickActions = [
    {
      title: 'New Patient Chart',
      description: 'Start documenting a new patient visit',
      icon: Users,
      href: '/app/charting',
      color: 'bg-primary-600'
    },
    {
      title: 'Schedule Appointment',
      description: 'Book patient appointments quickly',
      icon: Calendar,
      href: '/app/appointments',
      color: 'bg-green-600'
    },
    {
      title: 'View Reports',
      description: 'Access clinical performance data',
      icon: TrendingUp,
      href: '/app/reports',
      color: 'bg-blue-600'
    }
  ];

  return (
    <SEOOptimizedLayout
      seo={seoData}
      pageHeader={{
        h1Title: 'Healthcare Dashboard',
        subtitle: welcomeContent,
        actions: (
          <Link
            to="/app/charting"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Start new patient chart documentation"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chart
          </Link>
        )
      }}
    >
      {/* Key Performance Metrics */}
      <ContentSection
        title="Today's Performance Overview"
        headingLevel="h2"
        description="Real-time metrics showing your clinic's daily performance and patient care statistics."
        id="performance-metrics"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.name}
                to={stat.href}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label={`View ${stat.name} details - ${stat.description}`}
                title={stat.description}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs yesterday</span>
                    </div>
                  </div>
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <Icon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </ContentSection>

      {/* System Alerts */}
      <ContentSection
        title="System Alerts & Notifications"
        headingLevel="h2"
        description="Important alerts requiring your attention for optimal patient care and compliance."
        id="system-alerts"
      >
        <AlertSystem
          alerts={alerts}
          onDismiss={dismissAlert}
          onAction={handleAction}
        />
      </ContentSection>

      {/* Quick Actions */}
      <ContentSection
        title="Quick Actions"
        headingLevel="h2"
        description="Fast access to commonly used features and patient management tools."
        id="quick-actions"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                to={action.href}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label={`${action.title} - ${action.description}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 ${action.color} rounded-lg group-hover:scale-105 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </ContentSection>

      {/* Related Links Section */}
      {relatedLinks.length > 0 && (
        <ContentSection
          title="Related Healthcare Tools"
          headingLevel="h2"
          description="Additional features and tools to enhance your patient care workflow."
          id="related-tools"
        >
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  title={link.context}
                >
                  <ArrowRight className="h-4 w-4 text-primary-600 flex-shrink-0" />
                  <div>
                    <span className="text-primary-600 font-medium">{link.text}</span>
                    <p className="text-sm text-gray-600">{link.context}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </ContentSection>
      )}

      {/* Content Optimization Demo */}
      <ContentSection
        title="Content Readability Analysis"
        headingLevel="h2"
        description="Example of content optimization for better user experience and accessibility."
        id="content-optimization"
      >
        <ContentOptimizer
          content="The comprehensive healthcare analytics dashboard provides detailed insights into clinic operations and patient outcomes through advanced data visualization and reporting capabilities that enable medical professionals to monitor performance metrics efficiently."
          targetAudience="medical_professional"
          showMetrics={true}
        />
      </ContentSection>

      {/* Structured Data for Healthcare Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalOrganization",
          "name": "ezEMRx Healthcare System",
          "description": "AI-powered Electronic Health Record system for healthcare providers",
          "url": window.location.origin,
          "sameAs": [
            "https://www.facebook.com/ezemrx",
            "https://www.linkedin.com/company/ezemrx"
          ],
          "medicalSpecialty": [
            "Primary Care",
            "Family Medicine",
            "Internal Medicine"
          ],
          "availableService": [
            {
              "@type": "MedicalService",
              "name": "Electronic Health Records",
              "description": "Comprehensive EHR system with AI-powered features"
            },
            {
              "@type": "MedicalService", 
              "name": "Patient Management",
              "description": "Complete patient care coordination and management"
            }
          ]
        })}
      </script>
    </SEOOptimizedLayout>
  );
}

// Export utility functions for other components
export { useSEOData } from './SEOOptimizedLayout';
export { useInternalLinks } from './EnhancedBreadcrumb';
