import React, { useState, useRef, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  AlertCircle, 
  Info,
  Sparkles,
  ChevronDown,
  Search,
  Loader2,
  HelpCircle
} from 'lucide-react';

interface InteractiveInputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'search';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  success?: boolean;
  disabled?: boolean;
  validating?: boolean;
  helpText?: string;
  showCharacterCount?: boolean;
  maxLength?: number;
  strengthIndicator?: boolean;
  aiSuggestion?: {
    value: string;
    confidence: 'high' | 'medium' | 'low';
    source: string;
  };
  options?: string[];
  onAcceptSuggestion?: () => void;
  onRejectSuggestion?: () => void;
  className?: string;
  rows?: number;
}

export default function InteractiveInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  success = false,
  disabled = false,
  validating = false,
  helpText,
  showCharacterCount = false,
  maxLength,
  strengthIndicator = false,
  aiSuggestion,
  options = [],
  onAcceptSuggestion,
  onRejectSuggestion,
  className = '',
  rows = 3
}: InteractiveInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(!!aiSuggestion);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (type === 'search' && value) {
      const filtered = options.filter(option =>
        option.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [value, options, type]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, text: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    const strength = [
      { text: 'Very Weak', color: 'bg-red-500' },
      { text: 'Weak', color: 'bg-orange-500' },
      { text: 'Fair', color: 'bg-yellow-500' },
      { text: 'Good', color: 'bg-blue-500' },
      { text: 'Strong', color: 'bg-green-500' }
    ];
    
    return { score, ...strength[Math.min(score, 4)] };
  };

  const passwordStrength = type === 'password' && strengthIndicator ? getPasswordStrength(value) : null;

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAcceptSuggestion = () => {
    if (aiSuggestion) {
      onChange(aiSuggestion.value);
      setShowSuggestion(false);
      onAcceptSuggestion?.();
    }
  };

  const handleRejectSuggestion = () => {
    setShowSuggestion(false);
    onRejectSuggestion?.();
  };

  const handleOptionSelect = (option: string) => {
    onChange(option);
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  const getInputClasses = () => {
    let classes = `
      block w-full px-4 py-4 border rounded-lg text-sm transition-all duration-200 leading-relaxed
      placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500
      focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500
      disabled:cursor-not-allowed
    `;

    if (error) {
      classes += ' border-red-500 bg-red-50 text-red-900 placeholder-red-400';
    } else if (validating) {
      classes += ' border-blue-300 bg-blue-50/50';
    } else if (success) {
      classes += ' border-green-500 bg-green-50';
    } else if (focused) {
      classes += ' border-primary-500 bg-white shadow-sm';
    } else {
      classes += ' border-gray-300 bg-white hover:border-gray-400';
    }

    if (type === 'password' || aiSuggestion) {
      classes += ' pr-12';
    }

    if (type === 'select') {
      classes += ' cursor-pointer';
    }

    return classes;
  };

  const renderInput = () => {
    const commonProps = {
      ref: inputRef as any,
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
      onFocus: () => {
        setFocused(true);
        if (onFocus) onFocus();
      },
      onBlur: () => {
        setFocused(false);
        if (onBlur) onBlur();
      },
      placeholder,
      disabled,
      maxLength,
      className: getInputClasses(),
      'aria-describedby': error ? `${label}-error` : undefined,
      'aria-invalid': !!error,
      required,
      'aria-busy': validating
    };

    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={rows}
            className={`${commonProps.className} resize-none leading-relaxed py-4`}
          />
        );

      case 'password':
        return (
          <input
            {...commonProps}
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
          />
        );

      case 'email':
        return (
          <input
            {...commonProps}
            type="email"
            autoComplete="email"
          />
        );

      case 'search':
        return (
          <div className="relative">
            <input
              {...commonProps}
              type="text"
              className={`${commonProps.className} pl-10`}
              onFocus={() => {
                setFocused(true);
                setIsDropdownOpen(true);
                if (commonProps.onFocus) commonProps.onFocus();
              }}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        );

      case 'select':
        return (
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              disabled={disabled}
              className={`${getInputClasses()} text-left flex items-center justify-between`}
            >
              <span className={value ? 'text-gray-900' : 'text-gray-400'}>
                {value || placeholder}
              </span>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                {filteredOptions.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleOptionSelect(option)}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none first:rounded-t-lg last:rounded-b-lg"
                  >
                    {option}
                  </button>
                ))}
                {filteredOptions.length === 0 && (
                  <div className="px-4 py-3 text-sm text-gray-500">No options found</div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return <input {...commonProps} type="text" />;
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {aiSuggestion && showSuggestion && (
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getConfidenceColor(aiSuggestion.confidence)}`}>
              <Sparkles className="h-3 w-3 mr-1" />
              {aiSuggestion.confidence} confidence
            </span>
            <button
              type="button"
              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              title={`AI Source: ${aiSuggestion.source}`}
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Input Container */}
      <div className="relative">
        {renderInput()}

        {/* Validating Indicator */}
        {validating && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
          </div>
        )}
        {/* Search Dropdown */}
        {type === 'search' && isDropdownOpen && filteredOptions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredOptions.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleOptionSelect(option)}
                className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none first:rounded-t-lg last:rounded-b-lg"
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* Password Toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        )}

        {/* Success/Error Icons */}
        {(success || error) && !validating && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {success ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
        )}
      </div>

      {/* AI Suggestion */}
      {aiSuggestion && showSuggestion && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-start space-x-2">
            <Sparkles className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-800 font-medium">AI Suggestion:</p>
              <p className="text-sm text-blue-700 mb-2">{aiSuggestion.value}</p>
              <p className="text-xs text-blue-600">{aiSuggestion.source}</p>
            </div>
            <div className="flex space-x-1">
              <button
                type="button"
                onClick={handleAcceptSuggestion}
                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={handleRejectSuggestion}
                className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                Override
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Character Count */}
      {showCharacterCount && maxLength && (
        <div className="flex justify-end text-xs text-gray-500 mt-1">
          <span className={value.length > maxLength * 0.9 ? 'text-orange-600' : ''}>
            {value.length}/{maxLength}
          </span>
        </div>
      )}

      {/* Password Strength Indicator */}
      {passwordStrength && value && (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Password strength:</span>
            <span className={`text-xs font-medium ${
              passwordStrength.score >= 4 ? 'text-green-600' :
              passwordStrength.score >= 3 ? 'text-blue-600' :
              passwordStrength.score >= 2 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {passwordStrength.text}
            </span>
          </div>
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded ${
                  i < passwordStrength.score ? passwordStrength.color : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          {passwordStrength.score < 3 && (
            <p className="text-xs text-gray-600 mt-1">
              Use 8+ characters with a mix of letters, numbers, and symbols
            </p>
          )}
        </div>
      )}

      {/* Help Text */}
      {helpText && !error && (
        <div className="flex items-start text-xs text-gray-600 mt-1">
          <HelpCircle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
          <span>{helpText}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div 
          id={`${label}-error`} 
          className="flex items-start text-sm text-red-600 animate-in slide-in-from-top-1 duration-200 mt-1"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && !error && (
        <div className="flex items-center text-sm text-green-600 animate-in slide-in-from-top-1 duration-200 mt-1">
          <Check className="h-4 w-4 mr-1 flex-shrink-0" />
          Field validated successfully
        </div>
      )}
    </div>
  );
}