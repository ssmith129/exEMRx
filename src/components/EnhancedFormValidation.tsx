import React, { useState, useCallback, useRef, useEffect } from 'react';
import { CheckCircle, AlertCircle, Eye, EyeOff, Info, Loader2 } from 'lucide-react';

interface ValidationRule {
  validate: (value: string, formData?: Record<string, any>) => boolean;
  message: string;
  type: 'error' | 'warning' | 'info';
  preventSubmit?: boolean;
}

interface FieldConfig {
  label: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'url' | 'textarea' | 'select';
  placeholder?: string;
  rules?: ValidationRule[];
  required?: boolean;
  helpText?: string;
  options?: string[]; // for select fields
  debounceMs?: number;
  autocomplete?: string;
  ariaDescribedBy?: string;
}

interface FormField {
  value: string;
  errors: ValidationRule[];
  warnings: ValidationRule[];
  touched: boolean;
  focused: boolean;
  validating: boolean;
  valid: boolean;
}

interface EnhancedFormProps {
  fields: Record<string, FieldConfig>;
  onSubmit: (data: Record<string, string>) => Promise<void>;
  title: string;
  subtitle?: string;
  submitText?: string;
  className?: string;
  enableAutoSave?: boolean;
  showProgress?: boolean;
}

export default function EnhancedFormValidation({
  fields,
  onSubmit,
  title,
  subtitle,
  submitText = 'Submit',
  className = '',
  enableAutoSave = false,
  showProgress = true
}: EnhancedFormProps) {
  const [formFields, setFormFields] = useState<Record<string, FormField>>(() => {
    const initialState: Record<string, FormField> = {};
    Object.keys(fields).forEach(key => {
      initialState[key] = {
        value: '',
        errors: [],
        warnings: [],
        touched: false,
        focused: false,
        validating: false,
        valid: false
      };
    });
    return initialState;
  });

  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});
  const autoSaveTimer = useRef<NodeJS.Timeout>();

  // Calculate form completion percentage
  const completionPercentage = Object.keys(fields).length > 0 
    ? Math.round((Object.values(formFields).filter(field => field.value.trim() && field.valid).length / Object.keys(fields).length) * 100)
    : 0;

  // Validate a single field
  const validateField = useCallback((fieldName: string, value: string): { errors: ValidationRule[]; warnings: ValidationRule[] } => {
    const fieldConfig = fields[fieldName];
    if (!fieldConfig) return { errors: [], warnings: [] };

    const errors: ValidationRule[] = [];
    const warnings: ValidationRule[] = [];
    const formData = Object.fromEntries(
      Object.entries(formFields).map(([key, field]) => [key, field.value])
    );
    formData[fieldName] = value; // Include current value

    // Required field validation
    if (fieldConfig.required && !value.trim()) {
      errors.push({
        validate: () => false,
        message: `${fieldConfig.label} is required`,
        type: 'error',
        preventSubmit: true
      });
    }

    // Run custom validation rules
    fieldConfig.rules?.forEach(rule => {
      if (value.trim() && !rule.validate(value, formData)) {
        if (rule.type === 'error') {
          errors.push(rule);
        } else if (rule.type === 'warning') {
          warnings.push(rule);
        }
      }
    });

    return { errors, warnings };
  }, [fields, formFields]);

  // Debounced validation
  const validateWithDebounce = useCallback((fieldName: string, value: string) => {
    const fieldConfig = fields[fieldName];
    const debounceMs = fieldConfig?.debounceMs || 300;

    // Clear existing timer
    if (debounceTimers.current[fieldName]) {
      clearTimeout(debounceTimers.current[fieldName]);
    }

    // Set field as validating
    setFormFields(prev => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], validating: true }
    }));

    // Start new timer
    debounceTimers.current[fieldName] = setTimeout(() => {
      const { errors, warnings } = validateField(fieldName, value);
      setFormFields(prev => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          errors,
          warnings,
          validating: false,
          valid: errors.length === 0
        }
      }));
    }, debounceMs);
  }, [fields, validateField]);

  // Handle field change
  const handleFieldChange = (fieldName: string, value: string) => {
    setFormFields(prev => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], value }
    }));

    validateWithDebounce(fieldName, value);

    // Auto-save functionality
    if (enableAutoSave) {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
      autoSaveTimer.current = setTimeout(() => {
        // Implement auto-save logic here
        console.log('Auto-saving form data...');
      }, 2000);
    }
  };

  // Handle field focus
  const handleFieldFocus = (fieldName: string) => {
    setFormFields(prev => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], focused: true }
    }));
  };

  // Handle field blur
  const handleFieldBlur = (fieldName: string) => {
    setFormFields(prev => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], focused: false, touched: true }
    }));

    // Immediate validation on blur
    const { errors, warnings } = validateField(fieldName, formFields[fieldName].value);
    setFormFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        errors,
        warnings,
        valid: errors.length === 0
      }
    }));
  };

  // Check if form is valid
  const isFormValid = Object.values(formFields).every(field => field.valid) &&
    Object.keys(fields).filter(key => fields[key].required).every(key => formFields[key].value.trim());

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      // Mark all fields as touched to show validation errors
      setFormFields(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          updated[key] = { ...updated[key], touched: true };
        });
        return updated;
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = Object.fromEntries(
        Object.entries(formFields).map(([key, field]) => [key, field.value])
      );
      await onSubmit(formData);
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render field based on type
  const renderField = (fieldName: string, config: FieldConfig) => {
    const field = formFields[fieldName];
    const hasErrors = field.errors.length > 0 && field.touched;
    const hasWarnings = field.warnings.length > 0 && field.touched;
    const isPassword = config.type === 'password';

    const baseClasses = `
      block w-full px-4 py-3 border rounded-lg text-sm transition-all duration-200
      placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500
      disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    `;

    const stateClasses = hasErrors
      ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-400 focus:border-red-500 focus:ring-red-500'
      : hasWarnings
      ? 'border-yellow-500 bg-yellow-50 text-yellow-900 placeholder-yellow-400 focus:border-yellow-500 focus:ring-yellow-500'
      : field.valid && field.value
      ? 'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-500'
      : field.focused
      ? 'border-primary-500 bg-white shadow-sm'
      : 'border-gray-300 bg-white hover:border-gray-400';

    const fieldProps = {
      id: fieldName,
      value: field.value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
        handleFieldChange(fieldName, e.target.value),
      onFocus: () => handleFieldFocus(fieldName),
      onBlur: () => handleFieldBlur(fieldName),
      placeholder: config.placeholder,
      required: config.required,
      autoComplete: config.autocomplete,
      'aria-invalid': hasErrors,
      'aria-describedby': `${fieldName}-help ${fieldName}-error`,
      className: `${baseClasses} ${stateClasses} ${isPassword ? 'pr-12' : ''}`
    };

    return (
      <div key={fieldName} className="space-y-2">
        <label 
          htmlFor={fieldName}
          className="block text-sm font-medium text-gray-700"
        >
          {config.label}
          {config.required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>

        <div className="relative">
          {config.type === 'textarea' ? (
            <textarea
              {...fieldProps}
              rows={4}
              className={`${fieldProps.className} resize-none`}
            />
          ) : config.type === 'select' ? (
            <select {...fieldProps}>
              <option value="">{config.placeholder || `Select ${config.label}`}</option>
              {config.options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : (
            <input
              {...fieldProps}
              type={isPassword && !showPasswords[fieldName] ? 'password' : config.type}
            />
          )}

          {/* Password visibility toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPasswords(prev => ({ ...prev, [fieldName]: !prev[fieldName] }))}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label={showPasswords[fieldName] ? 'Hide password' : 'Show password'}
            >
              {showPasswords[fieldName] ? 
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : 
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              }
            </button>
          )}

          {/* Validation indicators */}
          {field.validating && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
            </div>
          )}

          {field.valid && field.value && !field.validating && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          )}
        </div>

        {/* Help text */}
        {config.helpText && (
          <div id={`${fieldName}-help`} className="flex items-start text-xs text-gray-600">
            <Info className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
            <span>{config.helpText}</span>
          </div>
        )}

        {/* Error messages */}
        {hasErrors && (
          <div id={`${fieldName}-error`} className="space-y-1" role="alert" aria-live="polite">
            {field.errors.map((error, index) => (
              <div key={index} className="flex items-start text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>{error.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Warning messages */}
        {hasWarnings && !hasErrors && (
          <div className="space-y-1">
            {field.warnings.map((warning, index) => (
              <div key={index} className="flex items-start text-sm text-yellow-600">
                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>{warning.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (submitSuccess) {
    return (
      <div className="max-w-md mx-auto text-center p-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
        <p className="text-gray-600">Your form has been submitted successfully.</p>
      </div>
    );
  }

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-accent-50">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
          
          {/* Progress bar */}
          {showProgress && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{completionPercentage}% complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6" noValidate>
          {Object.entries(fields).map(([fieldName, config]) => 
            renderField(fieldName, config)
          )}

          {/* Submit error */}
          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-red-900 font-medium">Submission Error</h3>
                  <p className="text-red-700 text-sm mt-1">{submitError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit button */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            {enableAutoSave && (
              <div className="text-sm text-gray-500">
                <Info className="h-4 w-4 inline mr-1" />
                Auto-save enabled
              </div>
            )}
            
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`
                px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2
                ${isFormValid && !isSubmitting
                  ? 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
              aria-describedby="submit-status"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                  Submitting...
                </>
              ) : (
                submitText
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Predefined validation rules for healthcare forms
export const healthcareValidationRules = {
  email: {
    validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Please enter a valid email address',
    type: 'error' as const,
    preventSubmit: true
  },
  
  strongPassword: {
    validate: (value: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value),
    message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
    type: 'error' as const,
    preventSubmit: true
  },
  
  phone: {
    validate: (value: string) => /^\+?[\d\s\-\(\)]+$/.test(value) && value.replace(/\D/g, '').length >= 10,
    message: 'Please enter a valid phone number',
    type: 'error' as const,
    preventSubmit: true
  },
  
  hipaaCompliance: {
    validate: () => true, // This would check against HIPAA requirements
    message: 'Information must comply with HIPAA privacy requirements',
    type: 'info' as const,
    preventSubmit: false
  }
};
