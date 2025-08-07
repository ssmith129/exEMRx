// Common validation patterns and utilities

export const VALIDATION_PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^(\+1\s?)?(\([0-9]{3}\)|[0-9]{3})[\s.-]?[0-9]{3}[\s.-]?[0-9]{4}$/,
  mrn: /^[A-Z]{2,4}-[0-9]{4,8}$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  zipCode: /^\d{5}(-\d{4})?$/,
  ssn: /^\d{3}-?\d{2}-?\d{4}$/,
  creditCard: /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/
};

export const FIELD_CONSTRAINTS = {
  name: { minLength: 2, maxLength: 50 },
  email: { maxLength: 100 },
  phone: { minLength: 10, maxLength: 15 },
  password: { minLength: 8, maxLength: 128 },
  address: { maxLength: 200 },
  notes: { maxLength: 1000 },
  mrn: { minLength: 6, maxLength: 15 }
};

// Custom validation functions
export const customValidators = {
  email: (value: string): string | null => {
    if (!value) return null;
    if (!VALIDATION_PATTERNS.email.test(value)) {
      return 'Please enter a valid email address (e.g., user@example.com)';
    }
    return null;
  },

  phone: (value: string): string | null => {
    if (!value) return null;
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length < 10) {
      return 'Phone number must be at least 10 digits';
    }
    if (!VALIDATION_PATTERNS.phone.test(value)) {
      return 'Please enter a valid phone number (e.g., (555) 123-4567)';
    }
    return null;
  },

  password: (value: string): string | null => {
    if (!value) return null;
    
    const errors = [];
    if (value.length < 8) errors.push('at least 8 characters');
    if (!/[a-z]/.test(value)) errors.push('a lowercase letter');
    if (!/[A-Z]/.test(value)) errors.push('an uppercase letter');
    if (!/\d/.test(value)) errors.push('a number');
    if (!/[@$!%*?&]/.test(value)) errors.push('a special character');
    
    if (errors.length > 0) {
      return `Password must contain ${errors.join(', ')}`;
    }
    return null;
  },

  confirmPassword: (value: string, originalPassword: string): string | null => {
    if (!value) return null;
    if (value !== originalPassword) {
      return 'Passwords do not match';
    }
    return null;
  },

  mrn: (value: string): string | null => {
    if (!value) return null;
    if (!VALIDATION_PATTERNS.mrn.test(value)) {
      return 'Please enter a valid MRN format (e.g., WIC-123456)';
    }
    return null;
  },

  required: (value: string, fieldName: string = 'This field'): string | null => {
    if (!value || !value.trim()) {
      return `${fieldName} is required`;
    }
    return null;
  },

  minLength: (value: string, min: number, fieldName: string = 'This field'): string | null => {
    if (value && value.length < min) {
      return `${fieldName} must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (value: string, max: number, fieldName: string = 'This field'): string | null => {
    if (value && value.length > max) {
      return `${fieldName} must be no more than ${max} characters`;
    }
    return null;
  },

  numeric: (value: string): string | null => {
    if (value && !/^\d+(\.\d+)?$/.test(value)) {
      return 'Please enter a valid number';
    }
    return null;
  },

  positiveNumber: (value: string): string | null => {
    const numValue = parseFloat(value);
    if (value && (isNaN(numValue) || numValue <= 0)) {
      return 'Please enter a positive number';
    }
    return null;
  },

  dateRange: (value: string, minDate?: Date, maxDate?: Date): string | null => {
    if (!value) return null;
    
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return 'Please enter a valid date';
    }
    
    if (minDate && date < minDate) {
      return `Date must be after ${minDate.toLocaleDateString()}`;
    }
    
    if (maxDate && date > maxDate) {
      return `Date must be before ${maxDate.toLocaleDateString()}`;
    }
    
    return null;
  },

  age: (value: string): string | null => {
    const age = parseInt(value);
    if (value && (isNaN(age) || age < 0 || age > 150)) {
      return 'Please enter a valid age (0-150)';
    }
    return null;
  }
};

// Async validators (simulate API calls)
export const asyncValidators = {
  emailExists: async (email: string): Promise<string | null> => {
    if (!email) return null;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate some emails being taken
    const takenEmails = ['admin@example.com', 'test@test.com', 'user@demo.com'];
    if (takenEmails.includes(email.toLowerCase())) {
      return 'This email address is already registered';
    }
    
    return null;
  },

  mrnExists: async (mrn: string): Promise<string | null> => {
    if (!mrn) return null;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Simulate some MRNs being taken
    const existingMrns = ['WIC-123456', 'MED-789012', 'PAT-555666'];
    if (existingMrns.includes(mrn.toUpperCase())) {
      return 'This MRN already exists in the system';
    }
    
    return null;
  },

  usernameAvailable: async (username: string): Promise<string | null> => {
    if (!username) return null;
    if (username.length < 3) return 'Username must be at least 3 characters';
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate some usernames being taken
    const takenUsernames = ['admin', 'user', 'test', 'demo', 'doctor'];
    if (takenUsernames.includes(username.toLowerCase())) {
      return 'This username is not available';
    }
    
    return null;
  }
};

// Validation rule builders
export const createValidationRules = {
  required: (fieldName: string = 'This field') => ({
    custom: (value: string) => customValidators.required(value, fieldName)
  }),

  email: (required: boolean = false) => ({
    required,
    custom: customValidators.email,
    asyncValidator: asyncValidators.emailExists
  }),

  password: (required: boolean = true) => ({
    required,
    minLength: 8,
    custom: customValidators.password
  }),

  confirmPassword: (originalPassword: string, required: boolean = true) => ({
    required,
    custom: (value: string) => customValidators.confirmPassword(value, originalPassword)
  }),

  phone: (required: boolean = false) => ({
    required,
    custom: customValidators.phone
  }),

  mrn: (required: boolean = true) => ({
    required,
    custom: customValidators.mrn,
    asyncValidator: asyncValidators.mrnExists
  }),

  name: (required: boolean = true) => ({
    required,
    minLength: FIELD_CONSTRAINTS.name.minLength,
    maxLength: FIELD_CONSTRAINTS.name.maxLength
  }),

  text: (minLength?: number, maxLength?: number, required: boolean = false) => ({
    required,
    ...(minLength && { minLength }),
    ...(maxLength && { maxLength })
  }),

  numeric: (min?: number, max?: number, required: boolean = false) => ({
    required,
    custom: (value: string) => {
      if (!value && !required) return null;
      
      const numError = customValidators.numeric(value);
      if (numError) return numError;
      
      const num = parseFloat(value);
      if (min !== undefined && num < min) {
        return `Value must be at least ${min}`;
      }
      if (max !== undefined && num > max) {
        return `Value must be no more than ${max}`;
      }
      
      return null;
    }
  }),

  date: (minDate?: Date, maxDate?: Date, required: boolean = false) => ({
    required,
    custom: (value: string) => customValidators.dateRange(value, minDate, maxDate)
  })
};

// Form validation helpers
export const validateFormSync = (values: { [key: string]: string }, rules: { [key: string]: any }): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};
  
  Object.keys(rules).forEach(fieldName => {
    const rule = rules[fieldName];
    const value = values[fieldName] || '';
    
    // Required validation
    if (rule.required && !value.trim()) {
      errors[fieldName] = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      return;
    }
    
    // Length validations
    if (rule.minLength && value.length < rule.minLength) {
      errors[fieldName] = `${fieldName} must be at least ${rule.minLength} characters`;
      return;
    }
    
    if (rule.maxLength && value.length > rule.maxLength) {
      errors[fieldName] = `${fieldName} must be no more than ${rule.maxLength} characters`;
      return;
    }
    
    // Pattern validation
    if (rule.pattern && value && !rule.pattern.test(value)) {
      errors[fieldName] = `${fieldName} format is invalid`;
      return;
    }
    
    // Custom validation
    if (rule.custom && value) {
      const customError = rule.custom(value);
      if (customError) {
        errors[fieldName] = customError;
        return;
      }
    }
  });
  
  return errors;
};

// Format display values
export const formatters = {
  phone: (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 6) {
      return digits.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (digits.length >= 3) {
      return digits.replace(/(\d{3})(\d+)/, '($1) $2');
    }
    return digits;
  },

  creditCard: (value: string): string => {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  },

  ssn: (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 5) {
      return digits.replace(/(\d{3})(\d{2})(\d+)/, '$1-$2-$3');
    } else if (digits.length >= 3) {
      return digits.replace(/(\d{3})(\d+)/, '$1-$2');
    }
    return digits;
  },

  currency: (value: string): string => {
    const number = parseFloat(value.replace(/[^\d.]/g, ''));
    if (isNaN(number)) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(number);
  }
};