import { useState, useCallback, useRef, useEffect } from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
  asyncValidator?: (value: string) => Promise<string | null>;
}

export interface FormField {
  value: string;
  error: string | null;
  touched: boolean;
  validating: boolean;
  valid: boolean;
}

export interface FormValidationConfig {
  [fieldName: string]: ValidationRule;
}

export interface UseFormValidationProps {
  initialValues: { [key: string]: string };
  validationRules: FormValidationConfig;
  validationTiming?: 'onChange' | 'onBlur' | 'onSubmit' | 'smart';
  debounceMs?: number;
}

export const useFormValidation = ({
  initialValues,
  validationRules,
  validationTiming = 'smart',
  debounceMs = 300
}: UseFormValidationProps) => {
  const [fields, setFields] = useState<{ [key: string]: FormField }>(() => {
    const initialFields: { [key: string]: FormField } = {};
    Object.keys(initialValues).forEach(key => {
      initialFields[key] = {
        value: initialValues[key],
        error: null,
        touched: false,
        validating: false,
        valid: false
      };
    });
    return initialFields;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const timeoutRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const asyncValidationRefs = useRef<{ [key: string]: AbortController }>({});

  // Validation messages
  const getValidationMessage = (fieldName: string, rule: ValidationRule, value: string): string => {
    const fieldDisplayName = fieldName.replace(/([A-Z])/g, ' $1').toLowerCase();
    
    if (rule.required && !value.trim()) {
      return `${fieldDisplayName.charAt(0).toUpperCase() + fieldDisplayName.slice(1)} is required`;
    }
    
    if (rule.minLength && value.length < rule.minLength) {
      return `${fieldDisplayName.charAt(0).toUpperCase() + fieldDisplayName.slice(1)} must be at least ${rule.minLength} characters`;
    }
    
    if (rule.maxLength && value.length > rule.maxLength) {
      return `${fieldDisplayName.charAt(0).toUpperCase() + fieldDisplayName.slice(1)} must be no more than ${rule.maxLength} characters`;
    }
    
    if (rule.pattern && !rule.pattern.test(value)) {
      // Specific messages for common patterns
      if (rule.pattern.toString().includes('@')) {
        return 'Please enter a valid email address';
      }
      if (rule.pattern.toString().includes('\\d')) {
        return 'Please enter a valid phone number';
      }
      return `${fieldDisplayName.charAt(0).toUpperCase() + fieldDisplayName.slice(1)} format is invalid`;
    }
    
    return '';
  };

  const validateField = useCallback(async (fieldName: string, value: string): Promise<string | null> => {
    const rule = validationRules[fieldName];
    if (!rule) return null;

    // Cancel any existing async validation
    if (asyncValidationRefs.current[fieldName]) {
      asyncValidationRefs.current[fieldName].abort();
    }

    // Basic validation
    const basicError = getValidationMessage(fieldName, rule, value);
    if (basicError) return basicError;

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) return customError;
    }

    // Async validation
    if (rule.asyncValidator && value.trim()) {
      const controller = new AbortController();
      asyncValidationRefs.current[fieldName] = controller;

      try {
        const asyncError = await rule.asyncValidator(value);
        if (!controller.signal.aborted) {
          return asyncError;
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          return 'Validation failed. Please try again.';
        }
      } finally {
        if (asyncValidationRefs.current[fieldName] === controller) {
          delete asyncValidationRefs.current[fieldName];
        }
      }
    }

    return null;
  }, [validationRules]);

  const updateField = useCallback(async (fieldName: string, value: string, touched: boolean = false) => {
    // Clear any existing timeout
    if (timeoutRefs.current[fieldName]) {
      clearTimeout(timeoutRefs.current[fieldName]);
    }

    // Update field immediately
    setFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value,
        touched: touched || prev[fieldName].touched,
        validating: true
      }
    }));

    // Determine if we should validate now
    const shouldValidateImmediately = 
      validationTiming === 'onChange' ||
      (validationTiming === 'smart' && (fields[fieldName]?.touched || submitAttempted));

    if (shouldValidateImmediately) {
      // Debounced validation
      timeoutRefs.current[fieldName] = setTimeout(async () => {
        const error = await validateField(fieldName, value);
        const isValid = error === null;

        setFields(prev => ({
          ...prev,
          [fieldName]: {
            ...prev[fieldName],
            error,
            valid: isValid,
            validating: false
          }
        }));
      }, debounceMs);
    } else {
      // Just mark as not validating
      setFields(prev => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          validating: false
        }
      }));
    }
  }, [validateField, validationTiming, debounceMs, submitAttempted, fields]);

  const handleFieldChange = useCallback((fieldName: string, value: string) => {
    updateField(fieldName, value);
    setSubmitError(null); // Clear submit errors when user makes changes
    setSubmitSuccess(false); // Clear success state
  }, [updateField]);

  const handleFieldBlur = useCallback(async (fieldName: string) => {
    const field = fields[fieldName];
    if (!field) return;

    // Mark as touched and validate if using onBlur timing or smart timing
    if (validationTiming === 'onBlur' || validationTiming === 'smart') {
      await updateField(fieldName, field.value, true);
    } else {
      // Just mark as touched
      setFields(prev => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          touched: true
        }
      }));
    }
  }, [fields, validationTiming, updateField]);

  const validateAllFields = useCallback(async (): Promise<boolean> => {
    const validationPromises = Object.keys(fields).map(async (fieldName) => {
      const error = await validateField(fieldName, fields[fieldName].value);
      return { fieldName, error };
    });

    const validationResults = await Promise.all(validationPromises);
    
    setFields(prev => {
      const updated = { ...prev };
      validationResults.forEach(({ fieldName, error }) => {
        updated[fieldName] = {
          ...updated[fieldName],
          error,
          valid: error === null,
          touched: true,
          validating: false
        };
      });
      return updated;
    });

    return validationResults.every(result => result.error === null);
  }, [fields, validateField]);

  const handleSubmit = useCallback(async (onSubmit: (values: { [key: string]: string }) => Promise<void>) => {
    setIsSubmitting(true);
    setSubmitAttempted(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const isValid = await validateAllFields();
      
      if (!isValid) {
        setSubmitError('Please correct the errors below before submitting.');
        return;
      }

      const values: { [key: string]: string } = {};
      Object.keys(fields).forEach(key => {
        values[key] = fields[key].value;
      });

      await onSubmit(values);
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setSubmitSuccess(false);
        setSubmitAttempted(false);
      }, 3000);

    } catch (error: any) {
      setSubmitError(error.message || 'An error occurred while submitting the form.');
    } finally {
      setIsSubmitting(false);
    }
  }, [validateAllFields, fields]);

  const resetForm = useCallback(() => {
    setFields(prev => {
      const reset = { ...prev };
      Object.keys(reset).forEach(key => {
        reset[key] = {
          value: initialValues[key] || '',
          error: null,
          touched: false,
          validating: false,
          valid: false
        };
      });
      return reset;
    });
    setSubmitAttempted(false);
    setSubmitError(null);
    setSubmitSuccess(false);
    setIsSubmitting(false);
  }, [initialValues]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach(timeout => clearTimeout(timeout));
      Object.values(asyncValidationRefs.current).forEach(controller => controller.abort());
    };
  }, []);

  const isFormValid = Object.values(fields).every(field => field.valid && !field.validating);
  const hasErrors = Object.values(fields).some(field => field.error !== null);
  const isTouched = Object.values(fields).some(field => field.touched);

  return {
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
  };
};