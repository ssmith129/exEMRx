import React, { useState } from 'react';
import AIInsightDetails from './AIInsightDetails';
import { 
  X, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Info,
  ChevronRight,
  Brain,
  BarChart3
} from 'lucide-react';

interface AIPanelProps {
  onClose: () => void;
}

export default function AIPanel({ onClose }: AIPanelProps) {
  const [activeTab, setActiveTab] = useState('insights');
  const [selectedInsight, setSelectedInsight] = useState<any>(null);
  const [showInsightDetails, setShowInsightDetails] = useState(false);

  const insights = [
    {
      type: 'growth',
      title: 'Growth Pattern Analysis',
      confidence: 'high',
      content: 'Patient tracking above 50th percentile for both height and weight, consistent with healthy growth trajectory.',
      source: 'WHO Growth Charts, CDC Guidelines',
      recommendation: 'Continue current nutrition plan'
    },
    {
      type: 'nutrition',
      title: 'Nutritional Assessment',
      confidence: 'medium',
      content: 'Dietary intake appears adequate based on parent report. Consider discussing iron-rich foods.',
      source: 'WIC Nutrition Guidelines 2024',
      recommendation: 'Provide iron-rich food education materials'
    },
    {
      type: 'risk',
      title: 'Risk Factors',
      confidence: 'low',
      content: 'No significant risk factors identified. Family history shows no hereditary concerns.',
      source: 'Patient History, Previous Visits',
      recommendation: 'Continue routine monitoring'
    }
  ];

  const predictions = [
    {
      metric: 'Height at 5 years',
      prediction: '108-112 cm',
      confidence: 85,
      trend: 'stable'
    },
    {
      metric: 'Weight at 5 years', 
      prediction: '17.5-19.0 kg',
      confidence: 82,
      trend: 'increasing'
    },
    {
      metric: 'Next WIC eligibility',
      prediction: '24 months remaining',
      confidence: 95,
      trend: 'stable'
    }
  ];

  const handleInsightClick = (insight: any) => {
    setSelectedInsight(insight);
    setShowInsightDetails(true);
  };

  const handleCloseInsightDetails = () => {
    setShowInsightDetails(false);
    setSelectedInsight(null);
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'growth': return TrendingUp;
      case 'nutrition': return CheckCircle;
      case 'risk': return AlertTriangle;
      default: return Info;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 z-40 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="bg-primary-100 p-2 rounded-lg">
            <Brain className="h-5 w-5 text-primary-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'insights'
              ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Sparkles className="h-4 w-4 mr-2 inline" />
          Insights
        </button>
        <button
          onClick={() => setActiveTab('predictions')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'predictions'
              ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <BarChart3 className="h-4 w-4 mr-2 inline" />
          Predictions
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'insights' && (
          <div className="space-y-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                AI analysis based on patient data, clinical guidelines, and evidence-based recommendations.
              </p>
            </div>

            {insights.map((insight, index) => {
              const Icon = getIconForType(insight.type);
              return (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="bg-white p-2 rounded-lg">
                        <Icon className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900">{insight.title}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getConfidenceColor(insight.confidence)}`}>
                          {insight.confidence}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{insight.content}</p>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                        <p className="text-xs font-medium text-blue-800 mb-1">Recommendation:</p>
                        <p className="text-xs text-blue-700">{insight.recommendation}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">Source: {insight.source}</p>
                        <button className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center">
                          onClick={() => handleInsightClick(insight)}
                          Details <ChevronRight className="h-3 w-3 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'predictions' && (
          <div className="space-y-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Predictive analytics based on growth patterns and clinical data.
              </p>
            </div>

            {predictions.map((prediction, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900">{prediction.metric}</h3>
                  <span className="text-xs text-gray-500">{prediction.confidence}% confidence</span>
                </div>
                
                <div className="mb-3">
                  <p className="text-lg font-semibold text-gray-900">{prediction.prediction}</p>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Confidence Level</span>
                    <span className="text-xs text-gray-700">{prediction.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        prediction.confidence >= 85 ? 'bg-green-500' : 
                        prediction.confidence >= 70 ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${prediction.confidence}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500 capitalize">{prediction.trend} trend</span>
                  </div>
                  <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                    View Chart
                  </button>
                </div>
              </div>
            ))}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Model Information</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Predictions generated using WHO growth standards and population health data. 
                    Results should be interpreted alongside clinical judgment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Last updated: 2 min ago
          </div>
          <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
            Refresh Analysis
          </button>
        </div>
      </div>

      {/* Insight Details Modal */}
      {showInsightDetails && selectedInsight && (
        <AIInsightDetails
          insight={selectedInsight}
          onClose={handleCloseInsightDetails}
          onBack={handleCloseInsightDetails}
        />
      )}
    </div>
  );
}