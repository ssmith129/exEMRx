import React from 'react';
import LayoutWithEnhancedNav from './LayoutWithEnhancedNav';
import { FileText, Users, Calendar, BarChart3, Settings, HelpCircle } from 'lucide-react';

export default function NavigationDemo() {
  return (
    <LayoutWithEnhancedNav />
  );
}

// Demo content for the main area
export function NavigationDemoContent() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Enhanced Navigation System
        </h1>
        <p className="text-lg text-gray-600">
          This demo showcases the redesigned side navigation with improved hierarchy, 
          better visual design, and enhanced accessibility features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Hierarchical Structure</h3>
          </div>
          <p className="text-gray-600">
            Clear 3-level navigation hierarchy with logical grouping and proper indentation.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Enhanced UX</h3>
          </div>
          <p className="text-gray-600">
            Improved hover states, active indicators, and smooth transitions for better interaction.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Accessibility</h3>
          </div>
          <p className="text-gray-600">
            WCAG 2.1 AA compliant with proper ARIA labels, keyboard navigation, and screen reader support.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Responsive Design</h3>
          </div>
          <p className="text-gray-600">
            Adapts seamlessly from mobile to desktop with collapsible groups and overlay behavior.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Smart Features</h3>
          </div>
          <p className="text-gray-600">
            Recent activity tracking, intelligent badges, and contextual search functionality.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">User Context</h3>
          </div>
          <p className="text-gray-600">
            Rich user profile section with status indicators and quick access to preferences.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl border border-primary-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Improvements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Visual Enhancements</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Modern gradient backgrounds and improved typography</li>
              <li>• Enhanced color contrast and readability</li>
              <li>• Smooth animations and micro-interactions</li>
              <li>• Consistent spacing and visual hierarchy</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Functional Improvements</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Collapsible navigation groups for better organization</li>
              <li>• Smart badge system for notifications and status</li>
              <li>• Recent activity tracking and quick access</li>
              <li>• Keyboard navigation and focus management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
