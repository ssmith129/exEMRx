// Application constants

export const APP_NAME = 'ezEMRx';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'AI-enhanced Electronic Health Record system for public health clinics';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const API_TIMEOUT = 10000; // 10 seconds

// Design System Constants
export const COLORS = {
  primary: {
    50: '#f0f9f6',
    100: '#dbf0e8',
    200: '#b9e1d4',
    300: '#8acbb9',
    400: '#58b09b',
    500: '#3c8c78',
    600: '#2e7163',
    700: '#265c52',
    800: '#224a43',
    900: '#1f3e38'
  },
  error: '#D9534F',
  success: '#28A745',
  warning: '#FFC107',
  info: '#17A2B8'
};

export const BREAKPOINTS = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px'
};

export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px'
};

// Form Constants
export const FORM_VALIDATION = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\(\d{3}\) \d{3}-\d{4}$/,
  mrn: /^[A-Z]{3}-\d{6}$/
};

// Patient Management
export const PATIENT_STATUSES = ['active', 'inactive', 'pending'] as const;
export const APPOINTMENT_TYPES = [
  'WIC Nutrition Assessment',
  'Immunization Visit',
  'Well Child Check',
  'Follow-up Visit',
  'Consultation',
  'Emergency Visit'
] as const;

export const PROVIDER_SPECIALTIES = [
  'Primary Care',
  'Pediatrics',
  'Family Medicine',
  'Internal Medicine',
  'Obstetrics & Gynecology',
  'Psychiatry',
  'Cardiology',
  'Endocrinology',
  'Gastroenterology',
  'Neurology',
  'Orthopedics',
  'Dermatology'
] as const;

// AI Configuration
export const AI_CONFIDENCE_LEVELS = {
  high: { threshold: 85, color: 'green' },
  medium: { threshold: 70, color: 'yellow' },
  low: { threshold: 0, color: 'gray' }
} as const;

// Compliance Standards
export const COMPLIANCE_CATEGORIES = [
  'Patient Information',
  'Clinical Assessment',
  'WIC Requirements',
  'Immunizations',
  'Follow-up',
  'Documentation'
] as const;

export const COMPLIANCE_STATUSES = ['complete', 'warning', 'error', 'pending'] as const;

// Time Slots for Appointments
export const TIME_SLOTS = [
  '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
] as const;

// Export Formats
export const EXPORT_FORMATS = ['pdf', 'csv', 'xlsx'] as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  user: 'ezemrx_user',
  preferences: 'ezemrx_preferences',
  drafts: 'ezemrx_drafts',
  theme: 'ezemrx_theme'
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  password: 'Password must be at least 8 characters',
  phone: 'Please enter a valid phone number',
  mrn: 'Please enter a valid MRN (e.g., WIC-123456)',
  network: 'Network error. Please check your connection.',
  server: 'Server error. Please try again later.',
  unauthorized: 'You are not authorized to perform this action.',
  notFound: 'The requested resource was not found.'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  saved: 'Changes saved successfully',
  created: 'Record created successfully',
  updated: 'Record updated successfully',
  deleted: 'Record deleted successfully',
  scheduled: 'Appointment scheduled successfully',
  referred: 'Referral created successfully'
} as const;