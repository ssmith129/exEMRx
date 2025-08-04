import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Users, BarChart3, MessageSquare } from 'lucide-react';

interface RelatedLink {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<any>;
  category: string;
}

interface RelatedContentProps {
  currentPage: string;
  patientId?: string;
  className?: string;
}

export default function RelatedContent({ currentPage, patientId, className = '' }: RelatedContentProps) {
  const getRelatedLinks = (page: string): RelatedLink[] => {
    const baseLinks: { [key: string]: RelatedLink[] } = {
      'dashboard': [
        {
          title: 'Start New Patient Documentation',
          description: 'Begin AI-assisted clinical charting for patient visits',
          href: '/app/charting',
          icon: FileText,
          category: 'Clinical Workflow'
        },
        {
          title: 'Create Specialist Referral',
          description: 'AI-powered referral matching and provider recommendations',
          href: '/app/referrals',
          icon: Users,
          category: 'Patient Care'
        },
        {
          title: 'View Healthcare Analytics',
          description: 'Comprehensive reports and compliance dashboards',
          href: '/app/reports',
          icon: BarChart3,
          category: 'Analytics'
        }
      ],
      'charting': [
        {
          title: 'Patient Referral System',
          description: 'Create referrals based on documentation findings',
          href: '/app/referrals',
          icon: Users,
          category: 'Next Steps'
        },
        {
          title: 'Clinical Case Notes',
          description: 'Add collaborative notes and team communication',
          href: '/app/notes',
          icon: MessageSquare,
          category: 'Collaboration'
        },
        {
          title: 'Compliance Dashboard',
          description: 'Verify documentation meets regulatory requirements',
          href: '/app/compliance',
          icon: BarChart3,
          category: 'Quality Assurance'
        }
      ],
      'referrals': [
        {
          title: 'Clinical Documentation',
          description: 'Document referral reasons with AI assistance',
          href: '/app/charting',
          icon: FileText,
          category: 'Documentation'
        },
        {
          title: 'Team Messages',
          description: 'Coordinate referral follow-up with healthcare team',
          href: '/app/messages',
          icon: MessageSquare,
          category: 'Communication'
        },
        {
          title: 'Referral Analytics',
          description: 'Track referral outcomes and provider performance',
          href: '/app/reports',
          icon: BarChart3,
          category: 'Analytics'
        }
      ],
      'reports': [
        {
          title: 'Clinical Charting',
          description: 'Review and update patient documentation',
          href: '/app/charting',
          icon: FileText,
          category: 'Clinical Tasks'
        },
        {
          title: 'Compliance Monitoring',
          description: 'Detailed compliance audits and corrections',
          href: '/app/compliance',
          icon: Users,
          category: 'Quality Control'
        }
      ]
    };

    return baseLinks[page] || [];
  };

  const relatedLinks = getRelatedLinks(currentPage);

  if (relatedLinks.length === 0) return null;

  return (
    <div className={`bg-white rounded-xl shadow-soft border border-gray-100 p-6 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <ArrowRight className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">Related Healthcare Tasks</h3>
      </div>
      
      <div className="space-y-4">
        {relatedLinks.map((link, index) => {
          const Icon = link.icon;
          return (
            <Link
              key={index}
              to={link.href}
              className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all duration-200 group"
              title={`Navigate to ${link.title}`}
            >
              <div className="flex items-start space-x-3">
                <div className="bg-primary-100 p-2 rounded-lg group-hover:bg-primary-200 transition-colors">
                  <Icon className="h-4 w-4 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-700">
                      {link.title}
                    </h4>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {link.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {link.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}