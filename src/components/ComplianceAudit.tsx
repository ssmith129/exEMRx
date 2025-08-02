import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Download,
  FileText,
  Clock,
  ExternalLink
} from 'lucide-react';

interface ComplianceAuditProps {
  onClose: () => void;
}

export default function ComplianceAudit({ onClose }: ComplianceAuditProps) {
  const [selectedExport, setSelectedExport] = useState('pdf');

  const auditItems = [
    {
      id: 1,
      category: 'Patient Information',
      item: 'Demographics Complete',
      status: 'complete',
      required: true,
      fieldId: 'demographics',
      notes: 'All required demographic fields completed'
    },
    {
      id: 2,
      category: 'Clinical Assessment',
      item: 'Chief Complaint Documented',
      status: 'complete',
      required: true,
      fieldId: 'chiefComplaint',
      notes: 'AI-assisted documentation complete'
    },
    {
      id: 3,
      category: 'Clinical Assessment', 
      item: 'Vital Signs Recorded',
      status: 'complete',
      required: true,
      fieldId: 'vitals',
      notes: 'Height, weight, temperature documented'
    },
    {
      id: 4,
      category: 'WIC Requirements',
      item: 'Nutrition Assessment',
      status: 'warning',
      required: true,
      fieldId: 'nutritionStatus',
      notes: 'Consider adding more specific dietary details'
    },
    {
      id: 5,
      category: 'WIC Requirements',
      item: 'Growth Monitoring',
      status: 'complete',
      required: true,
      fieldId: 'growth',
      notes: 'Growth charts updated and within normal range'
    },
    {
      id: 6,
      category: 'Immunizations',
      item: 'Immunization Status',
      status: 'error',
      required: true, 
      fieldId: 'immunizations',
      notes: 'Missing MMR booster documentation'
    },
    {
      id: 7,
      category: 'Follow-up',
      item: 'Next Appointment Scheduled',
      status: 'complete',
      required: true,
      fieldId: 'followUp',
      notes: '3-month follow-up scheduled'
    },
    {
      id: 8,
      category: 'Documentation',
      item: 'Provider Signature',
      status: 'pending',
      required: true,
      fieldId: 'signature',
      notes: 'Electronic signature required before completion'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'text-green-800 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-800 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-800 bg-red-50 border-red-200';
      case 'pending':
        return 'text-gray-800 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-800 bg-gray-50 border-gray-200';
    }
  };

  const getStatusCounts = () => {
    const counts = auditItems.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    
    return {
      complete: counts.complete || 0,
      warning: counts.warning || 0,
      error: counts.error || 0,
      pending: counts.pending || 0,
      total: auditItems.length
    };
  };

  const statusCounts = getStatusCounts();
  const completionRate = Math.round((statusCounts.complete / statusCounts.total) * 100);

  const handleExport = () => {
    // Simulate export functionality
    console.log(`Exporting compliance report as ${selectedExport.toUpperCase()}`);
  };

  const jumpToField = (fieldId: string) => {
    // In a real implementation, this would scroll to the field
    console.log(`Jumping to field: ${fieldId}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Compliance Audit</h2>
            <p className="text-sm text-gray-600 mt-1">Sofia Martinez - WIC Nutrition Assessment</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Summary Stats */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{completionRate}%</div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{statusCounts.complete}</div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.warning}</div>
              <div className="text-sm text-gray-600">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{statusCounts.error}</div>
              <div className="text-sm text-gray-600">Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{statusCounts.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </div>

        {/* Audit Items */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {auditItems.map((item) => (
              <div 
                key={item.id}
                className={`border rounded-lg p-4 transition-colors hover:bg-gray-50 ${getStatusColor(item.status).includes('border-') ? getStatusColor(item.status) : 'border-gray-200'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(item.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm font-medium text-gray-900">{item.item}</h3>
                        {item.required && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                      <p className="text-sm text-gray-600">{item.notes}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {item.status !== 'complete' && (
                      <button
                        onClick={() => jumpToField(item.fieldId)}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center"
                      >
                        Go to field <ExternalLink className="h-3 w-3 ml-1" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Export Report:</span>
            </div>
            <select
              value={selectedExport}
              onChange={(e) => setSelectedExport(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="pdf">PDF Report</option>
              <option value="csv">CSV Data</option>
              <option value="xlsx">Excel Spreadsheet</option>
            </select>
            <button
              onClick={handleExport}
              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </button>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            {statusCounts.error === 0 && statusCounts.pending === 0 && (
              <button className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors">
                Mark as Compliant
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}