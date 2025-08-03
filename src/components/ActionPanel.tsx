import React, { useState } from 'react';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  RotateCcw,
  Save,
  Download,
  Share2,
  Settings,
  RefreshCw
} from 'lucide-react';
import InteractiveButton from './InteractiveButton';

interface ActionPanelProps {
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

export default function ActionPanel({
  title,
  children,
  onClose,
  position = 'right',
  size = 'md',
  resizable = false,
  collapsible = false,
  actions = [],
  className = ''
}: ActionPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [panelWidth, setPanelWidth] = useState(getSizeWidth());
  const [isResizing, setIsResizing] = useState(false);

  function getSizeWidth() {
    switch (size) {
      case 'sm': return 320;
      case 'md': return 400;
      case 'lg': return 480;
      case 'xl': return 640;
      default: return 400;
    }
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'left':
        return 'left-0 top-0 h-full';
      case 'bottom':
        return 'bottom-0 left-0 right-0 h-96';
      case 'right':
      default:
        return 'right-0 top-0 h-full';
    }
  };

  const getPanelStyle = () => {
    if (position === 'bottom') {
      return { height: isCollapsed ? '60px' : '384px' };
    }
    
    if (isMaximized) {
      return { width: '100vw' };
    }
    
    return { 
      width: isCollapsed ? '60px' : `${panelWidth}px`,
      minWidth: isCollapsed ? '60px' : '280px',
      maxWidth: '80vw'
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!resizable || isCollapsed || isMaximized) return;
    
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = panelWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = position === 'right' ? startX - e.clientX : e.clientX - startX;
      const newWidth = Math.max(280, Math.min(800, startWidth + deltaX));
      setPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-600 bg-opacity-25 z-50 lg:hidden" onClick={onClose} />
      
      {/* Panel */}
      <div
        className={`
          fixed bg-white shadow-xl border-l border-gray-200 z-50 flex flex-col
          transition-all duration-300 ease-in-out
          ${getPositionClasses()}
          ${className}
        `}
        style={getPanelStyle()}
      >
        {/* Resize Handle */}
        {resizable && !isCollapsed && !isMaximized && position !== 'bottom' && (
          <div
            className={`
              absolute top-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-primary-200
              transition-colors duration-200 z-10
              ${position === 'right' ? 'left-0' : 'right-0'}
              ${isResizing ? 'bg-primary-300' : ''}
            `}
            onMouseDown={handleMouseDown}
          />
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {title}
            </h2>
          )}
          
          <div className="flex items-center space-x-1">
            {/* Panel Controls */}
            {collapsible && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                title={isCollapsed ? 'Expand' : 'Collapse'}
              >
                {isCollapsed ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </button>
            )}
            
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              title={isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {!isCollapsed && (
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        )}

        {/* Actions Footer */}
        {!isCollapsed && actions.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex flex-wrap gap-2">
              {actions.map((action, index) => (
                <InteractiveButton
                  key={index}
                  variant={action.variant || 'secondary'}
                  size="sm"
                  onClick={action.onClick}
                  loading={action.loading}
                  icon={action.icon}
                  className="flex-1 min-w-0"
                >
                  {action.label}
                </InteractiveButton>
              ))}
            </div>
          </div>
        )}

        {/* Collapsed State */}
        {isCollapsed && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 p-2">
            <button
              onClick={() => setIsCollapsed(false)}
              className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Expand Panel"
            >
              <Maximize2 className="h-5 w-5" />
            </button>
            
            {actions.slice(0, 3).map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title={action.label}
              >
                {action.icon}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}