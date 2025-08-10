import React from 'react';
import { Helmet } from 'react-helmet-async';
import EnhancedBreadcrumb from './EnhancedBreadcrumb';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  structuredData?: object;
}

interface PageHeaderProps {
  h1Title: string;
  subtitle?: string;
  breadcrumbs?: boolean;
  actions?: React.ReactNode;
}

interface SEOOptimizedLayoutProps {
  children: React.ReactNode;
  seo: SEOProps;
  pageHeader: PageHeaderProps;
  sidebar?: React.ReactNode;
  className?: string;
}

export default function SEOOptimizedLayout({
  children,
  seo,
  pageHeader,
  sidebar,
  className = ''
}: SEOOptimizedLayoutProps) {
  const { title, description, keywords = [], canonicalUrl, structuredData } = seo;
  const { h1Title, subtitle, breadcrumbs = true, actions } = pageHeader;

  return (
    <>
      <Helmet>
        <title>{title} | ezEMRx Healthcare EHR</title>
        <meta name="description" content={description} />
        {keywords.length > 0 && (
          <meta name="keywords" content={keywords.join(', ')} />
        )}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${title} | ezEMRx Healthcare EHR`} />
        <meta property="og:description" content={description} />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={`${title} | ezEMRx Healthcare EHR`} />
        <meta property="twitter:description" content={description} />
        
        {/* Healthcare-specific meta tags */}
        <meta name="robots" content="noindex, nofollow" /> {/* Private healthcare data */}
        <meta name="application-name" content="ezEMRx" />
        <meta name="apple-mobile-web-app-title" content="ezEMRx" />
        
        {structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )}
      </Helmet>

      <div className={`min-h-screen bg-gray-50 ${className}`}>
        {sidebar && (
          <aside className="fixed inset-y-0 left-0 z-40 w-80 bg-white shadow-lg border-r border-gray-200">
            {sidebar}
          </aside>
        )}
        
        <main className={`${sidebar ? 'ml-80' : ''} min-h-screen`}>
          <div className="p-6 max-w-7xl mx-auto">
            {breadcrumbs && <EnhancedBreadcrumb />}
            
            {/* Semantic page header with proper H1 */}
            <header className="mb-8">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
                    {h1Title}
                  </h1>
                  {subtitle && (
                    <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                      {subtitle}
                    </p>
                  )}
                </div>
                {actions && (
                  <div className="flex items-center space-x-3">
                    {actions}
                  </div>
                )}
              </div>
            </header>

            {/* Main content area */}
            <div className="space-y-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

// Utility component for proper content sections
interface ContentSectionProps {
  children: React.ReactNode;
  title?: string;
  headingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  description?: string;
  className?: string;
  id?: string;
}

export function ContentSection({
  children,
  title,
  headingLevel = 'h2',
  description,
  className = '',
  id
}: ContentSectionProps) {
  const HeadingTag = headingLevel;
  
  const headingStyles = {
    h2: 'text-2xl font-bold text-gray-900 mb-4',
    h3: 'text-xl font-semibold text-gray-900 mb-3',
    h4: 'text-lg font-semibold text-gray-900 mb-3',
    h5: 'text-base font-semibold text-gray-900 mb-2',
    h6: 'text-sm font-semibold text-gray-900 mb-2'
  };

  return (
    <section className={`space-y-6 ${className}`} id={id}>
      {title && (
        <header>
          <HeadingTag className={headingStyles[headingLevel]}>
            {title}
          </HeadingTag>
          {description && (
            <p className="text-gray-600 leading-relaxed">
              {description}
            </p>
          )}
        </header>
      )}
      {children}
    </section>
  );
}

// Hook for generating page-specific SEO data
export const useSEOData = (pageType: string, customData?: Partial<SEOProps>) => {
  const defaultSEOData: { [key: string]: SEOProps } = {
    dashboard: {
      title: 'Healthcare Dashboard',
      description: 'Comprehensive healthcare management dashboard with patient overview, clinical metrics, and system alerts for medical professionals.',
      keywords: ['healthcare dashboard', 'EHR dashboard', 'patient management', 'clinical overview', 'medical records'],
    },
    charting: {
      title: 'AI-Powered Smart Charting',
      description: 'Intelligent clinical documentation system with AI assistance for efficient patient charting and medical record management.',
      keywords: ['smart charting', 'AI charting', 'clinical documentation', 'patient notes', 'EHR charting'],
    },
    patients: {
      title: 'Patient Medical Records',
      description: 'Secure patient medical records management system with comprehensive health information and care coordination tools.',
      keywords: ['patient records', 'medical records', 'patient management', 'health information', 'care coordination'],
    },
    reports: {
      title: 'Healthcare Analytics & Reports',
      description: 'Advanced healthcare analytics and reporting tools for clinical performance monitoring and compliance management.',
      keywords: ['healthcare analytics', 'medical reports', 'clinical metrics', 'performance monitoring', 'compliance reporting'],
    },
    compliance: {
      title: 'Compliance Dashboard',
      description: 'Healthcare regulatory compliance monitoring dashboard with HIPAA, quality measures, and regulatory requirement tracking.',
      keywords: ['healthcare compliance', 'HIPAA compliance', 'regulatory compliance', 'quality measures', 'compliance monitoring'],
    }
  };

  const baseSEO = defaultSEOData[pageType] || defaultSEOData.dashboard;
  
  return {
    ...baseSEO,
    ...customData
  };
};
