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
          bg-primary-500 text-white border-primary-500 shadow-soft
          hover:bg-primary-600 hover:border-primary-600 hover:shadow-medium
          focus:ring-primary-500/30 focus:bg-primary-600
          active:bg-primary-700 active:border-primary-700
          disabled:bg-secondary-300 disabled:border-secondary-300 disabled:shadow-none
        `;
      case 'secondary':
        return `
          bg-white text-secondary-700 border-secondary-200 shadow-soft
          hover:bg-secondary-50 hover:border-secondary-300 hover:shadow-medium
          focus:ring-primary-500 focus:border-primary-500
          active:bg-secondary-100
          disabled:bg-secondary-50 disabled:text-secondary-400 disabled:border-secondary-200 disabled:shadow-none
        `;
      case 'success':
        return `
          bg-success-500 text-white border-success-500 shadow-soft
          hover:bg-success-600 hover:border-success-600 hover:shadow-medium
          focus:ring-success-500/30 focus:bg-success-600
          active:bg-success-700 active:border-success-700
          disabled:bg-success-300 disabled:border-success-300 disabled:shadow-none
        `;
      case 'danger':
        return `
          bg-red-600 text-white border-red-600
          hover:bg-red-700 hover:border-red-700 hover:shadow-medium
          focus:ring-red-500/30 focus:bg-red-700
          active:bg-red-800 active:border-red-800
          disabled:bg-red-300 disabled:border-red-300 disabled:shadow-none
        `;
      case 'ghost':
        return `
          bg-transparent text-secondary-700 border-transparent
          hover:bg-secondary-100
          focus:ring-primary-500/30 focus:bg-secondary-100
          active:bg-secondary-200
          disabled:text-secondary-400
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
        font-medium border rounded-xl transition-all duration-300 ease-out
        focus:outline-none focus:ring-4 focus:ring-offset-0
        disabled:cursor-not-allowed
        transform-gpu
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${fullWidth ? 'w-full' : ''}
        ${isPressed ? 'scale-[0.98]' : 'scale-100'}
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