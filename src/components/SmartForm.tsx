import React, { useState } from 'react';
import { useFormValidation } from '../hooks/useFormValidation';
import { createValidationRules } from '../utils/validation';
import { useNotifications } from './NotificationSystem';
import InteractiveInput from './InteractiveInput';
import InteractiveButton from './InteractiveButton';
import { CheckCircle, AlertTriangle, Save, RefreshCw } from 'lucide-react';

interface SmartFormProps {
  initialValues?: { [key: string]: string };
  onSubmit: (values: { [key: string]: string }) => Promise<void>;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
  submitText?: string;
  showProgress?: boolean;
  preventAutoComplete?: boolean;
}

export const SmartForm: React.FC<SmartFormProps> = ({
  initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  },
  onSubmit,
  onCancel,
  title = 'Form',
  subtitle,
  submitText = 'Submit',
  showProgress = true,
  preventAutoComplete = false
}) => {
  const { addNotification } = useNotifications();
  const [passwordValue, setPasswordValue] = useState('');

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
    isTouched,
    submitAttempted
  } = useFormValidation({
    initialValues,
    validationRules: {
      firstName: createValidationRules.name(true),
      lastName: createValidationRules.name(true),
      email: createValidationRules.email(true),
      phone: createValidationRules.phone(false),
      password: createValidationRules.password(true),
      confirmPassword: createValidationRules.confirmPassword(passwordValue, true)
    },
    validationTiming: 'smart',
    debounceMs: 300
  });

  const handlePasswordChange = (value: string) => {
    setPasswordValue(value);
    handleFieldChange('password', value);
  };

  const handleFormSubmit = async (values: { [key: string]: string }) => {
    try {
      await onSubmit(values);
      addNotification({
        type: 'success',
        title: 'Form Submitted Successfully!',
        message: 'Your information has been saved.',
        duration: 5000
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Submission Failed',
        message: error.message || 'Please try again.',
        duration: 5000
      });
      throw error;
    }
  };

  const getProgressPercentage = (): number => {
    const totalFields = Object.keys(fields).length;
    const validFields = Object.values(fields).filter(field => field.valid && field.value.trim()).length;
    return Math.round((validFields / totalFields) * 100);
  };

  const getRequiredFieldsRemaining = (): number => {
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
    return requiredFields.filter(field => !fields[field]?.valid || !fields[field]?.value.trim()).length;
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
        
        {/* Progress Indicator */}
        {showProgress && isTouched && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">Form Progress</span>
              <span className="text-sm text-blue-700">{getProgressPercentage()}% complete</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            {getRequiredFieldsRemaining() > 0 && (
              <p className="text-xs text-blue-700 mt-2">
                {getRequiredFieldsRemaining()} required field{getRequiredFieldsRemaining() !== 1 ? 's' : ''} remaining
              </p>
            )}
          </div>
        )}
      </div>

      {/* Success State */}
      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="text-green-900 font-medium">Success!</h3>
              <p className="text-green-700 text-sm">Your form has been submitted successfully.</p>
            </div>
          </div>
        </div>
      )}

      {/* Form Error State */}
      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="text-red-900 font-medium">Submission Error</h3>
              <p className="text-red-700 text-sm">{submitError}</p>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(handleFormSubmit);
        }}
        autoComplete={preventAutoComplete ? 'off' : 'on'}
        noValidate
        className="space-y-6"
      >
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InteractiveInput
            label="First Name"
            value={fields.firstName?.value || ''}
            onChange={(value) => handleFieldChange('firstName', value)}
            onBlur={() => handleFieldBlur('firstName')}
            error={fields.firstName?.touched ? fields.firstName?.error || undefined : undefined}
            success={fields.firstName?.valid && fields.firstName?.touched}
            validating={fields.firstName?.validating}
            required
            maxLength={50}
            showCharacterCount
            helpText="Enter your legal first name"
            autoComplete="given-name"
          />
          <InteractiveInput
            label="Last Name"
            value={fields.lastName?.value || ''}
            onChange={(value) => handleFieldChange('lastName', value)}
            onBlur={() => handleFieldBlur('lastName')}
            error={fields.lastName?.touched ? fields.lastName?.error || undefined : undefined}
            success={fields.lastName?.valid && fields.lastName?.touched}
            validating={fields.lastName?.validating}
            required
            maxLength={50}
            showCharacterCount
            helpText="Enter your legal last name"
            autoComplete="family-name"
          />
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <InteractiveInput
            label="Email Address"
            type="email"
            value={fields.email?.value || ''}
            onChange={(value) => handleFieldChange('email', value)}
            onBlur={() => handleFieldBlur('email')}
            error={fields.email?.touched ? fields.email?.error || undefined : undefined}
            success={fields.email?.valid && fields.email?.touched}
            validating={fields.email?.validating}
            required
            helpText="We'll use this to send you important updates"
            placeholder="you@example.com"
            autoComplete="email"
          />
          <InteractiveInput
            label="Phone Number"
            value={fields.phone?.value || ''}
            onChange={(value) => handleFieldChange('phone', value)}
            onBlur={() => handleFieldBlur('phone')}
            error={fields.phone?.touched ? fields.phone?.error || undefined : undefined}
            success={fields.phone?.valid && fields.phone?.touched}
            validating={fields.phone?.validating}
            helpText="Optional - for account recovery and important notifications"
            placeholder="(555) 123-4567"
            autoComplete="tel"
          />
        </div>

        {/* Password Fields */}
        <div className="space-y-4">
          <InteractiveInput
            label="Password"
            type="password"
            value={fields.password?.value || ''}
            onChange={handlePasswordChange}
            onBlur={() => handleFieldBlur('password')}
            error={fields.password?.touched ? fields.password?.error || undefined : undefined}
            success={fields.password?.valid && fields.password?.touched}
            validating={fields.password?.validating}
            required
            strengthIndicator
            helpText="Use 8+ characters with a mix of letters, numbers, and symbols"
            autoComplete="new-password"
          />
          <InteractiveInput
            label="Confirm Password"
            type="password"
            value={fields.confirmPassword?.value || ''}
            onChange={(value) => handleFieldChange('confirmPassword', value)}
            onBlur={() => handleFieldBlur('confirmPassword')}
            error={fields.confirmPassword?.touched ? fields.confirmPassword?.error || undefined : undefined}
            success={fields.confirmPassword?.valid && fields.confirmPassword?.touched}
            validating={fields.confirmPassword?.validating}
            required
            helpText="Re-enter your password to confirm"
            autoComplete="new-password"
          />
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <InteractiveButton
            type="submit"
            variant="primary"
            disabled={!isFormValid || isSubmitting}
            loading={isSubmitting}
            className="flex-1 sm:flex-none"
            icon={isSubmitting ? <RefreshCw className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          >
            {isSubmitting ? 'Submitting...' : submitText}
          </InteractiveButton>

          <InteractiveButton
            type="button"
            variant="secondary"
            onClick={resetForm}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none"
          >
            Reset Form
          </InteractiveButton>

          {onCancel && (
            <InteractiveButton
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </InteractiveButton>
          )}
        </div>

        {/* Form Status */}
        <div className="text-center">
          {hasErrors && submitAttempted && (
            <p className="text-sm text-red-600">
              Please correct the errors above before submitting
            </p>
          )}
          {isFormValid && isTouched && !submitSuccess && (
            <p className="text-sm text-green-600">
              ✓ Form is ready to submit
            </p>
          )}
          {!isTouched && (
            <p className="text-sm text-gray-500">
              Fill out the form above to get started
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default SmartForm;