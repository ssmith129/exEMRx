// Utility helper functions

import { FORM_VALIDATION, AI_CONFIDENCE_LEVELS } from './constants';
import type { Patient, AISuggestion } from '../types';

/**
 * Format date to readable string
 */
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format time to readable string
 */
export const formatTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dob: string): string => {
  const birthDate = new Date(dob);
  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years === 0) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  } else if (years < 5) {
    return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
  } else {
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
};

/**
 * Validate email address
 */
export const validateEmail = (email: string): boolean => {
  return FORM_VALIDATION.email.test(email);
};

/**
 * Validate phone number
 */
export const validatePhone = (phone: string): boolean => {
  return FORM_VALIDATION.phone.test(phone);
};

/**
 * Validate MRN format
 */
export const validateMRN = (mrn: string): boolean => {
  return FORM_VALIDATION.mrn.test(mrn);
};

/**
 * Format phone number
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

/**
 * Get confidence level color
 */
export const getConfidenceColor = (confidence: string): string => {
  switch (confidence) {
    case 'high':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'low':
      return 'text-gray-600 bg-gray-50 border-gray-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

/**
 * Get status color classes
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
    case 'complete':
    case 'completed':
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'pending':
    case 'scheduled':
      return 'bg-yellow-100 text-yellow-800';
    case 'error':
    case 'cancelled':
    case 'overdue':
      return 'bg-red-100 text-red-800';
    case 'inactive':
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Debounce function for search and auto-save
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Filter patients by search query
 */
export const filterPatients = (patients: Patient[], query: string): Patient[] => {
  if (!query.trim()) return patients;
  
  const searchTerm = query.toLowerCase();
  return patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm) ||
    patient.mrn.toLowerCase().includes(searchTerm) ||
    patient.phone.includes(searchTerm)
  );
};

/**
 * Sort patients by various criteria
 */
export const sortPatients = (patients: Patient[], sortBy: string): Patient[] => {
  return [...patients].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'lastVisit':
        return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
      case 'nextAppointment':
        return new Date(a.nextAppointment).getTime() - new Date(b.nextAppointment).getTime();
      default:
        return 0;
    }
  });
};

/**
 * Check if date is available for appointments
 */
export const isDateAvailable = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today && date.getDay() !== 0 && date.getDay() !== 6; // No weekends
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

/**
 * Check if user has permission
 */
export const hasPermission = (userRole: string, requiredPermission: string): boolean => {
  const permissions = {
    admin: ['read', 'write', 'delete', 'approve'],
    provider: ['read', 'write', 'approve'],
    nurse: ['read', 'write'],
    staff: ['read']
  };
  
  return permissions[userRole as keyof typeof permissions]?.includes(requiredPermission) || false;
};

/**
 * Generate AI suggestion confidence score
 */
export const generateConfidenceScore = (factors: string[]): number => {
  // Simulate confidence calculation based on various factors
  const baseScore = 70;
  const factorBonus = factors.length * 5;
  const randomVariation = Math.random() * 20 - 10; // ±10 points
  
  return Math.max(0, Math.min(100, baseScore + factorBonus + randomVariation));
};

/**
 * Export data to CSV
 */
export const exportToCSV = (data: any[], filename: string): void => {
  if (!data.length) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Local storage helpers
 */
export const storage = {
  get: (key: string): any => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }
};