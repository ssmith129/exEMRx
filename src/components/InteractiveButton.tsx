import React, { useState } from 'react';
import { useNotifications } from './NotificationSystem';
import { Loader2 } from 'lucide-react';

interface InteractiveButtonProps {
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

export default function InteractiveButton({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  ripple = true
}: InteractiveButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [rippleEffect, setRippleEffect] = useState<{ x: number; y: number; id: number } | null>(null);
  const [internalLoading, setInternalLoading] = useState(false);
  const { addNotification } = useNotifications();

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return `
          bg-primary-600 text-white border-primary-600
          hover:bg-primary-700 hover:border-primary-700
          focus:ring-primary-500 focus:bg-primary-700
          active:bg-primary-800 active:border-primary-800
          disabled:bg-primary-300 disabled:border-primary-300
        `;
      case 'secondary':
        return `
          bg-white text-gray-700 border-gray-300
          hover:bg-gray-50 hover:border-gray-400
          focus:ring-primary-500 focus:border-primary-500
          active:bg-gray-100
          disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200
        `;
      case 'success':
        return `
          bg-green-600 text-white border-green-600
          hover:bg-green-700 hover:border-green-700
          focus:ring-green-500 focus:bg-green-700
          active:bg-green-800 active:border-green-800
          disabled:bg-green-300 disabled:border-green-300
        `;
      case 'danger':
        return `
          bg-red-600 text-white border-red-600
          hover:bg-red-700 hover:border-red-700
          focus:ring-red-500 focus:bg-red-700
          active:bg-red-800 active:border-red-800
          disabled:bg-red-300 disabled:border-red-300
        `;
      case 'ghost':
        return `
          bg-transparent text-gray-700 border-transparent
          hover:bg-gray-100
          focus:ring-primary-500 focus:bg-gray-100
          active:bg-gray-200
          disabled:text-gray-400
        `;
      default:
        return '';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'md':
        return 'px-4 py-3 text-sm';
      case 'lg':
        return 'px-6 py-4 text-base';
      default:
        return 'px-4 py-3 text-sm';
    }
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading || internalLoading) return;

    // Ripple effect
    if (ripple) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      
      setRippleEffect({ x, y, id });
      setTimeout(() => setRippleEffect(null), 600);
    }

    // Press effect
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);

    // Handle async onClick
    if (onClick) {
      try {
        setInternalLoading(true);
        await onClick();
        
        // Show success feedback for important actions
        if (variant === 'primary' && !loading) {
          addNotification({
            type: 'success',
            title: 'Action Completed',
            message: 'Your action was completed successfully.',
            duration: 2000
          });
        }
      } catch (error) {
        console.error('Button click error:', error);
        addNotification({
          type: 'error',
          title: 'Action Failed',
          message: 'There was an error completing your action. Please try again.',
          duration: 4000
        });
      } finally {
        setInternalLoading(false);
      }
    }
  };

  const isLoading = loading || internalLoading;
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      className={`
        relative overflow-hidden inline-flex items-center justify-center
        font-medium border rounded-lg transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:cursor-not-allowed
        transform-gpu
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${fullWidth ? 'w-full' : ''}
        ${isPressed ? 'scale-95' : 'scale-100'}
        ${className}
      `}
    >
      {/* Ripple Effect */}
      {rippleEffect && (
        <span
          className="absolute bg-white bg-opacity-30 rounded-full animate-ping"
          style={{
            left: rippleEffect.x - 10,
            top: rippleEffect.y - 10,
            width: 20,
            height: 20,
          }}
        />
      )}

      {/* Loading Spinner */}
      {isLoading && (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      )}

      {/* Left Icon */}
      {icon && iconPosition === 'left' && !isLoading && (
        <span className="mr-2 flex-shrink-0">
          {icon}
        </span>
      )}

      {/* Button Content */}
      <span className={isLoading ? 'opacity-70' : ''}>
        {children}
      </span>

      {/* Right Icon */}
      {icon && iconPosition === 'right' && !isLoading && (
        <span className="ml-2 flex-shrink-0">
          {icon}
        </span>
      )}
    </button>
  );
}