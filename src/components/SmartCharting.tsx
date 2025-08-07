import React, { useState } from 'react';
import Breadcrumb from './Breadcrumb';
import RelatedContent from './RelatedContent';
import { useNotifications } from './NotificationSystem';
import { AnimatedButton, FloatingActionButton } from './MicroInteractions';
import { useFormValidation } from '../hooks/useFormValidation';
import { createValidationRules } from '../utils/validation';
import FormSuccess, { SuccessTemplates } from './FormSuccess';
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
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const { addNotification } = useNotifications();
  
  const initialFormData = {
    chiefComplaint: 'Routine WIC nutrition assessment and growth monitoring',
    height: '104 cm',
    weight: '16.2 kg',
    temperature: '98.6°F',
    bloodPressure: '95/60 mmHg',
    nutritionStatus: 'Good appetite, eating variety of foods',
    developmentalMilestones: 'Age-appropriate language and motor skills',
    immunizations: 'Up to date per CDC schedule',
    followUp: 'Return in 3 months for routine WIC visit'
  };

  const {
    fields,
    handleFieldChange,
    handleFieldBlur,
    handleSubmit,
    resetForm,
    isSubmitting,
    submitError,
    submitSuccess,
    isFormValid,
    hasErrors,
    isTouched
  } = useFormValidation({
    initialValues: initialFormData,
    validationRules: {
      chiefComplaint: createValidationRules.required('Chief complaint'),
      height: {
        required: true,
        custom: (value: string) => {
          if (!value.trim()) return 'Height is required';
          if (!/^\d+(\.\d+)?\s*(cm|in)$/i.test(value.trim())) {
            return 'Please enter height in format "104 cm" or "41 in"';
          }
          return null;
        }
      },
      weight: {
        required: true,
        custom: (value: string) => {
          if (!value.trim()) return 'Weight is required';
          if (!/^\d+(\.\d+)?\s*(kg|lb)$/i.test(value.trim())) {
            return 'Please enter weight in format "16.2 kg" or "35.7 lb"';
          }
          return null;
        }
      },
      temperature: createValidationRules.text(undefined, undefined, false),
      bloodPressure: createValidationRules.text(undefined, undefined, false),
      nutritionStatus: createValidationRules.text(10, 500, false),
      developmentalMilestones: createValidationRules.text(10, 500, false),
      immunizations: createValidationRules.text(5, 200, false),
      followUp: createValidationRules.required('Follow-up instructions')
    },
    validationTiming: 'smart'
  });
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

  if (showSuccessScreen) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <FormSuccess
          {...SuccessTemplates.documentSubmitted}
          submittedData={{
            patient: patientInfo.name,
            visitType: patientInfo.visitType,
            provider: patientInfo.provider,
            completedAt: new Date().toLocaleString()
          }}
          primaryAction={{
            ...SuccessTemplates.documentSubmitted.primaryAction,
            onClick: () => setShowSuccessScreen(false)
          }}
          secondaryActions={[
            {
              label: 'New Patient Visit',
              onClick: () => {
                resetForm();
                setShowSuccessScreen(false);
              }
            },
            {
              label: 'View Dashboard',
              onClick: () => window.location.href = '/app/dashboard',
              variant: 'ghost' as const
            }
          ]}
        />
      </div>
    );
  }

  const handleAcceptSuggestion = (field: string) => {
    const suggestion = aiSuggestions[field as keyof typeof aiSuggestions];
    if (suggestion) {
      handleFieldChange(field, suggestion.suggestion);
    }
  };

  const handleCompleteVisit = async (values: { [key: string]: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setShowSuccessScreen(true);
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
        <div className="p-6 max-w-6xl mx-auto">
          {/* Breadcrumb Navigation */}
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Patient Chart - Overview</h1>
            <p className="text-gray-600 mt-2">AI-powered clinical documentation for {patientInfo.name}</p>
          </div>

          {/* Patient Header */}
          <ResponsiveCard
            title={`Patient: ${patientInfo.name}`}
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
                  value={fields.chiefComplaint?.value || ''}
                  onChange={(value) => handleFieldChange('chiefComplaint', value)}
                  onBlur={() => handleFieldBlur('chiefComplaint')}
                  placeholder="Enter chief complaint..."
                  required
                  error={fields.chiefComplaint?.touched ? fields.chiefComplaint?.error || undefined : undefined}
                  success={fields.chiefComplaint?.valid && fields.chiefComplaint?.touched}
                  validating={fields.chiefComplaint?.validating}
                  aiSuggestion={aiSuggestions.chiefComplaint}
                  onAcceptSuggestion={() => handleAcceptSuggestion('chiefComplaint')}
                  rows={4}
                  helpText="Describe the reason for today's visit"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InteractiveInput
                    label="Height"
                    value={fields.height?.value || ''}
                    onChange={(value) => handleFieldChange('height', value)}
                    onBlur={() => handleFieldBlur('height')}
                    placeholder="Enter height..."
                    required
                    error={fields.height?.touched ? fields.height?.error || undefined : undefined}
                    success={fields.height?.valid && fields.height?.touched}
                    validating={fields.height?.validating}
                    aiSuggestion={aiSuggestions.height}
                    onAcceptSuggestion={() => handleAcceptSuggestion('height')}
                    helpText="Include units (e.g., 104 cm)"
                  />
                  <InteractiveInput
                    label="Weight"
                    value={fields.weight?.value || ''}
                    onChange={(value) => handleFieldChange('weight', value)}
                    onBlur={() => handleFieldBlur('weight')}
                    placeholder="Enter weight..."
                    required
                    error={fields.weight?.touched ? fields.weight?.error || undefined : undefined}
                    success={fields.weight?.valid && fields.weight?.touched}
                    validating={fields.weight?.validating}
                    aiSuggestion={aiSuggestions.weight}
                    onAcceptSuggestion={() => handleAcceptSuggestion('weight')}
                    helpText="Include units (e.g., 16.2 kg)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InteractiveInput
                    label="Temperature"
                    value={fields.temperature?.value || ''}
                    onChange={(value) => handleFieldChange('temperature', value)}
                    onBlur={() => handleFieldBlur('temperature')}
                    placeholder="Enter temperature..."
                    validating={fields.temperature?.validating}
                    helpText="Optional vital sign measurement"
                  />
                  <InteractiveInput
                    label="Blood Pressure"
                    value={fields.bloodPressure?.value || ''}
                    onChange={(value) => handleFieldChange('bloodPressure', value)}
                    onBlur={() => handleFieldBlur('bloodPressure')}
                    placeholder="Enter blood pressure..."
                    validating={fields.bloodPressure?.validating}
                    helpText="Optional vital sign measurement"
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
                  value={fields.nutritionStatus?.value || ''}
                  onChange={(value) => handleFieldChange('nutritionStatus', value)}
                  onBlur={() => handleFieldBlur('nutritionStatus')}
                  placeholder="Enter nutrition status..."
                  validating={fields.nutritionStatus?.validating}
                  showCharacterCount
                  maxLength={500}
                  helpText="Document current nutritional intake and status"
                />
                <InteractiveInput
                  label="Developmental Milestones"
                  type="textarea"
                  value={fields.developmentalMilestones?.value || ''}
                  onChange={(value) => handleFieldChange('developmentalMilestones', value)}
                  onBlur={() => handleFieldBlur('developmentalMilestones')}
                  placeholder="Enter developmental milestones..."
                  validating={fields.developmentalMilestones?.validating}
                  showCharacterCount
                  maxLength={500}
                  helpText="Age-appropriate developmental progress"
                />
                <InteractiveInput
                  label="Immunization Status"
                  type="textarea"
                  value={fields.immunizations?.value || ''}
                  onChange={(value) => handleFieldChange('immunizations', value)}
                  onBlur={() => handleFieldBlur('immunizations')}
                  placeholder="Enter immunization status..."
                  validating={fields.immunizations?.validating}
                  showCharacterCount
                  maxLength={200}
                  helpText="Current immunization status and updates"
                />
              </div>
            </ResponsiveCard>

            {/* Plan Section */}
            <ResponsiveCard title="Plan" collapsible>
              <div className="space-y-6">
                <InteractiveInput
                  label="Follow-up Instructions"
                  type="textarea"
                  value={fields.followUp?.value || ''}
                  onChange={(value) => handleFieldChange('followUp', value)}
                  onBlur={() => handleFieldBlur('followUp')}
                  placeholder="Enter follow-up instructions..."
                  required
                  error={fields.followUp?.touched ? fields.followUp?.error || undefined : undefined}
                  success={fields.followUp?.valid && fields.followUp?.touched}
                  validating={fields.followUp?.validating}
                  aiSuggestion={aiSuggestions.followUp}
                  onAcceptSuggestion={() => handleAcceptSuggestion('followUp')}
                  helpText="Required next steps and follow-up plan"
                />
              </div>
            </ResponsiveCard>
          </div>

          {/* Form Status Bar */}
          {(hasErrors || !isFormValid) && isTouched && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-800 font-medium">Form Incomplete</p>
                  <p className="text-yellow-700 text-sm mt-1">
                    Please complete all required fields before submitting the visit.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isFormValid && isTouched && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-800 font-medium">Ready to Submit</p>
                  <p className="text-green-700 text-sm mt-1">
                    All required fields are complete and validated.
                  </p>
                </div>
              </div>
            </div>
          )}

          {submitError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium">Submission Error</p>
                  <p className="text-red-700 text-sm mt-1">{submitError}</p>
                </div>
              </div>
            </div>
          )}

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
              {/* Form Progress */}
              {isTouched && (
                <div className="text-sm text-gray-500">
                  <span>Form {Math.round((Object.values(fields).filter(f => f.valid && f.value.trim()).length / Object.keys(fields).length) * 100)}% complete</span>
                </div>
              )}
              
              <div className="flex space-x-3">
              <InteractiveButton variant="secondary" icon={<Save className="h-4 w-4" />}>
                {isSubmitting ? 'Saving...' : 'Save Draft'}
              </InteractiveButton>
              <AnimatedButton 
                variant="primary" 
                onClick={() => handleSubmit(handleCompleteVisit)}
                disabled={!isFormValid || isSubmitting}
                loading={isSubmitting}
                icon={<CheckCircle className="h-4 w-4" />}
                animation="glow"
              >
                {isSubmitting ? 'Completing...' : 'Complete Visit'}
              </AnimatedButton>
              </div>
            </div>
          </div>

          {/* Related Content */}
          <div className="mt-8">
            <RelatedContent currentPage="charting" patientId={patientInfo.mrn} />
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
        onClick={() => handleSubmit(handleCompleteVisit)}
        position="bottom-left"
        tooltip="Complete Visit"
        color="bg-green-600"
      />
    </div>
  );
}