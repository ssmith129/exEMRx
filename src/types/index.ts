// Global type definitions for ezEMRx

export interface Patient {
  id: number;
  name: string;
  dob: string;
  age: string;
  mrn: string;
  phone: string;
  address: string;
  lastVisit: string;
  nextAppointment: string;
  status: 'active' | 'inactive' | 'pending';
  program: string;
  alerts: string[];
}

export interface Appointment {
  id: number;
  patient: string;
  date: string;
  time: string;
  type: string;
  provider: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
}

export interface Provider {
  id: number;
  name: string;
  specialty: string;
  location: string;
  distance: string;
  waitTime: string;
  acceptsInsurance: boolean;
  rating: number;
  phone?: string;
}

export interface AIInsight {
  id: number;
  type: string;
  title: string;
  confidence: 'high' | 'medium' | 'low';
  content: string;
  source: string;
  recommendation: string;
}

export interface AISuggestion {
  value: string;
  confidence: 'high' | 'medium' | 'low';
  source: string;
}

export interface ClinicalNote {
  id: number;
  author: string;
  role: string;
  content: string;
  timestamp: string;
  edited: boolean;
  approved: boolean;
  replies?: ClinicalNote[];
}

export interface ComplianceItem {
  id: number;
  category: string;
  item: string;
  status: 'complete' | 'warning' | 'error' | 'pending';
  required: boolean;
  fieldId: string;
  notes: string;
}

export interface FormData {
  [key: string]: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  clinic: string;
}

export interface ActivityItem {
  id: number;
  type: 'charting' | 'referral' | 'compliance' | 'appointment';
  patient: string;
  action: string;
  time: string;
  status: 'completed' | 'pending' | 'in-progress';
  aiAssisted: boolean;
}

export interface Referral {
  id: number;
  patient: string;
  provider: Provider;
  reason: string;
  priority: 'Routine' | 'Urgent' | 'STAT';
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  createdDate: string;
  notes?: string;
}

// Component prop types
export interface InteractiveInputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'search';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  success?: boolean;
  disabled?: boolean;
  aiSuggestion?: AISuggestion;
  options?: string[];
  onAcceptSuggestion?: () => void;
  onRejectSuggestion?: () => void;
  className?: string;
  rows?: number;
}

export interface InteractiveButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void | Promise<void>;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  ripple?: boolean;
}

export interface ResponsiveCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  actions?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onClick?: () => void;
}

export interface ActionPanelProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  position?: 'right' | 'left' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  resizable?: boolean;
  collapsible?: boolean;
  actions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void | Promise<void>;
    variant?: 'primary' | 'secondary' | 'success' | 'danger';
    loading?: boolean;
  }>;
  className?: string;
}