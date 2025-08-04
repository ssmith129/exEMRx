import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';

interface ContextualLink {
  text: string;
  href: string;
  external?: boolean;
  title?: string;
  keywords?: string[];
}

interface ContextualLinksProps {
  links: ContextualLink[];
  className?: string;
}

export const ContextualLinks: React.FC<ContextualLinksProps> = ({ links, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {links.map((link, index) => (
        link.external ? (
          <a
            key={index}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 transition-colors"
            title={link.title}
          >
            {link.text}
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        ) : (
          <Link
            key={index}
            to={link.href}
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 transition-colors"
            title={link.title}
          >
            {link.text}
            <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        )
      ))}
    </div>
  );
};

// Pre-defined contextual link sets for common scenarios
export const contextualLinkSets = {
  patientCare: [
    {
      text: 'WIC nutrition assessment guidelines',
      href: '/app/help#wic-guidelines',
      title: 'Learn about WIC program requirements and assessment procedures'
    },
    {
      text: 'pediatric growth chart standards',
      href: '/app/help#growth-charts',
      title: 'CDC and WHO growth chart interpretation guidelines'
    },
    {
      text: 'immunization schedule requirements',
      href: '/app/help#immunizations',
      title: 'Current CDC immunization schedule and requirements'
    }
  ],
  
  clinicalDocumentation: [
    {
      text: 'HIPAA compliance documentation standards',
      href: '/app/compliance',
      title: 'Review HIPAA requirements for clinical documentation'
    },
    {
      text: 'AI-assisted charting best practices',
      href: '/app/help#ai-charting',
      title: 'Guidelines for using AI suggestions in clinical documentation'
    },
    {
      text: 'clinical workflow optimization',
      href: '/app/reports',
      title: 'Analytics and insights for improving clinical workflows'
    }
  ],

  referralManagement: [
    {
      text: 'specialist provider network',
      href: '/app/referrals',
      title: 'Browse available specialists and referral options'
    },
    {
      text: 'referral tracking and follow-up',
      href: '/app/messages',
      title: 'Coordinate referral communications with healthcare team'
    },
    {
      text: 'patient care coordination protocols',
      href: '/app/help#care-coordination',
      title: 'Best practices for coordinating patient care across providers'
    }
  ]
};