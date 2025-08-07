import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MoreVertical } from 'lucide-react';

interface ResponsiveCardProps {
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

export default function ResponsiveCard({
  title,
  subtitle,
  children,
  collapsible = false,
  defaultExpanded = true,
  actions,
  className = '',
  variant = 'default',
  size = 'md',
  interactive = false,
  onClick
}: ResponsiveCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showActions, setShowActions] = useState(false);

  const getVariantClasses = () => {
    switch (variant) {
      case 'elevated':
        return 'bg-white shadow-xl border border-secondary-100/80 backdrop-blur-sm';
      case 'outlined':
        return 'bg-white border-2 border-secondary-200 hover:border-primary-300 transition-colors';
      case 'filled':
        return 'bg-gradient-to-br from-secondary-50 to-primary-50/30 border border-secondary-100';
      default:
        return 'bg-white shadow-lg border border-secondary-100/80 hover:shadow-xl transition-shadow duration-300';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-4';
      case 'md':
        return 'p-6';
      case 'lg':
        return 'p-8';
      default:
        return 'p-6';
    }
  };

  const handleCardClick = () => {
    if (interactive && onClick) {
      onClick();
    }
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`
        rounded-xl transition-all duration-300 ease-out
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${interactive ? 'cursor-pointer hover:shadow-medium transform hover:-translate-y-1 hover:scale-[1.02]' : ''}
        ${className}
      `}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-secondary-900 truncate">
              {title}
            </h3>
            {collapsible && (
              <button
                onClick={handleToggleExpand}
                className="p-1 text-secondary-400 hover:text-secondary-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center space-x-2 ml-4">
            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center space-x-2">
              {actions}
            </div>
            
            {/* Mobile Actions Menu */}
            <div className="sm:hidden relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions(!showActions);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              
              {showActions && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowActions(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    <div className="py-2">
                      {actions}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className={`
          transition-all duration-300 ease-in-out overflow-hidden
          ${isExpanded ? 'opacity-100 max-h-none' : 'opacity-0 max-h-0'}
        `}
      >
        {children}
      </div>

      {/* Collapsed Preview */}
      {collapsible && !isExpanded && (
        <div className="text-sm text-gray-500 italic">
          Click to expand content...
        </div>
      )}
    </div>
  );
}