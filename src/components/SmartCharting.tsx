import React, { useState } from 'react';
import { useNotifications } from './NotificationSystem';
import { AnimatedButton, FloatingActionButton } from './MicroInteractions';
import { 
  User, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Sparkles,
  Eye,
  Edit3,
  Save,
  X,
  RefreshCw,
  Download,
  Share2
} from 'lucide-react';
import AIPanel from './AIPanel';
import ComplianceAudit from './ComplianceAudit';
import InteractiveInput from './InteractiveInput';
import InteractiveButton from './InteractiveButton';
import ResponsiveCard from './ResponsiveCard';
import ActionPanel from './ActionPanel';

export default function SmartCharting() {
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [showComplianceAudit, setShowComplianceAudit] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    chiefComplaint: 'Routine WIC nutrition assessment and growth monitoring',
    height: '104 cm',
    weight: '16.2 kg',
    temperature: '98.6°F',
    bloodPressure: '95/60 mmHg',
    nutritionStatus: 'Good appetite, eating variety of foods',
    developmentalMilestones: 'Age-appropriate language and motor skills',
    immunizations: 'Up to date per CDC schedule',
    followUp: 'Return in 3 months for routine WIC visit'
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [formSuccess, setFormSuccess] = useState<{ [key: string]: boolean }>({});
  const [aiSuggestions] = useState({
    chiefComplaint: {
      confidence: 'high',
      source: 'Based on scheduled appointment type: WIC Nutrition Visit',
      suggestion: 'Routine WIC nutrition assessment and growth monitoring'
    },
    height: {
      confidence: 'medium',
      source: 'Growth chart prediction based on previous visits',
      suggestion: '104 cm (50th percentile for age)'
    },
    weight: {
      confidence: 'medium', 
      source: 'Growth trend analysis from last 6 months',
      suggestion: '16.2 kg (55th percentile for age)'
    },
    followUp: {
      confidence: 'high',
      source: 'WIC program guidelines',
      suggestion: 'Return in 3 months for routine WIC visit'
    }
  });

  const patientInfo = {
    name: 'Sofia Martinez',
    dob: '2020-03-15',
    age: '4 years 10 months',
    mrn: 'WIC-789012',
    visitType: 'WIC Nutrition Assessment',
    visitDate: 'January 15, 2025',
    provider: 'Maria Santos, RN'
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Auto-save after 2 seconds of inactivity
    clearTimeout((window as any).autoSaveTimeout);
    (window as any).autoSaveTimeout = setTimeout(() => {
      handleAutoSave();
    }, 2000);
  };

  const handleAutoSave = async () => {
    setIsAutoSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastSaved(new Date());
    setIsAutoSaving(false);
    
    addNotification({
      type: 'success',
      title: 'Auto-saved',
      message: 'Your changes have been automatically saved.',
      duration: 2000
    });
  };

  const handleAcceptSuggestion = (field: string) => {
    const suggestion = aiSuggestions[field as keyof typeof aiSuggestions];
    if (suggestion) {
      setFormData(prev => ({ ...prev, [field]: suggestion.suggestion }));
      setFormSuccess(prev => ({ ...prev, [field]: true }));
      setTimeout(() => {
        setFormSuccess(prev => ({ ...prev, [field]: false }));
      }, 2000);
      
      addNotification({
        type: 'info',
        title: 'AI Suggestion Applied',
        message: `AI suggestion has been applied to ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}.`,
        duration: 3000
      });
    }
  };

  const handleCompleteVisit = async () => {
    // Validate required fields
    const newErrors: { [key: string]: string } = {};
    if (!formData.chiefComplaint.trim()) {
      newErrors.chiefComplaint = 'Chief complaint is required';
    }
    if (!formData.height.trim()) {
      newErrors.height = 'Height measurement is required';
    }
    if (!formData.weight.trim()) {
      newErrors.weight = 'Weight measurement is required';
    }
    if (!formData.followUp.trim()) {
      newErrors.followUp = 'Follow-up instructions are required';
    }

    setFormErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      addNotification({
        type: 'success',
        title: 'Visit Completed',
        message: 'Patient visit has been successfully documented and saved.',
        persistent: true,
        actions: [
          {
            label: 'View Summary',
            onClick: () => console.log('View summary'),
            variant: 'primary'
          },
          {
            label: 'Schedule Follow-up',
            onClick: () => console.log('Schedule follow-up'),
            variant: 'secondary'
          }
        ]
      });
    }
  };

  const aiPanelActions = [
    {
      label: 'Refresh Analysis',
      icon: <RefreshCw className="h-4 w-4" />,
      onClick: async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    },
    {
      label: 'Export Report',
      icon: <Download className="h-4 w-4" />,
      onClick: () => console.log('Exporting AI report')
    }
  ];

  return (
    <div className="flex h-full bg-gray-50">
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${showAIPanel ? 'mr-96' : ''}`}>
        <div className="p-6 max-w-4xl mx-auto">
          {/* Patient Header */}
          <ResponsiveCard
            title={patientInfo.name}
            subtitle={`MRN: ${patientInfo.mrn}`}
            className="mb-6"
            actions={
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {patientInfo.visitDate}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {patientInfo.provider}
                </div>
              </div>
            }
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-primary-100 p-3 rounded-full">
                <User className="h-6 w-6 text-primary-600" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                <div>
                  <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                  <p className="text-sm text-gray-900">{patientInfo.dob}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Age</p>
                  <p className="text-sm text-gray-900">{patientInfo.age}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Visit Type</p>
                  <p className="text-sm text-gray-900">{patientInfo.visitType}</p>
                </div>
              </div>
            </div>
          </ResponsiveCard>

          {/* Form Sections */}
          <div className="space-y-6">
            {/* Assessment Section */}
            <ResponsiveCard title="Assessment" collapsible>
              <div className="space-y-6">
                <InteractiveInput
                  label="Chief Complaint"
                  type="textarea"
                  value={formData.chiefComplaint}
                  onChange={(value) => handleFieldChange('chiefComplaint', value)}
                  placeholder="Enter chief complaint..."
                  required
                  error={formErrors.chiefComplaint}
                  success={formSuccess.chiefComplaint}
                  aiSuggestion={aiSuggestions.chiefComplaint}
                  onAcceptSuggestion={() => handleAcceptSuggestion('chiefComplaint')}
                  rows={4}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InteractiveInput
                    label="Height"
                    value={formData.height}
                    onChange={(value) => handleFieldChange('height', value)}
                    placeholder="Enter height..."
                    required
                    error={formErrors.height}
                    success={formSuccess.height}
                    aiSuggestion={aiSuggestions.height}
                    onAcceptSuggestion={() => handleAcceptSuggestion('height')}
                  />
                  <InteractiveInput
                    label="Weight"
                    value={formData.weight}
                    onChange={(value) => handleFieldChange('weight', value)}
                    placeholder="Enter weight..."
                    required
                    error={formErrors.weight}
                    success={formSuccess.weight}
                    aiSuggestion={aiSuggestions.weight}
                    onAcceptSuggestion={() => handleAcceptSuggestion('weight')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InteractiveInput
                    label="Temperature"
                    value={formData.temperature}
                    onChange={(value) => handleFieldChange('temperature', value)}
                    placeholder="Enter temperature..."
                  />
                  <InteractiveInput
                    label="Blood Pressure"
                    value={formData.bloodPressure}
                    onChange={(value) => handleFieldChange('bloodPressure', value)}
                    placeholder="Enter blood pressure..."
                  />
                </div>
              </div>
            </ResponsiveCard>

            {/* Clinical Notes Section */}
            <ResponsiveCard title="Clinical Notes" collapsible>
              <div className="space-y-6">
                <InteractiveInput
                  label="Nutrition Status"
                  type="textarea"
                  value={formData.nutritionStatus}
                  onChange={(value) => handleFieldChange('nutritionStatus', value)}
                  placeholder="Enter nutrition status..."
                />
                <InteractiveInput
                  label="Developmental Milestones"
                  type="textarea"
                  value={formData.developmentalMilestones}
                  onChange={(value) => handleFieldChange('developmentalMilestones', value)}
                  placeholder="Enter developmental milestones..."
                />
                <InteractiveInput
                  label="Immunization Status"
                  type="textarea"
                  value={formData.immunizations}
                  onChange={(value) => handleFieldChange('immunizations', value)}
                  placeholder="Enter immunization status..."
                />
              </div>
            </ResponsiveCard>

            {/* Plan Section */}
            <ResponsiveCard title="Plan" collapsible>
              <div className="space-y-6">
                <InteractiveInput
                  label="Follow-up Instructions"
                  type="textarea"
                  value={formData.followUp}
                  onChange={(value) => handleFieldChange('followUp', value)}
                  placeholder="Enter follow-up instructions..."
                  required
                  error={formErrors.followUp}
                  success={formSuccess.followUp}
                  aiSuggestion={aiSuggestions.followUp}
                  onAcceptSuggestion={() => handleAcceptSuggestion('followUp')}
                />
              </div>
            </ResponsiveCard>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex space-x-3">
              <InteractiveButton
                variant={showAIPanel ? 'primary' : 'secondary'}
                onClick={() => setShowAIPanel(!showAIPanel)}
                icon={<Eye className="h-4 w-4" />}
              >
                AI Assistant
              </InteractiveButton>
              <InteractiveButton
                variant="secondary"
                onClick={() => setShowComplianceAudit(!showComplianceAudit)}
                icon={<CheckCircle className="h-4 w-4" />}
              >
                Compliance Check
              </InteractiveButton>
            </div>

            <div className="flex items-center space-x-4">
              {/* Auto-save indicator */}
              <div className="text-sm text-gray-500">
                {isAutoSaving ? (
                  <span className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
                )}
              </div>
              
              <div className="flex space-x-3">
              <InteractiveButton variant="secondary" icon={<Save className="h-4 w-4" />}>
                Save Draft
              </InteractiveButton>
              <AnimatedButton 
                variant="primary" 
                onClick={handleCompleteVisit}
                icon={<CheckCircle className="h-4 w-4" />}
                animation="glow"
              >
                Complete Visit
              </AnimatedButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Panel */}
      {showAIPanel && (
        <ActionPanel
          title="AI Assistant"
          onClose={() => setShowAIPanel(false)}
          position="right"
          size="lg"
          resizable
          collapsible
          actions={aiPanelActions}
        >
          <AIPanel onClose={() => setShowAIPanel(false)} />
        </ActionPanel>
      )}
      
      {/* Compliance Audit Modal */}
      {showComplianceAudit && (
        <ComplianceAudit onClose={() => setShowComplianceAudit(false)} />
      )}

      {/* Floating Action Buttons */}
      <FloatingActionButton
        icon={<Save className="h-6 w-6" />}
        onClick={handleAutoSave}
        position="bottom-left"
        tooltip="Quick Save"
        color="bg-green-600"
      />
    </div>
  );
}