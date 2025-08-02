import React, { useState } from 'react';
import { 
  X, 
  TrendingUp, 
  BarChart3, 
  FileText, 
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  Info,
  CheckCircle,
  AlertTriangle,
  Calendar,
  User,
  Activity
} from 'lucide-react';
import InteractiveButton from './InteractiveButton';
import ResponsiveCard from './ResponsiveCard';

interface AIInsightDetailsProps {
  insight: {
    type: string;
    title: string;
    confidence: string;
    content: string;
    source: string;
    recommendation: string;
  };
  onClose: () => void;
  onBack: () => void;
}

export default function AIInsightDetails({ insight, onClose, onBack }: AIInsightDetailsProps) {
  const [activeTab, setActiveTab] = useState('analysis');
  const [showExportOptions, setShowExportOptions] = useState(false);

  const detailedAnalysis = {
    'Growth Pattern Analysis': {
      dataPoints: [
        { date: '2024-10-15', height: '102 cm', weight: '15.8 kg', percentile: '48th' },
        { date: '2024-07-15', height: '100 cm', weight: '15.2 kg', percentile: '45th' },
        { date: '2024-04-15', height: '98 cm', weight: '14.6 kg', percentile: '47th' },
        { date: '2024-01-15', height: '96 cm', weight: '14.0 kg', percentile: '46th' }
      ],
      trends: [
        'Consistent growth velocity of 2cm per 3 months',
        'Weight gain appropriate for height increase',
        'Maintaining 45-50th percentile range consistently'
      ],
      riskFactors: [
        'No concerning growth deceleration',
        'Family history shows normal growth patterns',
        'Nutritional intake appears adequate'
      ]
    }
  };

  const recommendations = [
    {
      priority: 'high',
      action: 'Continue current nutrition plan',
      timeline: 'Ongoing',
      responsible: 'WIC Nutritionist',
      status: 'pending'
    },
    {
      priority: 'medium',
      action: 'Schedule 3-month follow-up',
      timeline: 'April 2025',
      responsible: 'Primary Care Provider',
      status: 'scheduled'
    },
    {
      priority: 'low',
      action: 'Consider growth hormone screening if deceleration occurs',
      timeline: 'If needed',
      responsible: 'Pediatric Endocrinologist',
      status: 'conditional'
    }
  ];

  const evidenceBase = [
    {
      source: 'WHO Growth Standards 2006',
      relevance: 'Primary reference for growth percentiles',
      confidence: 'high',
      lastUpdated: '2024-01-01'
    },
    {
      source: 'CDC Growth Charts',
      relevance: 'US population reference data',
      confidence: 'high',
      lastUpdated: '2023-12-15'
    },
    {
      source: 'WIC Nutrition Guidelines 2024',
      relevance: 'Program-specific recommendations',
      confidence: 'medium',
      lastUpdated: '2024-01-15'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'scheduled': return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleExport = (format: string) => {
    console.log(`Exporting insight as ${format}`);
    setShowExportOptions(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <InteractiveButton
              variant="ghost"
              size="sm"
              onClick={onBack}
              icon={<ChevronLeft className="h-4 w-4" />}
            >
              Back
            </InteractiveButton>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{insight.title}</h2>
              <p className="text-sm text-gray-600">Detailed Analysis & Recommendations</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <InteractiveButton
                variant="secondary"
                size="sm"
                onClick={() => setShowExportOptions(!showExportOptions)}
                icon={<Download className="h-4 w-4" />}
              >
                Export
              </InteractiveButton>
              {showExportOptions && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="py-2">
                    <button
                      onClick={() => handleExport('pdf')}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    >
                      <FileText className="h-4 w-4 inline mr-2" />
                      PDF Report
                    </button>
                    <button
                      onClick={() => handleExport('csv')}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                    >
                      <BarChart3 className="h-4 w-4 inline mr-2" />
                      CSV Data
                    </button>
                  </div>
                </div>
              )}
            </div>
            <InteractiveButton
              variant="secondary"
              size="sm"
              icon={<Share2 className="h-4 w-4" />}
            >
              Share
            </InteractiveButton>
            <InteractiveButton
              variant="ghost"
              size="sm"
              onClick={onClose}
              icon={<X className="h-4 w-4" />}
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'analysis'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Activity className="h-4 w-4 mr-2 inline" />
            Analysis
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'recommendations'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <CheckCircle className="h-4 w-4 mr-2 inline" />
            Recommendations
          </button>
          <button
            onClick={() => setActiveTab('evidence')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'evidence'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="h-4 w-4 mr-2 inline" />
            Evidence Base
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'analysis' && (
            <div className="space-y-6">
              <ResponsiveCard title="Growth Data Points">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2">Date</th>
                        <th className="text-left py-2">Height</th>
                        <th className="text-left py-2">Weight</th>
                        <th className="text-left py-2">Percentile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailedAnalysis['Growth Pattern Analysis'].dataPoints.map((point, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-2">{point.date}</td>
                          <td className="py-2">{point.height}</td>
                          <td className="py-2">{point.weight}</td>
                          <td className="py-2">{point.percentile}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ResponsiveCard>

              <ResponsiveCard title="Growth Trends">
                <ul className="space-y-2">
                  {detailedAnalysis['Growth Pattern Analysis'].trends.map((trend, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{trend}</span>
                    </li>
                  ))}
                </ul>
              </ResponsiveCard>

              <ResponsiveCard title="Risk Assessment">
                <ul className="space-y-2">
                  {detailedAnalysis['Growth Pattern Analysis'].riskFactors.map((factor, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{factor}</span>
                    </li>
                  ))}
                </ul>
              </ResponsiveCard>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <ResponsiveCard key={index} title={rec.action}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                        {rec.priority} priority
                      </span>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(rec.status)}
                        <span className="text-sm text-gray-600 capitalize">{rec.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Timeline</p>
                      <p className="text-sm text-gray-900">{rec.timeline}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Responsible</p>
                      <p className="text-sm text-gray-900">{rec.responsible}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <InteractiveButton variant="primary" size="sm">
                      Implement
                    </InteractiveButton>
                    <InteractiveButton variant="secondary" size="sm">
                      Schedule
                    </InteractiveButton>
                  </div>
                </ResponsiveCard>
              ))}
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="space-y-4">
              {evidenceBase.map((evidence, index) => (
                <ResponsiveCard key={index} title={evidence.source}>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700">{evidence.relevance}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                          evidence.confidence === 'high' 
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }`}>
                          {evidence.confidence} confidence
                        </span>
                        <span className="text-xs text-gray-500">
                          Updated: {evidence.lastUpdated}
                        </span>
                      </div>
                      <InteractiveButton variant="ghost" size="sm">
                        View Source
                      </InteractiveButton>
                    </div>
                  </div>
                </ResponsiveCard>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Analysis generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </div>
            <div className="flex space-x-3">
              <InteractiveButton variant="secondary" onClick={onClose}>
                Close
              </InteractiveButton>
              <InteractiveButton variant="primary">
                Apply Recommendations
              </InteractiveButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}