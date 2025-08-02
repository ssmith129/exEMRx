import React, { useState, useEffect } from 'react';
import { Check, Loader2, Heart, Star, Bookmark, Share2, Copy } from 'lucide-react';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  animation?: 'pulse' | 'bounce' | 'shake' | 'glow' | 'ripple';
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  icon,
  animation = 'ripple'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;

    // Ripple effect
    if (animation === 'ripple') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      
      setRipples(prev => [...prev, { x, y, id }]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 600);
    }

    if (onClick) {
      try {
        setIsLoading(true);
        await onClick();
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 2000);
      } catch (error) {
        console.error('Button action failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500';
      case 'secondary':
        return 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500';
      case 'success':
        return 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
      default:
        return 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'px-3 py-2 text-sm';
      case 'md': return 'px-4 py-3 text-sm';
      case 'lg': return 'px-6 py-4 text-base';
      default: return 'px-4 py-3 text-sm';
    }
  };

  const getAnimationClasses = () => {
    switch (animation) {
      case 'pulse': return 'animate-pulse';
      case 'bounce': return 'hover:animate-bounce';
      case 'shake': return 'hover:animate-shake';
      case 'glow': return 'hover:shadow-lg hover:shadow-primary-500/25';
      default: return '';
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`
        relative overflow-hidden inline-flex items-center justify-center
        font-medium rounded-lg transition-all duration-200 transform
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:scale-105 active:scale-95
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${getAnimationClasses()}
        ${className}
      `}
    >
      {/* Ripple Effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white bg-opacity-30 rounded-full animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}

      {/* Button Content */}
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : isSuccess ? (
        <Check className="h-4 w-4 mr-2 text-green-400" />
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      
      <span className={isLoading ? 'opacity-70' : ''}>
        {isSuccess ? 'Success!' : children}
      </span>
    </button>
  );
};

interface FloatingActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  color?: string;
  tooltip?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  onClick,
  position = 'bottom-right',
  color = 'bg-primary-600',
  tooltip
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right': return 'bottom-6 right-6';
      case 'bottom-left': return 'bottom-6 left-6';
      case 'top-right': return 'top-6 right-6';
      case 'top-left': return 'top-6 left-6';
      default: return 'bottom-6 right-6';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed z-40 w-14 h-14 rounded-full shadow-lg
          flex items-center justify-center text-white
          transition-all duration-300 transform
          hover:scale-110 hover:shadow-xl active:scale-95
          ${color} ${getPositionClasses()}
        `}
      >
        <div className="transform transition-transform duration-200">
          {icon}
        </div>
      </button>
      
      {tooltip && isHovered && (
        <div className={`
          fixed z-50 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg
          transform -translate-x-full -translate-y-1/2
          ${position.includes('right') ? 'right-20' : 'left-20'}
          ${position.includes('bottom') ? 'bottom-10' : 'top-10'}
        `}>
          {tooltip}
          <div className={`
            absolute top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45
            ${position.includes('right') ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'}
          `} />
        </div>
      )}
    </div>
  );
};

interface LikeButtonProps {
  initialLiked?: boolean;
  onToggle?: (liked: boolean) => void;
  count?: number;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  initialLiked = false,
  onToggle,
  count = 0
}) => {
  const [liked, setLiked] = useState(initialLiked);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setLiked(!liked);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    onToggle?.(!liked);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <Heart 
        className={`
          h-5 w-5 transition-all duration-300 transform
          ${liked ? 'text-red-500 fill-current scale-110' : 'text-gray-400'}
          ${isAnimating ? 'animate-bounce' : ''}
        `} 
      />
      <span className="text-sm text-gray-600">{count + (liked ? 1 : 0)}</span>
    </button>
  );
};

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  onRate,
  readonly = false,
  size = 'md'
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'h-4 w-4';
      case 'md': return 'h-5 w-5';
      case 'lg': return 'h-6 w-6';
      default: return 'h-5 w-5';
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hoverRating || rating);
        
        return (
          <button
            key={index}
            onClick={() => !readonly && onRate?.(starValue)}
            onMouseEnter={() => !readonly && setHoverRating(starValue)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            disabled={readonly}
            className={`
              transition-all duration-200 transform
              ${readonly ? 'cursor-default' : 'hover:scale-110 cursor-pointer'}
            `}
          >
            <Star
              className={`
                ${getSizeClass()}
                transition-colors duration-200
                ${isFilled ? 'text-yellow-400 fill-current' : 'text-gray-300'}
              `}
            />
          </button>
        );
      })}
    </div>
  );
};

interface CopyButtonProps {
  text: string;
  children?: React.ReactNode;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  children,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        inline-flex items-center space-x-2 px-3 py-2 text-sm
        bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors
        ${className}
      `}
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <Copy className="h-4 w-4 text-gray-600" />
      )}
      <span>{copied ? 'Copied!' : (children || 'Copy')}</span>
    </button>
  );
};

interface BookmarkButtonProps {
  initialBookmarked?: boolean;
  onToggle?: (bookmarked: boolean) => void;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  initialBookmarked = false,
  onToggle
}) => {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);

  const handleClick = () => {
    setBookmarked(!bookmarked);
    onToggle?.(!bookmarked);
  };

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <Bookmark
        className={`
          h-5 w-5 transition-all duration-300
          ${bookmarked ? 'text-blue-600 fill-current' : 'text-gray-400'}
        `}
      />
    </button>
  );
};

interface ShareButtonProps {
  url?: string;
  title?: string;
  text?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  url = window.location.href,
  title = document.title,
  text = ''
}) => {
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ url, title, text });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (error) {
        console.error('Failed to copy URL:', error);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <Share2 className="h-5 w-5 text-gray-600" />
      <span className="text-sm text-gray-600">
        {shared ? 'Shared!' : 'Share'}
      </span>
    </button>
  );
};